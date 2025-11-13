
import prisma from '../../config/prismadatabase';
import { PrismaClient } from '@prisma/client';
// import { AuthUserSignUpPayload } from '../../types/auth.types';
// import CountryPayload from '../../types/country.type';

export class RateRepository {
  private prisma = prisma;

  async existingCountryConbination(payload: any): Promise<any> {
    const { importCountryId, exportCountryId, route_name } = payload;
    const CountryConbination = await this.prisma.countryCombination.findFirst({
      where: {
        importCountryId,
        exportCountryId,
      }
    });
    return CountryConbination;
  }

  async createCountryCombinatin(payload: any): Promise<any> {
    const {
      importCountryId,
      exportCountryId,
      route_name,
      status
    } = payload;
    const newRateShippingMethod = await this.prisma.countryCombination.create({
      data: {
        route_name,
        status,
        importCountryId,
        exportCountryId
      }
    })
    return newRateShippingMethod
  }
  async createRate(payload: any): Promise<any> {
    const newRateShippingMethod = await this.prisma.rate.create({
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
const rateRepository = new RateRepository();
export default rateRepository;
