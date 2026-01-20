"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../utils/errors");
const jwt_1 = require("../../utils/jwt");
const prismadatabase_1 = __importDefault(require("../../config/prismadatabase"));
// JWT Auth middleware for role and permission-based access
const jwtAuth = (requiredRoles, permission) => {
    return async (req, res, next) => {
        // console cookies for debugging
        console.log("Request Cookies:", req.cookies);
        try {
            const bearer = req.cookies.accessToken || req.cookies.AccessToken;
            if (!bearer || !bearer.startsWith('Bearer ')) {
                throw new errors_1.BadRequestError('Token not found');
            }
            const token = bearer.split('Bearer ')[1].trim();
            const payload = await (0, jwt_1.verifyAccessToken)(token);
            if (!payload)
                throw new errors_1.BadRequestError('Unauthorized');
            console.log('JWT Payload:', payload);
            // Role/permission logic (pseudo, adjust for your ORM)
            const userId = payload.userInfo.user_info_encrypted.id;
            console.log('User Role Ref:', userId);
            if (requiredRoles) {
                const userWithRole = await prismadatabase_1.default.user.findUnique({
                    where: { id: userId },
                    include: {
                        role: {
                            include: {
                                permission: true,
                            },
                        },
                    },
                });
                // Fetch user with role and permissions
                if (!userWithRole) {
                    throw new errors_1.BadRequestError('User not found');
                }
                console.log('User with Role and Permissions:', userWithRole);
                // Check required roles if provided
                if (requiredRoles && requiredRoles.length > 0) {
                    if (!userWithRole.role || !requiredRoles.includes(userWithRole.role.role)) {
                        throw new errors_1.BadRequestError('Role unauthorized');
                    }
                }
                // Check permission if provided
                // if (permission) {
                //   // Assuming permissions is a flat object like { blogAccess: boolean, blogCreate: boolean, ... }
                //   const permissionKey = `${permission.module}${permission.action.charAt(0).toUpperCase() + permission.action.slice(1)}`;
                //   if (!userWithRole.role || !userWithRole.role.permission[permissionKey]) {
                //     throw new BadRequestError('Permission denied');
                //   }
                // }
            }
            //  else if (requiredRoles.includes(userId)) {
            //   throw new BadRequestError('Role unauthorized');
            // }
            // Attach user info to request
            console.log('Attaching user to request:', payload.userInfo);
            req.user = { ...payload.userInfo };
            next();
        }
        catch (err) {
            next(err);
        }
    };
};
exports.default = jwtAuth;
