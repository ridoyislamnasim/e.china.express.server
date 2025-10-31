
import prisma from '../../config/prismadatabase';
import { PrismaClient } from '@prisma/client';
import { AuthUserSignUpPayload } from '../../types/auth.types';

export class AuthRepository {
  private prisma = prisma;

  createCustomRoleIfNotExists = async (roleName: string, tx?: any) => {
    const prismaClient: PrismaClient = tx || this.prisma;

    // Try to find existing role first
    let role = await prismaClient.role.findUnique({ where: { role: roleName } });
    if (role) return role;

      const permission = await prismaClient.permission.create({});
      role = await prismaClient.role.create({ data: { role: roleName, permissionId: permission.id } });
      return role;
  };

  async createUser(payload: AuthUserSignUpPayload, tx?: any) {
    const { name, email, password, roleId, phone } = payload;
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
    if (roleId) userData.roleId = roleId;
    // console.log('Creating user with data:', userData);
    const newUser = await this.prisma.user.create({
      data: userData,
    });
    console.log('User created successfully:', newUser);
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

// Add more methods as needed, e.g., setUserOTP, getAllUser, etc.
}

// Export a singleton instance, similar to module.exports = new AuthRepository(UserSchema)
const authRepository = new AuthRepository();
export default authRepository;
