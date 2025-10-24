// AuthService (TypeScript version)
import authRepository, { AuthRepository } from './auth.repository';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';
import { NotFoundError } from '../../utils/errors';
// import { RoleRepository } from '../role/';

import { idGenerate } from '../../utils/IdGenerator';

import { AuthUserSignUpPayload } from '../../types/auth.types';
import { BaseRepository } from '../base/base.repository';


export class AuthService {
  private repository: AuthRepository;
  // private roleRepository: RoleRepository;

  constructor(repository: AuthRepository = authRepository) {
    this.repository = repository;
  }

  async authUserSignUp(payload: AuthUserSignUpPayload, tx?: any) {
    const { name, email, phone, password } = payload;
    if (!name || !phone || !password) {
      const error = new Error('name, phone and password are required');
      (error as any).statusCode = 400;
      throw error;
    }
    if (password.length < 5) {
      const error = new Error('Password must be at least 5 characters');
      (error as any).statusCode = 400;
      throw error;
    }
    if (email) {
      const auth = await this.repository.getAuthByEmail(email);
      if (auth) {
        const error = new Error('Email already exists');
        (error as any).statusCode = 409;
        throw error;
      }
    }
    // create Role 
    const role = await this.repository.createCustomRoleIfNotExists('customer', tx);
    payload.roleId = role.id;
    
    // Add phone unique check if phone is in schema
    const hashedPassword = await bcrypt.hash(String(password), 10);
    const user = await this.repository.createUser({ ...payload, password: hashedPassword }, tx);
    return user;
  }

  async createUser(payload: any, session?: any) {
    const { name, email, password } = payload;
    if (!name || !password) {
      const error = new Error('name and password are required');
      (error as any).statusCode = 400;
      throw error;
    }
    const user = await this.repository.createUser({ name, email, password });
    return user;
  }

  async getUser(payload: any, session?: any) {
    const users = await this.repository.getUser();
    if (!users) {
      const error = new Error('No user found');
      (error as any).statusCode = 404;
      throw error;
    }
    return users;
  }

  async authUserSignIn(payload: any) {
    const { email, phone, password } = payload;
    const user = await this.repository.getAuthByEmailOrPhone(email, phone);
    if (!user) {
      const error = new Error('unauthorized access');
      (error as any).statusCode = 401;
      throw error;
    }
    const isPasswordMatch = await bcrypt.compare(String(password), user.password);
    if (!isPasswordMatch) {
      const error = new Error('unauthorized access');
      (error as any).statusCode = 401;
      throw error;
    }
    const user_info_encrypted = {
      id: user.id,
      name: user.name,
      email: user.email,
      // role: user.role,
    };
    const accessToken = generateAccessToken({ userInfo: { user_info_encrypted } });
    const refreshToken = generateRefreshToken({ userInfo: { user_info_encrypted } });
    return {
      accessToken: `Bearer ${accessToken}`,
      refreshToken: `Bearer ${refreshToken}`,
      user: user_info_encrypted,
    };
  }

  async getUserById(userId: number, session?: any) {
    const user = await this.repository.getUserById(userId);
    if (!user) {
      const error = new Error('User not found');
      (error as any).statusCode = 404;
      throw error;
    }
    return user;
  }

  async updateUser(userId: number, payloadFiles: any, payload: any, session?: any) {
    // File upload logic can be added here if needed
    // You may want to add a repository method for update
    // For now, call Prisma directly if needed
    // Example: await this.repository.updateUser(userId, payload)
    return null;
  }

  async getAllUser(payload: any) {
    const users = await this.repository.getUser();
    return users;
  }

  async getSingleUser(id: number, session?: any) {
    const user = await this.repository.getUserById(id);
    if (!user) throw new NotFoundError('User not found');
    return user;
  }

  async getDeleteUser(userId: number) {
    const user = await this.repository.getUserById(userId);
    if (!user) throw new NotFoundError('User not found');
    // You may want to add a repository method for delete
    // For now, call Prisma directly if needed
    // Example: await this.repository.deleteUser(userId)
    return null;
  }
}

