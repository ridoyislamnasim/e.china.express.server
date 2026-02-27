"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const pagination_1 = require("../../utils/pagination");
const prismadatabase_1 = __importDefault(require("../../config/prismadatabase"));
const OTPGenerate_1 = require("../../utils/OTPGenerate");
class AuthRepository {
    constructor() {
        this.prisma = prismadatabase_1.default;
        this.createCustomRoleIfNotExists = async (roleName, tx) => {
            const prismaClient = tx || this.prisma;
            // Try to find existing role first
            let role = await prismaClient.role.findUnique({
                where: { role: roleName },
            });
            if (role)
                return role;
            const permission = await prismaClient.permission.create({});
            role = await prismaClient.role.create({
                data: { role: roleName, permissionId: permission.id },
            });
            return role;
        };
<<<<<<< HEAD
        // Add more methods as needed, e.g., setUserOTP, getAllUser, etc.
        // Add more methods as needed, e.g., setUserOTP, getAllUser, etc.
        // Add more methods as needed, e.g., setUserOTP, getAllUser, etc.
=======
>>>>>>> 5844e17091087556f432e55a9af8795fef6e3ae3
    }
    async createUser(payload, tx) {
        const { name, email, password, roleId, phone, countryCode } = payload;
        const prismaClient = tx || this.prisma;
        let currency = "RMB";
        let category = "personal";
        if (countryCode === "BD") {
            currency = "BDT";
            category = "local";
        }
        else if (countryCode === "IN") {
            currency = "INA";
            category = "local";
        }
        else if (countryCode === "PK") {
            currency = "PAK";
            category = "local";
        }
        else if (countryCode === "SA") {
            currency = "SUA";
            category = "local";
        }
        const userData = {
            name,
            email: email || "",
            password,
            phone,
            countryCode: countryCode,
            wallets: {
                create: {
                    name: `Default ${currency} Wallet`,
                    currency: currency,
                    balance: 0,
                    status: "active",
                    monthlyLimit: 50000,
                    category: category,
                    cardNumber: `62${Math.floor(Math.random() * 10000000000000)}`.slice(0, 16),
                    expiryDate: "12/29",
                    cvv: "123",
                },
            },
        };
        return await prismaClient.user.create({
            data: userData,
            include: { wallets: true },
        });
    }
<<<<<<< HEAD
=======
    async updateUserById(userId, payload, tx) {
        const prismaClient = tx || this.prisma;
        return await prismaClient.user.update({
            where: { id: userId },
            data: payload,
        });
    }
>>>>>>> 5844e17091087556f432e55a9af8795fef6e3ae3
    async getUser(payload) {
        const { role } = payload;
        const whereClause = {};
        if (role)
<<<<<<< HEAD
            whereClause.role = { role: role };
=======
            whereClause.role = { role: { equals: role, mode: "insensitive" } };
>>>>>>> 5844e17091087556f432e55a9af8795fef6e3ae3
        return await this.prisma.user.findMany({
            where: whereClause,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                createdAt: true,
                updatedAt: true,
                role: true,
            },
        });
    }
    async getUserById(id) {
        return await this.prisma.user.findUnique({
            where: { id },
        });
    }
    async getUserBy(id) {
        console.log("Fetching user by ID:", id);
        // "id": 6,
        //     "email": "superadmin@example.com",
        //     "phone": "0000000000",
        //     "password": "$2b$10$mOeRQ8Qd17zlVt1yVQQe3uKi1I9cV8hMCDufknD2KR3WX1fPP5VvS",
        //     "name": "Super Admin",
        //     "avatar": null,
        //     "bio": null,
        //     "countryCode": "",
        //     "isVerified": false,
        //     "language": "us",
        //     "languageName": "English",
        //     "currencyCode": "USD",
        //     "currencyName": "US Dollar",
        //     "currencySymbol": "$",
        //     "roleId": 2,
        return await this.prisma.user.findUnique({
            where: { id },
            // include: {
            //   wallets: true,
            //   role: {
            //     include: {
            //       permission: true,
            //     },
            //   },
            // },
            select: {
                id: true,
                email: true,
                phone: true,
                name: true,
                avatar: true,
                bio: true,
                countryCode: true,
                language: true,
                languageName: true,
                currencyCode: true,
                currencyName: true,
                currencySymbol: true,
                isVerified: true,
                wallets: true,
                role: {
                    include: {
                        permission: true,
                    },
                },
            },
        });
    }
    async saveOTP(userId, otp, expiresInMinutes = 5) {
        const otpHash = await (0, OTPGenerate_1.hashOTP)(otp);
        console.log("Saving OTP hash:", otpHash, "for otp:", otp);
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
        return await this.prisma.user.update({
            where: { id: userId },
            data: { password },
        });
    }
    async verifyOTP(userId, otp) {
        const otpRecord = await this.prisma.oTP.findFirst({
            where: { userRefId: userId },
            orderBy: { createdAt: "desc" },
        });
        if (!otpRecord)
            return { success: false, reason: "no_otp" };
        const now = new Date();
        if (otpRecord.expiresAt && new Date(otpRecord.expiresAt) < now) {
            return { success: false, reason: "expired" };
        }
        // The OTP was stored using hashOTP (HMAC SHA256). Recompute and compare.
        const providedHash = (0, OTPGenerate_1.hashOTP)(String(otp));
        const isMatch = providedHash === otpRecord.otpHash;
        console.log("OTP match result:", isMatch, { otpRecord }, otp);
        if (isMatch) {
            await this.prisma.oTP.update({
                where: { id: otpRecord.id },
                data: { verified: true },
            });
            return { success: true };
        }
        // increment attempts and apply lockout if threshold reached
        const prevAttempts = otpRecord.attempts || 0;
        const newAttempts = prevAttempts + 1;
        const updates = { attempts: newAttempts };
        let reason = "invalid";
        const MAX_ATTEMPTS = 5;
        if (newAttempts >= MAX_ATTEMPTS) {
            // lock for 1 hour by setting expiresAt to 1 hour from now
            const lockUntil = new Date(Date.now() + 60 * 60 * 1000);
            updates.expiresAt = lockUntil;
            reason = "locked";
            console.warn(`OTP locked for userRefId=${otpRecord.userRefId} until ${lockUntil.toISOString()} after ${newAttempts} attempts`);
        }
        await this.prisma.oTP.update({
            where: { id: otpRecord.id },
            data: updates,
        });
        return { success: false, reason };
    }
    async isOTPLocked(userId) {
        const otpRecord = await this.prisma.oTP.findFirst({
            where: { userRefId: userId },
            orderBy: { createdAt: "desc" },
        });
        if (!otpRecord)
            return { locked: false, attempts: 0 };
        const attempts = otpRecord.attempts || 0;
        const MAX_ATTEMPTS = 5;
        const now = new Date();
        // We used expiresAt as lockUntil when attempts exceeded MAX_ATTEMPTS.
        if (attempts >= MAX_ATTEMPTS &&
            otpRecord.expiresAt &&
            new Date(otpRecord.expiresAt) > now) {
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
        const query = {};
        if (payload.roleId) {
            query.roleId = Number(payload.roleId);
        }
        return await (0, pagination_1.pagination)(payload, async (limit, offset, sortOrder) => {
            const [doc, totalDoc] = await Promise.all([
                this.prisma.user.findMany({
                    where: query,
                    skip: offset,
                    take: limit,
                    orderBy: {
                        id: sortOrder,
                    },
                    include: {
                        role: true,
                    },
                }),
                this.prisma.user.count({ where: query }),
            ]);
            return { doc, totalDoc };
        });
    }
    async updateUserRole(userId, roleId) {
        return await this.prisma.user.update({
            where: { id: userId },
            data: { roleId },
            include: { role: true },
        });
    }
    async getUserRoleById(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                role: {
                    include: {
                        permission: true,
                    },
                },
            },
        });
        return user === null || user === void 0 ? void 0 : user.role;
    }
    // Add more methods as needed, e.g., setUserOTP, getAllUser, etc.
    // Add more methods as needed, e.g., setUserOTP, getAllUser, etc.
    async getAllUsersWithWallets() {
        return await this.prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                wallets: true, // Fetches the array of wallets
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
}
exports.AuthRepository = AuthRepository;
// Export a singleton instance, similar to module.exports = new AuthRepository(UserSchema)
const authRepository = new AuthRepository();
exports.default = authRepository;
