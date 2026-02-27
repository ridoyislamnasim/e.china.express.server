// AuthService (TypeScript version)
import authRepository, { AuthRepository } from "./auth.repository";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";
import { NotFoundError } from "../../utils/errors";
import path from "path";
// import { RoleRepository } from '../role/';

import { idGenerate } from "../../utils/IdGenerator";

import { AuthUserSignUpPayload } from "../../types/auth";
import { BaseRepository } from "../base/base.repository";
import Email from "../../utils/Email";
import { generateOTP } from "../../utils/OTPGenerate";
import { link } from "fs";
import roleRepository from "../role/role.repository";
import ImgUploader from "../../middleware/upload/ImgUploder";

export class AuthService {
  private repository: AuthRepository;
  // private roleRepository: RoleRepository;

  constructor(repository: AuthRepository = authRepository) {
    this.repository = repository;
  }

  async authUserSignUp(payload: any, tx?: any) {
    const { name, email, phone, password, countryCode } = payload;

    // Validation
    if (!name || !phone || !password) {
      const error = new Error("name, phone and password are required");
      (error as any).statusCode = 400;
      throw error;
    }

    if (password.length < 5) {
      const error = new Error("Password must be at least 5 characters");
      (error as any).statusCode = 400;
      throw error;
    }

    if (email) {
      const auth = await this.repository.getAuthByEmail(email);
      if (auth) {
        const error = new Error("Email already exists");
        (error as any).statusCode = 409;
        throw error;
      }
    }

    const role = await this.repository.createCustomRoleIfNotExists(
      "customer",
      tx,
    );
    const hashedPassword = await bcrypt.hash(String(password), 10);

    const user = await this.repository.createUser(
      {
        name,
        email,
        phone,
        password: hashedPassword,
        roleId: role.id,
        countryCode, // Pass the country code from registration
      },
      tx,
    );

    return user;
  }

  async createUser(payload: any, session?: any) {
    const { name, email, password } = payload;
    if (!name || !password) {
      const error = new Error("name and password are required");
      (error as any).statusCode = 400;
      throw error;
    }
    const user = await this.repository.createUser({ name, email, password });
    return user;
  }

  async getUser(payload: any, session?: any) {
    // const users = await this.repository.getUser();
    // if (!users) {
    //   const error = new Error('No user found');
    //   (error as any).statusCode = 404;
    //   throw error;
    // }
    // return users;
  }

  async authUserSignIn(payload: any) {
    const { email, phone, password } = payload;
    const user = await this.repository.getAuthByEmailOrPhone(email, phone);
    console.log("AuthService - authUserSignIn - retrieved user:", user);
    if (!user) {
      const error = new Error("unauthorized access");
      (error as any).statusCode = 401;
      throw error;
    }
    const isPasswordMatch = await bcrypt.compare(
      String(password),
      user.password,
    );
    if (!isPasswordMatch) {
      const error = new Error("unauthorized access");
      (error as any).statusCode = 401;
      throw error;
    }
    const user_info_encrypted = {
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: user.role?.id || 0,
    };
    const accessToken = generateAccessToken({
      userInfo: { user_info_encrypted },
    });
    const refreshToken = generateRefreshToken({
      userInfo: { user_info_encrypted },
    });
    return {
      accessToken: `Bearer ${accessToken}`,
      refreshToken: `Bearer ${refreshToken}`,
      user: user_info_encrypted,
    };
  }

  async getUserBy(userId: number, session?: any) {
    const user = await this.repository.getUserBy(userId);
    if (!user) {
      const error = new Error("User not found");
      (error as any).statusCode = 404;
      throw error;
    }
    return user;
  }

  async authForgetPassword(payload: any) {
    // check if user exists
    const { email, phone, ip, browser, os, date, time, geoLocation } = payload;
    const user = await this.repository.getAuthByEmailOrPhone(email, phone);
    if (!user) {
      const error = new Error("User not found");
      (error as any).statusCode = 404;
      throw error;
    }
    const lockStatus: any = await this.repository.isOTPLocked(user.id);
    if (lockStatus && lockStatus.locked) {
      const unlockTime = new Date(lockStatus.unlockTime).toLocaleString();
      const error = new Error(
        `Too many failed OTP attempts. Try again after ${unlockTime}`,
      );
      (error as any).statusCode = 429;
      throw error;
    }

    const OTP = await generateOTP();

    // if email than send otp to email
    // if phone than send otp to phone
    if (email) {
      // Send OTP to email
      const emailObj = { email: user.email, name: user.name || "" };
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
        geoLocation,
      };
      const imgArray = {
        forgetpassword:
          "https://e-china-express-server-k3vi.onrender.com/public/social/forget-password.png",
        facebook:
          "https://e-china-express-server-k3vi.onrender.com/public/social/facebook.png",
        youtube:
          "https://e-china-express-server-k3vi.onrender.com/public/social/youtube.png",
        instagram:
          "https://e-china-express-server-k3vi.onrender.com/public/social/instagram.png",
        linkedin:
          "https://e-china-express-server-k3vi.onrender.com/public/social/linkedin.png",
        telegram:
          "https://e-china-express-server-k3vi.onrender.com/public/social/telegram.png",
        whatsapp:
          "https://e-china-express-server-k3vi.onrender.com/public/social/whatsapp.png",

        locationIcon:
          "https://e-china-express-server-k3vi.onrender.com/public/social/destination.png",
        deviceIcon:
          "https://e-china-express-server-k3vi.onrender.com/public/social/video-lesson.png",
        dateIcon:
          "https://e-china-express-server-k3vi.onrender.com/public/social/time-management.png",
      };

      await new Email(emailObj, OTP).sendSignInAlert(
        dynamicTemplateData,
        imgArray,
      );
    } else if (phone) {
      // await this.sendOtpToPhone(phone);
    }

    // otp save to db with user id and expiry time
    await this.repository.saveOTP(user.id, OTP);

    return user;
  }

  async authForgetPasswordVarification(payload: any) {
    const { email, phone, otp, newPassword } = payload;

    // Basic validation
    if (!otp || !newPassword) {
      const error = new Error("otp and newPassword are required");
      (error as any).statusCode = 400;
      throw error;
    }

    const user = await this.repository.getAuthByEmailOrPhone(email, phone);
    if (!user) {
      const error = new Error("User not found");
      (error as any).statusCode = 404;
      throw error;
    }

    // Verify OTP via repository helper
    const verifyResult: any = await this.repository.verifyOTP(user.id, otp);
    if (!verifyResult || !verifyResult.success) {
      const reason = verifyResult?.reason || "OTP verification failed";
      const error = new Error(
        reason === "expired"
          ? "OTP expired"
          : reason === "invalid"
            ? "Invalid OTP"
            : reason,
      );
      (error as any).statusCode = 400;
      throw error;
    }

    // OTP verified — hash and update the password
    const hashed = await bcrypt.hash(String(newPassword), 10);
    const newUser = await this.repository.updateUserPassword(user.id, hashed);
    return newUser;
  }

 async updateUser(userId: number, payloadFiles: any, payload: any, tx: any) {
  const { name, phone, bio, language, languageName, currencyCode, currencyName, currencySymbol } = payload;
    const user = await this.repository.getUserById(userId);
    if (!user) {
      const error = new Error("User not found");
      (error as any).statusCode = 404;
      throw error;
    }

     const { files } = payloadFiles;
        if (files) {
        const images = await ImgUploader(files);
        for (const key in images) {
          payload[key] = images[key];
        }
        }

      const updatePayload: any = {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(bio && { bio }),
        ...(language && { language }),
        ...(languageName && { languageName }),
        ...(currencyCode && { currencyCode }),
        ...(currencyName && { currencyName }),
        ...(currencySymbol && { currencySymbol }),
      };

    const updatedUser = await this.repository.updateUserById(userId, updatePayload, tx);
    return updatedUser;
  }
       
    // Handle file upload if files are provided
    

  async getAllUser(payload: any) {
    const users = await this.repository.getUser(payload);
    return users;
  }

  async getSingleUser(id: number, session?: any) {
    const user = await this.repository.getUserById(id);
    if (!user) throw new NotFoundError("User not found");
    return user;
  }

  async getDeleteUser(userId: number) {
    const user = await this.repository.getUserById(userId);
    if (!user) throw new NotFoundError("User not found");
    // You may want to add a repository method for delete
    // For now, call Prisma directly if needed
    // Example: await this.repository.deleteUser(userId)
    return null;
  }

  async createSuperAdminRole(session?: any) {
    // crarte super admin role
    const superAdminRole = await roleRepository.createSuperAdminRole();
    const password = "SuperAdmin@123";
    const hashedPassword = await bcrypt.hash(String(password), 10);
    const superAdminUserPayload = {
      name: "Super Admin",
      password: hashedPassword,
      email: "superadmin@example.com",
      roleId: superAdminRole.id,
      phone: "0000000000",
    };
    const role = await this.repository.createUser(
      superAdminUserPayload,
      session,
    );
    return role;
  }

  // ====================================================
  // user services
  // ====================================================

   async getUserWithPagination(payload: any, session?: any) {
      const users = await this.repository.getUserWithPagination(payload);
      return users;
    }

  updateUserRole = async (payload: any) => {
    const { userId, roleId } = payload;
    // superAdmin role cannot be updated and assigned to any user
    if (!userId || !roleId) {
      const error = new Error("userId and roleId are required");
      (error as any).statusCode = 400;
      throw error;
    }
    // superAdmin role cannot be updated and assigned to any user
    // get superAdmin role id
    const superAdminRole = await roleRepository.getRoleByName("superAdmin");
    if (roleId === superAdminRole?.id) {
      const error = new Error("Cannot assign superAdmin role to any user");
      (error as any).statusCode = 400;
      throw error;
    }
    const user = await this.repository.updateUserRole(userId, roleId);
    return user;
  };

  async getAllUsersWithWallets() {
    const users = await this.repository.getAllUsersWithWallets();
    return users;
  }
}
