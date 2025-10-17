import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../../utils/errors';
import { verifyAccessToken } from '../../utils/jwt';
// import { RoleSchema } from '../../models/index'; // Uncomment and adjust if using Mongoose

// Type for permission object
interface Permission {
  module: string;
  action: string;
}

// JWT Auth middleware for role and permission-based access
const jwtAuth = (requiredRoles?: string[], permission?: Permission) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bearer = req.headers.authorization || (req.headers as any).Authorization;
      if (!bearer || !bearer.startsWith('Bearer ')) {
        throw new BadRequestError('Token not found');
      }
      const token = bearer.split('Bearer ')[1].trim();
      const payload: any = await verifyAccessToken(token);
      if (!payload) throw new BadRequestError('Unauthorized');

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
      (req as any).user = { ...payload.userInfo };
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default jwtAuth;
