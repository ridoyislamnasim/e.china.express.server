"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const prismadatabase_1 = __importDefault(require("../../config/prismadatabase"));
class AuthRepository {
    constructor() {
        this.prisma = prismadatabase_1.default;
        // Add more methods as needed, e.g., setUserOTP, getAllUser, etc.
    }
    async createUser(payload) {
        const { name, email, password, role, phone } = payload;
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
        if (role)
            userData.role = role;
        // console.log('Creating user with data:', userData);
        const newUser = await this.prisma.user.create({
            data: userData,
        });
        return newUser;
    }
    async getUser() {
        return await this.prisma.user.findMany();
    }
    async getUserById(id) {
        return await this.prisma.user.findUnique({ where: { id } });
    }
    async updateUserPassword(userId, password) {
        return await this.prisma.user.update({ where: { id: userId }, data: { password } });
    }
    async getAuthByEmail(email) {
        return await this.prisma.user.findUnique({ where: { email } });
    }
    // Prisma does not support $or in the same way as Mongoose, so we use OR array
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
        });
    }
}
exports.AuthRepository = AuthRepository;
// Export a singleton instance, similar to module.exports = new AuthRepository(UserSchema)
const authRepository = new AuthRepository();
exports.default = authRepository;
