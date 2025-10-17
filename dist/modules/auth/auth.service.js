"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
// AuthService (TypeScript version)
const auth_repository_1 = __importDefault(require("./auth.repository"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../../utils/jwt");
const errors_1 = require("../../utils/errors");
class AuthService {
    // private roleRepository: RoleRepository;
    constructor(repository = auth_repository_1.default) {
        this.repository = repository;
    }
    async authUserSignUp(payload, session) {
        const { name, email, phone, password } = payload;
        if (!name || !phone || !password) {
            const error = new Error('name, phone and password are required');
            error.statusCode = 400;
            throw error;
        }
        if (password.length < 5) {
            const error = new Error('Password must be at least 5 characters');
            error.statusCode = 400;
            throw error;
        }
        if (email) {
            const auth = await this.repository.getAuthByEmail(email);
            if (auth) {
                const error = new Error('Email already exists');
                error.statusCode = 409;
                throw error;
            }
        }
        // Add phone unique check if phone is in schema
        const hashedPassword = await bcryptjs_1.default.hash(String(password), 10);
        const user = await this.repository.createUser({ ...payload, password: hashedPassword });
        return user;
    }
    async createUser(payload, session) {
        const { name, email, password } = payload;
        if (!name || !password) {
            const error = new Error('name and password are required');
            error.statusCode = 400;
            throw error;
        }
        const user = await this.repository.createUser({ name, email, password });
        return user;
    }
    async getUser(payload, session) {
        const users = await this.repository.getUser();
        if (!users) {
            const error = new Error('No user found');
            error.statusCode = 404;
            throw error;
        }
        return users;
    }
    async authUserSignIn(payload) {
        const { email, phone, password } = payload;
        const user = await this.repository.getAuthByEmailOrPhone(email, phone);
        if (!user) {
            const error = new Error('unauthorized access');
            error.statusCode = 401;
            throw error;
        }
        const isPasswordMatch = await bcryptjs_1.default.compare(String(password), user.password);
        if (!isPasswordMatch) {
            const error = new Error('unauthorized access');
            error.statusCode = 401;
            throw error;
        }
        const user_info_encrypted = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
        const accessToken = (0, jwt_1.generateAccessToken)({ userInfo: { user_info_encrypted } });
        const refreshToken = (0, jwt_1.generateRefreshToken)({ userInfo: { user_info_encrypted } });
        return {
            accessToken: `Bearer ${accessToken}`,
            refreshToken: `Bearer ${refreshToken}`,
            user: user_info_encrypted,
        };
    }
    async getUserById(userId, session) {
        const user = await this.repository.getUserById(userId);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        return user;
    }
    async updateUser(userId, payloadFiles, payload, session) {
        // File upload logic can be added here if needed
        // You may want to add a repository method for update
        // For now, call Prisma directly if needed
        // Example: await this.repository.updateUser(userId, payload)
        return null;
    }
    async getAllUser(payload) {
        const users = await this.repository.getUser();
        return users;
    }
    async getSingleUser(id, session) {
        const user = await this.repository.getUserById(id);
        if (!user)
            throw new errors_1.NotFoundError('User not found');
        return user;
    }
    async getDeleteUser(userId) {
        const user = await this.repository.getUserById(userId);
        if (!user)
            throw new errors_1.NotFoundError('User not found');
        // You may want to add a repository method for delete
        // For now, call Prisma directly if needed
        // Example: await this.repository.deleteUser(userId)
        return null;
    }
}
exports.AuthService = AuthService;
