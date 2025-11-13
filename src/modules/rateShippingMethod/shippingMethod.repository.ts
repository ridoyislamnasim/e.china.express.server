
import prisma from '../../config/prismadatabase';
import { PrismaClient } from '@prisma/client';

export class ShippingMethodRepository {
  private prisma = prisma;

  // createCustomRoleIfNotExists = async (roleName: string, tx?: any) => {
  //   const prismaClient: PrismaClient = tx || this.prisma;

  //   // Try to find existing role first
  //   let role = await prismaClient.role.findUnique({ where: { role: roleName } });
  //   if (role) return role;

  //   const permission = await prismaClient.permission.create({});
  //   role = await prismaClient.role.create({ data: { role: roleName, permissionId: permission.id } });
  //   return role;
  // };

  async createShippingMethod(payload: any): Promise<any> {
    const newRateShippingMethod = await this.prisma.rateSippingMethod.create({
      data: payload
    })
    return newRateShippingMethod
  }

  // async getUser() {
  //   return await this.prisma.user.findMany();
  // }

  // async getUserById(id: number) {
  //   return await this.prisma.user.findUnique({ where: { id } });
  // }

  // async updateUserPassword(userId: number, password: string) {
  //   return await this.prisma.user.update({ where: { id: userId }, data: { password } });
  // }

  // async getAuthByEmail(email: string) {
  //   return await this.prisma.user.findUnique({ where: { email } });
  // }


  // async getAuthByEmailOrPhone(email?: string, phone?: string) {
  //   if (!email && !phone) return null;
  //   // Only include phone if it exists in the schema
  //   const orArr: any[] = [];
  //   if (email) orArr.push({ email });
  //   if (phone) orArr.push({ phone });
  //   return await this.prisma.user.findFirst({
  //     where: {
  //       OR: orArr,
  //     },
  //     include: {
  //       role: true,
  //     },
  //   });
  // }

  // Add more methods as needed, e.g., setUserOTP, getAllUser, etc.
}

// Export a singleton instance, similar to module.exports = new CountryRepository(UserSchema)
const shippingMethodRepository = new ShippingMethodRepository();
export default shippingMethodRepository;
