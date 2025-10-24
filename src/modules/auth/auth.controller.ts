// AuthController (TypeScript version)
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

import authRepository from './auth.repository';
import { AuthService as AuthServiceClass } from './auth.service';
import { responseHandler } from '../../utils/responseHandler';
import config from '../../config/config';
import withTransaction from '../../middleware/transactions/withTransaction';
const authService = new AuthServiceClass(authRepository);

export const authUserSignUp = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
  try {
    const { name, email, phone, password } = req.body;
    // console.log('Received signup request with data:', { name, email, phone, role, password });
    const payload = { name, email, phone, password };
    const user = await authService.authUserSignUp(payload, tx);
    const resDoc = responseHandler(201, 'User Created successfully', user);
    res.status(resDoc.statusCode).json(resDoc);
  } catch (error) {
    next(error);
  }
});

export const authUserSignIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, phone, password } = req.body;
    const payload = { email, phone, password };
    // authService returns { accessToken, refreshToken, user }
    const authResult = await authService.authUserSignIn(payload);

    // Set secure, HttpOnly cookies. Adjust maxAge as needed.
    try {
      const accessToken = authResult.accessToken;
      const refreshToken = authResult.refreshToken;

      // access token: short lived (e.g., 15 minutes)
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: config.isProduction, // send only over HTTPS in production
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000, // 15 minutes
        path: '/',
      });

      // refresh token: longer lived (e.g., 7 days)
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: config.isProduction,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/',
      });

      // Also set a non-httpOnly user cookie so frontend can read basic user info
      // NOTE: this cookie should NOT contain sensitive data (passwords, tokens)
      try {
        const userCookieValue = encodeURIComponent(JSON.stringify(authResult.user || {}));
        res.cookie('user', userCookieValue, {
          httpOnly: false, // allow frontend JS to read
          secure: config.isProduction,
          sameSite: 'lax',
          maxAge: 15 * 60 * 1000, // match access token life
          path: '/',
        });
      } catch (e) {
        console.warn('Failed to set user cookie:', e);
      }
    } catch (cookieErr) {
      // If cookie set fails for any reason, continue and return token in body as fallback
      console.warn('Failed to set auth cookies:', cookieErr);
    }

    // Return user info (omit tokens in body for extra safety)
    const resDoc = responseHandler(200, 'Login successfully', { user: authResult.user });
    res.status(resDoc.statusCode).json(resDoc);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, phone, password } = req.body;
    const payload = { name, email, phone, password };
    const user = await authService.createUser(payload);
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, phone } = req.query;
    const payload = { email, phone };
    const user = await authService.getUser(payload);
    res.status(200).json({ message: 'User found successfully', user });
  } catch (error) {
    next(error);
  }
};



export const authForgetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Implement forget password logic in AuthService
    res.status(501).json({ message: 'Forget Password not implemented' });
  } catch (error) {
    next(error);
  }
};

export const authForgetPasswordVarification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Implement forget password verification logic in AuthService
    res.status(501).json({ message: 'Forget Password verification not implemented' });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const userId = req.user?.user_info_encrypted?.id;
    const user = await authService.getUserById(userId);
    res.status(200).json({ message: 'User get successfully', user });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const userId = req.user?.user_info_encrypted?.id;
    // TODO: Add file upload support if needed
    const payload = {
      phone: req.body?.phone,
      name: req.body?.name,
      address: req.body?.address,
    };
    const user = await authService.updateUser(userId, undefined, payload);
    res.status(201).json({ message: 'User updated successfully', user });
  } catch (error) {
    next(error);
  }
};

export const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = {
      page: req.query.page,
      limit: req.query.limit,
      order: req.query.order,
    };
    const users = await authService.getAllUser(payload);
    res.status(200).json({ message: 'Users get successfully', users });
  } catch (error) {
    next(error);
  }
};

export const getSingleUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.params.id);
    const user = await authService.getSingleUser(userId);
    res.status(200).json({ message: 'User get successfully', user });
  } catch (error) {
    next(error);
  }
};

export const getDeleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.params.id);
    const user = await authService.getDeleteUser(userId);
    res.status(200).json({ message: 'User deleted successfully', user });
  } catch (error) {
    next(error);
  }
};
