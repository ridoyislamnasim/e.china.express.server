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
const Email_1 = __importDefault(require("../../utils/Email"));
const OTPGenerate_1 = require("../../utils/OTPGenerate");
const role_repository_1 = __importDefault(require("../role/role.repository"));
class AuthService {
    // private roleRepository: RoleRepository;
    constructor(repository = auth_repository_1.default) {
        this.updateUserRole = async (payload) => {
            const { userId, roleId } = payload;
            // superAdmin role cannot be updated and assigned to any user
            if (!userId || !roleId) {
                const error = new Error('userId and roleId are required');
                error.statusCode = 400;
                throw error;
            }
            // superAdmin role cannot be updated and assigned to any user
            // get superAdmin role id
            const superAdminRole = await role_repository_1.default.getRoleByName('superAdmin');
            if (roleId === (superAdminRole === null || superAdminRole === void 0 ? void 0 : superAdminRole.id)) {
                const error = new Error('Cannot assign superAdmin role to any user');
                error.statusCode = 400;
                throw error;
            }
            const user = await this.repository.updateUserRole(userId, roleId);
            return user;
        };
        this.repository = repository;
    }
    async authUserSignUp(payload, tx) {
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
        // create Role 
        const role = await this.repository.createCustomRoleIfNotExists('customer', tx);
        payload.roleId = role.id;
        // Add phone unique check if phone is in schema
        const hashedPassword = await bcryptjs_1.default.hash(String(password), 10);
        const user = await this.repository.createUser({ ...payload, password: hashedPassword }, tx);
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
        var _a;
        const { email, phone, password } = payload;
        const user = await this.repository.getAuthByEmailOrPhone(email, phone);
        console.log('AuthService - authUserSignIn - retrieved user:', user);
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
            roleId: ((_a = user.role) === null || _a === void 0 ? void 0 : _a.id) || 0,
        };
        const accessToken = (0, jwt_1.generateAccessToken)({ userInfo: { user_info_encrypted } });
        const refreshToken = (0, jwt_1.generateRefreshToken)({ userInfo: { user_info_encrypted } });
        return {
            accessToken: `Bearer ${accessToken}`,
            refreshToken: `Bearer ${refreshToken}`,
            user: user_info_encrypted,
        };
    }
    async getUserBy(userId, session) {
        const user = await this.repository.getUserBy(userId);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        return user;
    }
    async authForgetPassword(payload) {
        // check if user exists
        const { email, phone, ip, browser, os, date, time, geoLocation } = payload;
        const user = await this.repository.getAuthByEmailOrPhone(email, phone);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        const lockStatus = await this.repository.isOTPLocked(user.id);
        if (lockStatus && lockStatus.locked) {
            const unlockTime = new Date(lockStatus.unlockTime).toLocaleString();
            const error = new Error(`Too many failed OTP attempts. Try again after ${unlockTime}`);
            error.statusCode = 429;
            throw error;
        }
        const OTP = await (0, OTPGenerate_1.generateOTP)();
        // if email than send otp to email
        // if phone than send otp to phone
        if (email) {
            // Send OTP to email
            const emailObj = { email: user.email, name: user.name || '' };
            // ip,
            // browser,
            // os,
            // date,
            // time,
            // geoLocation  make email template dynamic data
            const dynamicTemplateData = {
                ip,
                browser,
                os,
                date,
                time,
                geoLocation
            };
            const imgArray = {
                forgetpassword: "https://e-china-express-server-k3vi.onrender.com/public/social/forget-password.png",
                facebook: "https://e-china-express-server-k3vi.onrender.com/public/social/facebook.png",
                youtube: "https://e-china-express-server-k3vi.onrender.com/public/social/youtube.png",
                instagram: "https://e-china-express-server-k3vi.onrender.com/public/social/instagram.png",
                linkedin: "https://e-china-express-server-k3vi.onrender.com/public/social/linkedin.png",
                telegram: "https://e-china-express-server-k3vi.onrender.com/public/social/telegram.png",
                whatsapp: "https://e-china-express-server-k3vi.onrender.com/public/social/whatsapp.png",
                locationIcon: "https://e-china-express-server-k3vi.onrender.com/public/social/destination.png",
                deviceIcon: "https://e-china-express-server-k3vi.onrender.com/public/social/video-lesson.png",
                dateIcon: "https://e-china-express-server-k3vi.onrender.com/public/social/time-management.png",
            };
            await new Email_1.default(emailObj, OTP).sendSignInAlert(dynamicTemplateData, imgArray);
        }
        else if (phone) {
            // await this.sendOtpToPhone(phone);
        }
        // otp save to db with user id and expiry time
        await this.repository.saveOTP(user.id, OTP);
        return user;
    }
    async authForgetPasswordVarification(payload) {
        const { email, phone, otp, newPassword } = payload;
        // Basic validation
        if (!otp || !newPassword) {
            const error = new Error('otp and newPassword are required');
            error.statusCode = 400;
            throw error;
        }
        const user = await this.repository.getAuthByEmailOrPhone(email, phone);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        // Verify OTP via repository helper
        const verifyResult = await this.repository.verifyOTP(user.id, otp);
        if (!verifyResult || !verifyResult.success) {
            const reason = (verifyResult === null || verifyResult === void 0 ? void 0 : verifyResult.reason) || 'OTP verification failed';
            const error = new Error(reason === 'expired' ? 'OTP expired' : reason === 'invalid' ? 'Invalid OTP' : reason);
            error.statusCode = 400;
            throw error;
        }
        // OTP verified — hash and update the password
        const hashed = await bcryptjs_1.default.hash(String(newPassword), 10);
        const newUser = await this.repository.updateUserPassword(user.id, hashed);
        return newUser;
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
    async createSuperAdminRole(session) {
        // crarte super admin role
        const superAdminRole = await role_repository_1.default.createSuperAdminRole();
        const password = 'SuperAdmin@123';
        const hashedPassword = await bcryptjs_1.default.hash(String(password), 10);
        const superAdminUserPayload = {
            name: 'Super Admin',
            password: hashedPassword,
            email: 'superadmin@example.com',
            roleId: superAdminRole.id,
            phone: '0000000000',
        };
        const role = await this.repository.createUser(superAdminUserPayload, session);
        return role;
    }
    // ====================================================
    // user services 
    // ====================================================
    async getUserWithPagination(payload, session) {
        const users = await this.repository.getUserWithPagination(payload);
        return users;
    }
}
exports.AuthService = AuthService;
