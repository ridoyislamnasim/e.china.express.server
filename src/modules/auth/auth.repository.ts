import { pagination } from "../../utils/pagination";
import prisma from "../../config/prismadatabase";
import { PrismaClient } from "@prisma/client";
import { AuthUserSignUpPayload } from "../../types/auth";
import { hashOTP } from "../../utils/OTPGenerate";
import { copyFile } from "fs";
import { getLocationFromIP } from "../../utils/location.helper";

export class AuthRepository {
  private prisma = prisma;

  createCustomRoleIfNotExists = async (roleName: string, tx?: any) => {
    const prismaClient: PrismaClient = tx || this.prisma;

    // Try to find existing role first
    let role = await prismaClient.role.findUnique({
      where: { role: roleName },
    });
    if (role) return role;

    const permission = await prismaClient.permission.create({});
    role = await prismaClient.role.create({
      data: { role: roleName, permissionId: permission.id },
    });
    return role;
  };

  async createUser(payload: any, tx?: any) {
    const { name, email, password, roleId, phone, countryCode } = payload;
    const prismaClient = tx || this.prisma;

    let currency = "RMB";
    let category = "personal";

    if (countryCode === "BD") {
      currency = "BDT";
      category = "local";
    } else if (countryCode === "IN") {
      currency = "INA";
      category = "local";
    } else if (countryCode === "PK") {
      currency = "PAK";
      category = "local";
    } else if (countryCode === "SA") {
      currency = "SUA";
      category = "local";
    }

    const userData = {
      name,
      email: email || "",
      password,
      phone,
      countryCode: countryCode,
      wallets: {
        create: {
          name: `Default ${currency} Wallet`,
          currency: currency,
          balance: 0,
          status: "active",
          monthlyLimit: 50000,
          category: category,
          cardNumber: `62${Math.floor(Math.random() * 10000000000000)}`.slice(
            0,
            16,
          ),
          expiryDate: "12/29",
          cvv: "123",
        },
      },
    };

    return await prismaClient.user.create({
      data: userData,
      include: { wallets: true },
    });
  }
  async getUser() {
    return await this.prisma.user.findMany();
  }

  async getUserById(id: number) {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async getUserBy(id: number) {
    console.log("Fetching user by ID:", id);
    return await this.prisma.user.findUnique({
      where: { id },
      include: {
        role: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  async saveOTP(userId: number, otp: string, expiresInMinutes = 5) {
    const otpHash = await hashOTP(otp);
    console.log("Saving OTP hash:", otpHash, "for otp:", otp);
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);
    return await this.prisma.oTP.create({
      data: {
        userRefId: userId,
        otpHash,
        expiresAt,
        attempts: 0,
        verified: false,
      },
    });
  }

  async updateUserPassword(userId: number, password: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { password },
    });
  }

  async verifyOTP(userId: number, otp: string) {
    const otpRecord = await this.prisma.oTP.findFirst({
      where: { userRefId: userId },
      orderBy: { createdAt: "desc" },
    });
    if (!otpRecord) return { success: false, reason: "no_otp" };
    const now = new Date();
    if (otpRecord.expiresAt && new Date(otpRecord.expiresAt) < now) {
      return { success: false, reason: "expired" };
    }
    // The OTP was stored using hashOTP (HMAC SHA256). Recompute and compare.
    const providedHash = hashOTP(String(otp));
    const isMatch = providedHash === otpRecord.otpHash;
    console.log("OTP match result:", isMatch, { otpRecord }, otp);
    if (isMatch) {
      await this.prisma.oTP.update({
        where: { id: otpRecord.id },
        data: { verified: true },
      });
      return { success: true };
    }
    // increment attempts and apply lockout if threshold reached
    const prevAttempts = otpRecord.attempts || 0;
    const newAttempts = prevAttempts + 1;
    const updates: any = { attempts: newAttempts };
    let reason = "invalid";

    const MAX_ATTEMPTS = 5;
    if (newAttempts >= MAX_ATTEMPTS) {
      // lock for 1 hour by setting expiresAt to 1 hour from now
      const lockUntil = new Date(Date.now() + 60 * 60 * 1000);
      updates.expiresAt = lockUntil;
      reason = "locked";
      console.warn(
        `OTP locked for userRefId=${otpRecord.userRefId} until ${lockUntil.toISOString()} after ${newAttempts} attempts`,
      );
    }

    await this.prisma.oTP.update({
      where: { id: otpRecord.id },
      data: updates,
    });
    return { success: false, reason };
  }

  async isOTPLocked(userId: number) {
    const otpRecord = await this.prisma.oTP.findFirst({
      where: { userRefId: userId },
      orderBy: { createdAt: "desc" },
    });
    if (!otpRecord) return { locked: false, attempts: 0 };
    const attempts = otpRecord.attempts || 0;
    const MAX_ATTEMPTS = 5;
    const now = new Date();
    // We used expiresAt as lockUntil when attempts exceeded MAX_ATTEMPTS.
    if (
      attempts >= MAX_ATTEMPTS &&
      otpRecord.expiresAt &&
      new Date(otpRecord.expiresAt) > now
    ) {
      return { locked: true, unlockTime: otpRecord.expiresAt, attempts };
    }
    return { locked: false, attempts };
  }

  async getAuthByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async getAuthByEmailOrPhone(email?: string, phone?: string) {
    if (!email && !phone) return null;
    // Only include phone if it exists in the schema
    const orArr: any[] = [];
    if (email) orArr.push({ email });
    if (phone) orArr.push({ phone });
    return await this.prisma.user.findFirst({
      where: {
        OR: orArr,
      },
      include: {
        role: true,
      },
    });
  }

  // ====================================================
  // user repository services
  // ====================================================
  async getUserWithPagination(payload: any) {
    return await pagination(
      payload,
      async (limit: number, offset: number, sortOrder: any) => {
        const [doc, totalDoc] = await Promise.all([
          this.prisma.user.findMany({
            skip: offset,
            take: limit,
            // orderBy: sortOrder,
            include: {
              role: true,
            },
          }),
          this.prisma.user.count(),
        ]);
        return { doc, totalDoc };
      },
    );
  }

  async updateUserRole(userId: number, roleId: number) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { roleId },
      include: { role: true },
    });
  }

  async getUserRoleById(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: {
          include: {
            permission: true,
          },
        },
      },
    });
    return user?.role;
  }
  // Add more methods as needed, e.g., setUserOTP, getAllUser, etc.
  // Add more methods as needed, e.g., setUserOTP, getAllUser, etc.

  async getAllUsersWithWallets() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        wallets: true, // Fetches the array of wallets
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}

// Export a singleton instance, similar to module.exports = new AuthRepository(UserSchema)
const authRepository = new AuthRepository();
export default authRepository;
