
import prisma from '../../config/prismadatabase';
import { PrismaClient } from '@prisma/client';
import { AuthUserSignUpPayload } from '../../types/auth.types';

export class AuthRepository {
  private prisma = prisma;

  async createUser(payload: AuthUserSignUpPayload) {
    const { name, email, password, role, phone } = payload;
    if (!name || !password) {
      const error = new Error('name and password are required');
      (error as any).statusCode = 400;
      throw error;
    }
    const userData: any = {
      name,
      email: email || '',
      password,
    };
    if (phone) userData.phone = phone;
    if (role) userData.role = role;
    // console.log('Creating user with data:', userData);
    const newUser = await this.prisma.user.create({
      data: userData,
    });
    return newUser;
  }

  async getUser() {
    return await this.prisma.user.findMany();
  }

  async getUserById(id: number) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async updateUserPassword(userId: number, password: string) {
    return await this.prisma.user.update({ where: { id: userId }, data: { password } });
  }

  async getAuthByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  // Prisma does not support $or in the same way as Mongoose, so we use OR array
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
    });
  }

// Add more methods as needed, e.g., setUserOTP, getAllUser, etc.
}

// Export a singleton instance, similar to module.exports = new AuthRepository(UserSchema)
const authRepository = new AuthRepository();
export default authRepository;
