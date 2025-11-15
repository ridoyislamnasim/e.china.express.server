
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
  async getAllRateProduct(): Promise<any> {
    const rateProducts = await this.prisma.rateProduct.findMany({
      include: {
        categorie: true,
        subCategories: true,
        subHeadings: true,
      },
    });
    return rateProducts;
  }
}

// Export a singleton instance, similar to module.exports = new CountryRepository(UserSchema)
const ratePorductRepository = new RatePorductRepository();
export default ratePorductRepository;
