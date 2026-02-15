"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRole = exports.createSuperAdminRole = exports.getDeleteUser = exports.getSingleUser = exports.getAllUser = exports.updateUser = exports.getUserBy = exports.authForgetPasswordVarification = exports.authForgetPassword = exports.getUser = exports.createUser = exports.authUserSignOut = exports.authUserSignIn = exports.authUserSignUp = void 0;
const auth_repository_1 = __importDefault(require("./auth.repository"));
const auth_service_1 = require("./auth.service");
const responseHandler_1 = require("../../utils/responseHandler");
const config_1 = __importDefault(require("../../config/config"));
const withTransaction_1 = __importDefault(require("../../middleware/transactions/withTransaction"));
const requestInfo_1 = require("../../utils/requestInfo");
const authService = new auth_service_1.AuthService(auth_repository_1.default);
exports.authUserSignUp = (0, withTransaction_1.default)(async (req, res, next, tx) => {
    try {
        const { name, email, phone, password } = req.body;
        // console.log('Received signup request with data:', { name, email, phone, role, password });
        const payload = { name, email, phone, password };
        console.log('SignUp request payload:', payload);
        const user = await authService.authUserSignUp(payload, tx);
        const resDoc = (0, responseHandler_1.responseHandler)(201, 'User Created successfully', user);
        res.status(resDoc.statusCode).json(resDoc);
    }
    catch (error) {
        next(error);
    }
});
const authUserSignIn = async (req, res, next) => {
    console.log('SignIn request body:', req.body);
    try {
        const { email, phone, password } = req.body;
        const payload = { email, phone, password };
        // authService returns { accessToken, refreshToken, user }
        const authResult = await authService.authUserSignIn(payload);
        const accessToken = authResult.accessToken;
        const refreshToken = authResult.refreshToken;
        const isProduction = config_1.default.isProduction || false; // fallback to false in local
        console.log('Setting auth cookies for user:', isProduction);
        // Access Token Cookie
        // Make cookies usable for local development by setting a local domain and disabling secure when not in production.
        const cookieDomain = !isProduction ? 'localhost' : undefined;
        console.log('Cookie Domain:', cookieDomain);
        const accessCookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
            path: '/',
        };
        if (cookieDomain)
            accessCookieOptions.domain = cookieDomain;
        console.log('Setting access token cookie with options access:', accessCookieOptions);
        res.cookie('accessToken', accessToken, accessCookieOptions);
        // Refresh Token Cookie
        const refreshCookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/',
        };
        if (cookieDomain)
            refreshCookieOptions.domain = cookieDomain;
        console.log('Setting refresh token cookie with options refresh:', refreshCookieOptions);
        res.cookie('refreshToken', refreshToken, refreshCookieOptions);
        // User Cookie (readable by frontend)
        const userCookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
            path: '/',
        };
        authResult.user = { ...authResult.user, ...userCookieOptions }; // Remove password from user object
        const resDoc = (0, responseHandler_1.responseHandler)(200, 'Login successfully', { user: authResult.user });
        return res.status(resDoc.statusCode).json(resDoc);
    }
    catch (error) {
        next(error);
    }
};
exports.authUserSignIn = authUserSignIn;
const authUserSignOut = async (req, res, next) => {
    try {
        // Clear the authentication cookies
        res.clearCookie('accessToken', {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
        });
        res.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
        });
        res.clearCookie('user', {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
        });
        res.status(200).json({ message: 'Logged out successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.authUserSignOut = authUserSignOut;
const createUser = async (req, res, next) => {
    try {
        const { name, email, phone, password } = req.body;
        const payload = { name, email, phone, password };
        const user = await authService.createUser(payload);
        res.status(201).json({ message: 'User created successfully', user });
    }
    catch (error) {
        next(error);
    }
};
exports.createUser = createUser;
const getUser = async (req, res, next) => {
    try {
        const { email, phone } = req.query;
        const payload = { email, phone };
        const user = await authService.getUser(payload);
        res.status(200).json({ message: 'User found successfully', user });
    }
    catch (error) {
        next(error);
    }
};
exports.getUser = getUser;
const authForgetPassword = async (req, res, next) => {
    console.log("AuthController - authForgetPassword - request body:", req.body);
    try {
        // body theke data distrcaret
        const { email, phone } = req.body;
        // console.log("AuthController - authForgetPassword - request payload:", req);
        // Get request information including device details
        const requestInfo = (0, requestInfo_1.getRequestInfo)(req);
        const { ip, browser, os, date, time, location: geoLocation } = requestInfo;
        const payload = {
            email, phone,
            ip,
            browser,
            os,
            date,
            time,
            geoLocation
        };
        console.log("========= Request Info =========");
        console.log("IP Address:", ip);
        console.log("Browser:", browser); // Will show like "Chrome 111.0.0"
        console.log("Operating System:", os); // Will show like "Windows 10"
        console.log("Date:", date); // Will show like "Monday, 20 March 2023"
        console.log("Time:", time); // Will show like "11:31:10 pm"
        console.log("Location:", geoLocation);
        console.log("================================");
        const user = await authService.authForgetPassword(payload);
        res.status(200).json({ message: 'Forget Password OTP sent email successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.authForgetPassword = authForgetPassword;
const authForgetPasswordVarification = async (req, res, next) => {
    try {
        // TODO: Implement forget password verification logic in AuthService
        const { email, phone, otp, newPassword } = req.body;
        const payload = { email, phone, otp, newPassword };
        const user = await authService.authForgetPasswordVarification(payload);
        res.status(200).json({ message: 'Forget Password verification successful', user });
    }
    catch (error) {
        next(error);
    }
};
exports.authForgetPasswordVarification = authForgetPasswordVarification;
exports.getUserBy = (0, withTransaction_1.default)(async (req, res, next, tx) => {
    var _a, _b;
    console.log('AuthController - getUserBy - called');
    try {
        // @ts-ignore user_info_encrypted.id
        const userId = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_info_encrypted) === null || _b === void 0 ? void 0 : _b.id;
        console.log('Getting user by ID from JWT:', userId);
        const user = await authService.getUserBy(userId, tx);
        res.status(200).json({ message: 'User get successfully', user });
    }
    catch (error) {
        next(error);
    }
});
const updateUser = async (req, res, next) => {
    var _a, _b, _c, _d, _e;
    try {
        // @ts-ignore
        const userId = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_info_encrypted) === null || _b === void 0 ? void 0 : _b.id;
        // TODO: Add file upload support if needed
        const payload = {
            phone: (_c = req.body) === null || _c === void 0 ? void 0 : _c.phone,
            name: (_d = req.body) === null || _d === void 0 ? void 0 : _d.name,
            address: (_e = req.body) === null || _e === void 0 ? void 0 : _e.address,
        };
        const user = await authService.updateUser(userId, undefined, payload);
        res.status(201).json({ message: 'User updated successfully', user });
    }
    catch (error) {
        next(error);
    }
};
exports.updateUser = updateUser;
const getAllUser = async (req, res, next) => {
    try {
        const payload = {
            role: req.query.role,
        };
        const users = await authService.getAllUser(payload);
        res.status(200).json({ message: 'Users get successfully', users });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllUser = getAllUser;
const getSingleUser = async (req, res, next) => {
    try {
        const userId = Number(req.params.id);
        const user = await authService.getSingleUser(userId);
        res.status(200).json({ message: 'User get successfully', user });
    }
    catch (error) {
        next(error);
    }
};
exports.getSingleUser = getSingleUser;
const getDeleteUser = async (req, res, next) => {
    try {
        const userId = Number(req.params.id);
        const user = await authService.getDeleteUser(userId);
        res.status(200).json({ message: 'User deleted successfully', user });
    }
    catch (error) {
        next(error);
    }
};
exports.getDeleteUser = getDeleteUser;
exports.createSuperAdminRole = (0, withTransaction_1.default)(async (req, res, next, tx) => {
    try {
        const role = await authService.createSuperAdminRole(tx);
        res.status(201).json({ message: 'Super Admin Role created successfully', role });
    }
    catch (error) {
        next(error);
    }
});
// ====================================================
// user Controller 
// ====================================================
// export const getUserWithPagination = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const page = req.query.page ? Number(req.query.page) : 1;
//     const limit = req.query.limit ? Number(req.query.limit) : 10;
//     const order = req.query.order ? String(req.query.order) : 'desc';
//     const payload = { page, limit, order };
//     const users = await authService.getUserWithPagination(payload);
//     res.status(200).json({ message: 'Users retrieved successfully', users });
//   } catch (error) {
//     next(error);
//   }
// };
const updateUserRole = async (req, res, next) => {
    try {
        const { userId, roleId } = req.body;
        const payload = { userId, roleId };
        const user = await authService.updateUserRole(payload);
        res.status(200).json({ message: 'User role updated successfully', user });
    }
    catch (error) {
        next(error);
    }
};
exports.updateUserRole = updateUserRole;
