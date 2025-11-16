
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

  async findWeightCategoryByWeight(weight: number): Promise<any> {
    const weightCategory = await this.prisma.rateWeightCategorie.findFirst({
      where: {  
        min_weight: { lte: weight },
        max_weight: { gte: weight }
      }
    });
    return weightCategory;
  }

  async createCountryCombinatin(payload: any): Promise<any> {
    const {
      importCountryId,
      exportCountryId,
    } = payload;
    const newRateShippingMethod = await this.prisma.countryCombination.create({
      data: {
        importCountry: { connect: { id: importCountryId } },
        exportCountry: { connect: { id: exportCountryId } }
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

  async updateRate(rateId: number, payload: any): Promise<any> {
    const updatedRate = await this.prisma.rate.update({
      where: { id: rateId },
      data: payload
    });
    return updatedRate;
  }

  async getAllRate(): Promise<any> {  
    const rates = await this.prisma.rate.findMany();
    return rates;
  }

  async findRateByCriteria(payload: any): Promise<any> {
    const { payloadWithCombinationId, weightCategoryId, shippingMethodId, productId } = payload;
    const rates = await this.prisma.rate.findMany({
      where: {
        ...payloadWithCombinationId,
        weightCategoryId,
        shippingMethodId,
        productId
      }
    });
    return rates;
  }
}

// Export a singleton instance, similar to module.exports = new CountryRepository(UserSchema)
const rateRepository = new RateRepository();
export default rateRepository;
