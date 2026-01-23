"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const prismadatabase_1 = __importDefault(require("../../config/prismadatabase"));
const OTPGenerate_1 = require("../../utils/OTPGenerate");
const pagination_1 = require("../../utils/pagination");
class AuthRepository {
    constructor() {
        this.prisma = prismadatabase_1.default;
        this.createCustomRoleIfNotExists = async (roleName, tx) => {
            const prismaClient = tx || this.prisma;
            // Try to find existing role first
            let role = await prismaClient.role.findUnique({ where: { role: roleName } });
            if (role)
                return role;
            const permission = await prismaClient.permission.create({});
            role = await prismaClient.role.create({ data: { role: roleName, permissionId: permission.id } });
            return role;
        };
        // Add more methods as needed, e.g., setUserOTP, getAllUser, etc.
    }
    async createUser(payload, tx) {
        const { name, email, password, roleId, phone } = payload;
        if (!name || !password) {
            const error = new Error('name and password are required');
            error.statusCode = 400;
            throw error;
        }
        const userData = {
            name,
            email: email || '',
            password,
        };
        if (phone)
            userData.phone = phone;
        if (roleId)
            userData.roleId = roleId;
        console.log('Creating user with data:', userData);
        const newUser = await this.prisma.user.create({
            data: userData,
        });
        console.log('User created successfully:', newUser);
        return newUser;
    }
    async getUser() {
        return await this.prisma.user.findMany();
    }
    async getUserById(id) {
        return await this.prisma.user.findUnique({
            where: { id }
        });
    }
    async getUserBy(id) {
        console.log('Fetching user by ID:', id);
        return await this.prisma.user.findUnique({
            where: { id },
            include: {
                role: {
                    include: {
                        permission: true
                    }
                }
            }
        });
    }
    async saveOTP(userId, otp, expiresInMinutes = 5) {
        const otpHash = await (0, OTPGenerate_1.hashOTP)(otp);
        console.log('Saving OTP hash:', otpHash, 'for otp:', otp);
        const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);
        return await this.prisma.oTP.create({
            data: {
                userRefId: userId,
                otpHash,
                expiresAt,
                attempts: 0,
                verified: false,
            },
        });
    }
    async updateUserPassword(userId, password) {
        return await this.prisma.user.update({ where: { id: userId }, data: { password } });
    }
    async verifyOTP(userId, otp) {
        const otpRecord = await this.prisma.oTP.findFirst({
            where: { userRefId: userId },
            orderBy: { createdAt: 'desc' },
        });
        if (!otpRecord)
            return { success: false, reason: 'no_otp' };
        const now = new Date();
        if (otpRecord.expiresAt && new Date(otpRecord.expiresAt) < now) {
            return { success: false, reason: 'expired' };
        }
        // The OTP was stored using hashOTP (HMAC SHA256). Recompute and compare.
        const providedHash = (0, OTPGenerate_1.hashOTP)(String(otp));
        const isMatch = providedHash === otpRecord.otpHash;
        console.log('OTP match result:', isMatch, { otpRecord }, otp);
        if (isMatch) {
            await this.prisma.oTP.update({ where: { id: otpRecord.id }, data: { verified: true } });
            return { success: true };
        }
        // increment attempts and apply lockout if threshold reached
        const prevAttempts = otpRecord.attempts || 0;
        const newAttempts = prevAttempts + 1;
        const updates = { attempts: newAttempts };
        let reason = 'invalid';
        const MAX_ATTEMPTS = 5;
        if (newAttempts >= MAX_ATTEMPTS) {
            // lock for 1 hour by setting expiresAt to 1 hour from now
            const lockUntil = new Date(Date.now() + 60 * 60 * 1000);
            updates.expiresAt = lockUntil;
            reason = 'locked';
            console.warn(`OTP locked for userRefId=${otpRecord.userRefId} until ${lockUntil.toISOString()} after ${newAttempts} attempts`);
        }
        await this.prisma.oTP.update({ where: { id: otpRecord.id }, data: updates });
        return { success: false, reason };
    }
    async isOTPLocked(userId) {
        const otpRecord = await this.prisma.oTP.findFirst({ where: { userRefId: userId }, orderBy: { createdAt: 'desc' } });
        if (!otpRecord)
            return { locked: false, attempts: 0 };
        const attempts = otpRecord.attempts || 0;
        const MAX_ATTEMPTS = 5;
        const now = new Date();
        // We used expiresAt as lockUntil when attempts exceeded MAX_ATTEMPTS.
        if (attempts >= MAX_ATTEMPTS && otpRecord.expiresAt && new Date(otpRecord.expiresAt) > now) {
            return { locked: true, unlockTime: otpRecord.expiresAt, attempts };
        }
        return { locked: false, attempts };
    }
    async getAuthByEmail(email) {
        return await this.prisma.user.findUnique({ where: { email } });
    }
    async getAuthByEmailOrPhone(email, phone) {
        if (!email && !phone)
            return null;
        // Only include phone if it exists in the schema
        const orArr = [];
        if (email)
            orArr.push({ email });
        if (phone)
            orArr.push({ phone });
        return await this.prisma.user.findFirst({
            where: {
                OR: orArr,
            },
            include: {
                role: true,
            },
        });
    }
    // ====================================================
    // user repository services 
    // ====================================================
    async getUserWithPagination(payload) {
        return await (0, pagination_1.pagination)(payload, async (limit, offset, sortOrder) => {
            const [doc, totalDoc] = await Promise.all([
                this.prisma.user.findMany({
                    skip: offset,
                    take: limit,
                    // orderBy: sortOrder,
                    include: {
                        role: true,
                    },
                }),
                this.prisma.user.count(),
            ]);
            return { doc, totalDoc };
        });
    }
    async updateUserRole(userId, roleId) {
        return await this.prisma.user.update({
            where: { id: userId },
            data: { roleId },
            include: { role: true }
        });
    }
    async getUserRoleById(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { role: {
                    include: {
                        permission: true
                    }
                } }
        });
        return user === null || user === void 0 ? void 0 : user.role;
    }
}
exports.AuthRepository = AuthRepository;
// Export a singleton instance, similar to module.exports = new AuthRepository(UserSchema)
const authRepository = new AuthRepository();
exports.default = authRepository;
