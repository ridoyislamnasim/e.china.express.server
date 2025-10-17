"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeleteUser = exports.getSingleUser = exports.getAllUser = exports.updateUser = exports.getUserById = exports.authForgetPasswordVarification = exports.authForgetPassword = exports.getUser = exports.createUser = exports.authUserSignIn = exports.authUserSignUp = void 0;
const auth_repository_1 = __importDefault(require("./auth.repository"));
const auth_service_1 = require("./auth.service");
const responseHandler_1 = require("../../utils/responseHandler");
const authService = new auth_service_1.AuthService(auth_repository_1.default);
const authUserSignUp = async (req, res, next) => {
    try {
        const { name, email, phone, role, password } = req.body;
        // console.log('Received signup request with data:', { name, email, phone, role, password });
        const payload = { name, email, phone, role, password };
        const user = await authService.authUserSignUp(payload);
        // res.status(201).json({ message: 'User signed up successfully', user });
        const resDoc = (0, responseHandler_1.responseHandler)(201, 'User Created successfully', user);
        res.status(resDoc.statusCode).json(resDoc);
    }
    catch (error) {
        next(error);
    }
};
exports.authUserSignUp = authUserSignUp;
const authUserSignIn = async (req, res, next) => {
    try {
        const { email, phone, password } = req.body;
        const payload = { email, phone, password };
        const user = await authService.authUserSignIn(payload);
        const resDoc = (0, responseHandler_1.responseHandler)(201, 'Login successfully', user);
        res.status(resDoc.statusCode).json(resDoc);
    }
    catch (error) {
        next(error);
    }
};
exports.authUserSignIn = authUserSignIn;
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
    try {
        // TODO: Implement forget password logic in AuthService
        res.status(501).json({ message: 'Forget Password not implemented' });
    }
    catch (error) {
        next(error);
    }
};
exports.authForgetPassword = authForgetPassword;
const authForgetPasswordVarification = async (req, res, next) => {
    try {
        // TODO: Implement forget password verification logic in AuthService
        res.status(501).json({ message: 'Forget Password verification not implemented' });
    }
    catch (error) {
        next(error);
    }
};
exports.authForgetPasswordVarification = authForgetPasswordVarification;
const getUserById = async (req, res, next) => {
    var _a, _b;
    try {
        // @ts-ignore
        const userId = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_info_encrypted) === null || _b === void 0 ? void 0 : _b.id;
        const user = await authService.getUserById(userId);
        res.status(200).json({ message: 'User get successfully', user });
    }
    catch (error) {
        next(error);
    }
};
exports.getUserById = getUserById;
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
            page: req.query.page,
            limit: req.query.limit,
            order: req.query.order,
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
