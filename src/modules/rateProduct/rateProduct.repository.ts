
import prisma from '../../config/prismadatabase';
import { PrismaClient } from '@prisma/client';
// import { AuthUserSignUpPayload } from '../../types/auth.types';
// import CountryPayload from '../../types/country.type';

export class RatePorductRepository {
  private prisma = prisma;

  async createRateProduct(payload: any): Promise<any> {
    const { name, shCategoryCode } = payload
    const newRateShippingMethod = await this.prisma.rateProduct.create({
      data: payload
    })
    return newRateShippingMethod
  }
  // check exist category , subcategory , subheading
  async existCategory(payload: any): Promise<any> {
    const { name, shCategoryCode } = payload
    const existCategory = await this.prisma.categorie.findFirst({
      where: {
        name,
        shCategoryCode
      }
    });
    return existCategory;
  }
  async existSubCategory(payload: any): Promise<any> {
    const { name, shSubCategoryCode } = payload
    const existCategory = await this.prisma.subCategories.findFirst({
      where: {
        name,
        shSubCategoryCode
      }
    });
    return existCategory;
  }
  async existSubHeading(payload: any): Promise<any> {
    const { name, hsSubHeadingCode } = payload
    const existCategory = await this.prisma.subHeadings.findFirst({
      where: {
        name,
        hsSubHeadingCode
      }
    });
    return existCategory;
  }
  // create category , subcategory , subheading
  async createCategory(payload: any): Promise<any> {
    const newCategory = await this.prisma.categorie.create({
      data: payload
    })
    return newCategory
  }
  async createSubCategory(payload: any): Promise<any> {
    const newSubCategory = await this.prisma.subCategories.create({
      data: payload
    })
    return newSubCategory
  }
  async createSubHeading(payload: any): Promise<any> {
    const newSubHeading = await this.prisma.subHeadings.create({
      data: payload
    })
    return newSubHeading
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
const ratePorductRepository = new RatePorductRepository();
export default ratePorductRepository;
