import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../../utils/errors';
import { verifyAccessToken } from '../../utils/jwt';
import { PrismaClient } from '@prisma/client';
import prisma from '../../config/prismadatabase';
import { tr } from 'zod/v4/locales';
// import { RoleSchema } from '../../models/index'; // Uncomment and adjust if using Mongoose

// Extend Express Request to include `user`
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Type for permission object
interface Permission {
  module: string;
  action: string;
}

// JWT Auth middleware for role and permission-based access
const jwtAuth = (requiredRoles?: string[], permission?: Permission) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // console cookies for debugging
    console.log("Request Cookies:", req.cookies);
    try {
      const bearer = req.cookies.accessToken || (req.cookies as any).AccessToken;
      if (!bearer || !bearer.startsWith('Bearer ')) {
        throw new BadRequestError('Token not found');
      }
      const token = bearer.split('Bearer ')[1].trim();
      const payload: any = await verifyAccessToken(token);
      if (!payload) throw new BadRequestError('Unauthorized');
      console.log('JWT Payload:', payload);

      // Role/permission logic (pseudo, adjust for your ORM)
      const userId = payload.userInfo.user_info_encrypted.id;
      console.log('User Role Ref:', userId);

      if (requiredRoles) {
        const userWithRole = await prisma.user.findUnique({
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
          throw new BadRequestError('User not found');
        }
        console.log('User with Role and Permissions:', userWithRole);
        // Check required roles if provided
        if (requiredRoles && requiredRoles.length > 0) {
          if (!userWithRole.role || !requiredRoles.includes(userWithRole.role.role)) {
            throw new BadRequestError('Role unauthorized');
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
    } catch (err) {
      next(err);
    }
  };
};

export default jwtAuth;