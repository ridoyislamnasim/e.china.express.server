
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

  async updateRateWeightCategories(id: string, payload: any): Promise<any> {
    const updatedCategory = await this.prisma.rateWeightCategorie.update({
      where: { id: Number(id) },
      data: payload
    });
    return updatedCategory;
  }

  async getAllRateWeightCategories(): Promise<any> {
    const rateWeightCategories = await this.prisma.rateWeightCategorie.findMany({
      orderBy: {
        min_weight: 'asc'
      }
    });
    return rateWeightCategories;
  }

  async deleteRateWeightCategories(id: string): Promise<any> {
    const deletedCategory = await this.prisma.rateWeightCategorie.delete({
      where: { id: Number(id) }
    });
    return deletedCategory;
  }
}

// Export a singleton instance, similar to module.exports = new CountryRepository(UserSchema)
const rateWeightCategoriesRepository = new RateWeightCategoriesRepository();
export default rateWeightCategoriesRepository;
