import prisma from '../../config/prismadatabase';
import { PrismaClient } from '@prisma/client';
// import { AuthUserSignUpPayload } from '../../types/auth.types';
// import CountryPayload from '../../types/country.type';

export class RateRepository {
  private prisma = prisma;

  async existingCountryConbination(payload: any, tx?: PrismaClient): Promise<any> {
    const { importCountryId, exportCountryId, route_name } = payload;
    const client = tx || this.prisma;
    const CountryConbination = await client.countryCombination.findFirst({
      where: {
        importCountryId,
        exportCountryId,
      }
    });
    return CountryConbination;
  }

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

  async createCountryCombinatin(payload: any, tx?: PrismaClient): Promise<any> {
    const {
      importCountryId,
      exportCountryId,
    } = payload;
    const client = tx || this.prisma;
    const newRateShippingMethod = await client.countryCombination.create({
      data: {
        importCountry: { connect: { id: importCountryId } },
        exportCountry: { connect: { id: exportCountryId } }
      }
    })
    return newRateShippingMethod
  }

  async createRate(payload: any, tx?: PrismaClient): Promise<any> {
    const client = tx || this.prisma;
    const newRateShippingMethod = await client.rate.create({
      data: payload
    })
    return newRateShippingMethod
  }

  async findRateByTId(id:number):Promise<any>{
    const rate = await this.prisma.rate.findUnique({
      where:{id},
      include:{
        countryCombination: {
          select: {
            id: true,
            importCountryId: true,
            exportCountryId: true,
          }
        },
        weightCategory: true,
        shippingMethod: true,
        category1688: {
          select: {
            categoryId: true,
            translatedName: true,
            parent: {
              select: {
                categoryId: true,
                translatedName: true,
              }
            },
            children: {
              select: {
                categoryId: true,
                translatedName: true,
              }
            }
          }
        }
      }

    });
    return rate;
  }

  async updateRate(rateId: number, payload: any, tx?: PrismaClient): Promise<any> {
    const client = tx || this.prisma;
    const updatedRate = await client.rate.update({
      where: { id: rateId },
      data: payload
    });
    return updatedRate;
  }

  async getAllRate(): Promise<any> {  
    const rates = await this.prisma.rate.findMany();
    return rates;
  }

  async findRateByCriteria(payload: any, tx?: PrismaClient): Promise<any> {
    const { countryCombinationId, weightCategoryId, shippingMethodId, category1688Id } = payload;
    console.log("payload in repo", payload);
    const client = tx || this.prisma;
    const rates = await client.rate.findMany({
      where: {
        countryCombinationId,
        weightCategoryId,
        shippingMethodId,
        category1688Id: Number(category1688Id)
      },
      include: {
        countryCombination: {
          select: {
            id: true,
            importCountryId: true,
            exportCountryId: true,
            importCountry: {
              select: {
                id: true,
                name: true
              }
            },
            exportCountry: {
              select: {
                id: true,
                name: true
              }
            }
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
        category1688: {
          select: {
            id: true,
            categoryId: true,
            translatedName: true,
            parent: {
              select: {
                id: true,
                categoryId: true,
                translatedName: true,
              }
            },
          }
        }
      }
    });
    return rates;
  }

  async countryMethodWiseRate(payload: any, tx?: PrismaClient): Promise<any> {
    const { shippingMethodId, countryCombinationId } = payload;
    const client = tx || this.prisma;
    const rates = await client.rate.findMany({
      where: {
        shippingMethodId,
        countryCombinationId
      }
    });
    return rates;
  }
  
}

// Export a singleton instance, similar to module.exports = new CountryRepository(UserSchema)
const rateRepository = new RateRepository();
export default rateRepository;
