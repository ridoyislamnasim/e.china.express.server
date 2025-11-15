
import prisma from '../../config/prismadatabase';
import { PrismaClient } from '@prisma/client';
// import { AuthUserSignUpPayload } from '../../types/auth.types';
// import CountryPayload from '../../types/country.type';

export class RateWeightCategoriesRepository {
  private prisma = prisma;

  async createRateWeightCategories(payload: any): Promise<any> {
    const newRateShippingMethod = await this.prisma.rateWeightCategorie.create({
      data: payload
    })
    return newRateShippingMethod
  }

  async getAllRateWeightCategories(): Promise<any> {
    const rateWeightCategories = await this.prisma.rateWeightCategorie.findMany({
      orderBy: {
        min_weight: 'asc'
      }
    });
    return rateWeightCategories;
  }
}

// Export a singleton instance, similar to module.exports = new CountryRepository(UserSchema)
const rateWeightCategoriesRepository = new RateWeightCategoriesRepository();
export default rateWeightCategoriesRepository;
