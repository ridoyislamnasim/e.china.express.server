"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../utils/errors");
const jwt_1 = require("../../utils/jwt");
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
            // Role/permission logic (pseudo, adjust for your ORM)
            // const userRoleRef = payload.userInfo.user_info_encrypted.roleRef;
            // if (!requiredRoles) {
            //   const rolePermissions = await RoleSchema.findOne({ _id: userRoleRef }).lean();
            //   if (!rolePermissions || !rolePermissions.permissions[permission.module]?.[permission.action]) {
            //     throw new BadRequestError('Permission denied');
            //   }
            // } else if (!requiredRoles.includes(userRole)) {
            //   throw new BadRequestError('Role unauthorized');
            // }
            // Attach user info to request
            req.user = { ...payload.userInfo };
            next();
        }
        catch (err) {
            next(err);
        }
    };
};
exports.default = jwtAuth;
