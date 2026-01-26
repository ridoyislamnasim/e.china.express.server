import prisma from '../../config/prismadatabase';
import { PrismaClient } from '@prisma/client';
// import { AuthUserSignUpPayload } from '../../types/auth.types';
// import CountryPayload from '../../types/country.type';

export class RateExpressRepository {
  private prisma = prisma;


  async findWeightCategoryByWeight(weight: number): Promise<any> {
    const client = this.prisma;
    const weightCategory = await client.rateWeightCategorie.findFirst({
      where: {  
        min_weight: { lte: weight },
        max_weight: { gte: weight }
      }
    });
    return weightCategory;
  }


  async createRateExpress(payload: any, tx?: PrismaClient): Promise<any> {
    const client = tx || this.prisma;
    const newRateExpressShippingMethod = await client.expressRate.create({
      data: payload
    })
    return newRateExpressShippingMethod
  }

  async findRateExpressByTId(id:number):Promise<any>{
    const rate = await this.prisma.expressRate.findUnique({
      where:{id},
      include:{
        countryZone:true,
        shippingMethod:true,
        weightCategory:true
      }

    });
    return rate;
  }

  async updateRateExpress(rateId: number, payload: any, tx?: PrismaClient): Promise<any> {
    const client = tx || this.prisma;
    const updatedRateExpress = await client.expressRate.update({
      where: { id: rateId },
      data: payload
    });
    return updatedRateExpress;
  }

  async getAllRateExpress(): Promise<any> {  
    const rates = await this.prisma.expressRate.findMany();
    return rates;
  }

  async findRateExpressByCriteria(payload: any, tx?: PrismaClient): Promise<any> {
    const { countryZoneId, weightCategoryId, shippingMethodId } = payload;
    console.log("payload in repo", payload);
    const client = tx || this.prisma;
    const rates = await client.expressRate.findMany({
      where: {
        countryZoneId,
        weightCategoryId,
        shippingMethodId,
      },
      include: {
        countryZone: {
          select: {
            id: true,
            name: true,
            zoneCode: true,
          }
        },
        weightCategory: {
          select: {
            id: true,
            label: true,
            min_weight: true,
            max_weight: true
          }
        },
        shippingMethod: {
          select: {
            id: true,
            name: true
          }
        },
      }
    });
    return rates;
  }

  async countryMethodWiseRateExpress(payload: any, tx?: PrismaClient): Promise<any> {
    const { shippingMethodId, countryCombinationId } = payload;
    const client = tx || this.prisma;
    const rates = await client.expressRate.findMany({
      where: {
        shippingMethodId
      }
    });
    return rates;
  }
  
}

// Export a singleton instance, similar to module.exports = new CountryRepository(UserSchema)
const rateRepository = new RateExpressRepository();
export default rateRepository;
