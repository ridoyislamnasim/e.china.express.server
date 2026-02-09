import prisma from '../../config/prismadatabase';
import { PrismaClient } from '@prisma/client';
// import { AuthUserSignUpPayload } from '../../types/auth.types';
// import CountryPayload from '../../types/country.type';

export class RateFreightRepository {
  private prisma = prisma;



  async createRateFreight(payload: any, tx?: PrismaClient): Promise<any> {
    const client = tx || this.prisma;
    console.log("payload in repo ----- ", payload);

    const data: any = {
      price: payload.price,
      cargoType: payload.cargoType,
      shipmentMode: payload.shipmentMode,
      shippingMethod: { connect: { id: Number(payload.shippingMethodId) } },
      route: { connect: { id: Number(payload.routeId) } },
      carrierCompany: { connect: { id: Number(payload.carrierCompanyId) } },
      shipSchedule: payload.shipScheduleId ? { connect: { id: Number(payload.shipScheduleId) } } : undefined
    };


    if (payload.cbm !== undefined && payload.cbm !== null) data.cbm = Number(payload.cbm);
    if (payload.containerId !== undefined && payload.containerId !== null) data.container = { connect: { id: Number(payload.containerId) } };
console.log("data in repo", data);
    const newRateFreightShippingMethod = await client.freightRate.create({
      data
    });
    return newRateFreightShippingMethod
  }

  async findRateFreightByTId(id:number):Promise<any>{
    const rate = await this.prisma.freightRate.findUnique({
      where:{id},
      include:{
        shippingMethod:true,
        route:true,
        container:true
      }

    });
    return rate;
  }

  async updateRateFreight(rateId: number, payload: any, tx?: PrismaClient): Promise<any> {
    const client = tx || this.prisma;
    const updatedRateFreight = await client.freightRate.update({
      where: { id: rateId },
      data: payload
    });
    return updatedRateFreight;
  }

  async getAllRateFreight(): Promise<any> {  
    const rates = await this.prisma.freightRate.findMany();
    return rates;
  }

  async findRateFreightByCriteria(payload: any, tx?: PrismaClient): Promise<any> {
    console.log("payload in repo", payload);
    const { toPortId, fromPortId, date,maxPrice, minPrice, shipmentMode, cargoType } = payload;
    // Build where condition based on provided criteria
    const whereCondition: any = {};
    if (toPortId || fromPortId) {
      whereCondition.route = {
        ...(toPortId ? { toPortId: Number(toPortId) } : {}),
        ...(fromPortId ? { fromPortId: Number(fromPortId) } : {})
      };
    }
    if (date) {
      whereCondition.shipSchedule = {
        sailingDate: {
          // Use lte (less than or equal) to find schedules on or before the given date
          gte: new Date(date),
        }
      };
    }
    if (maxPrice !== undefined) {
      whereCondition.price = {
        ...whereCondition.price,
        lte: Number(maxPrice)
      };
    }
    if (minPrice !== undefined) {
      whereCondition.price = {
        ...whereCondition.price,
        gte: Number(minPrice)
      };
    }
    if (shipmentMode) {
      whereCondition.shipmentMode = shipmentMode;
    }
    if (cargoType) {
      whereCondition.cargoType = cargoType;
    }
    const client = tx || this.prisma;
    const rates = await client.freightRate.findMany({
      where: {
       ...whereCondition
      },
      include: {
        shippingMethod: true,
        route: {
          include: {
            fromPort: true,
            toPort: true
          }
        },
        container: true,
        shipSchedule: true,
        carrierCompany: true

      }
    });
    return rates;
  }

  async existFreightRate(payload: any, tx?: PrismaClient): Promise<any> {
    console.log("payload in repo", payload);
    const { routeId, cargoType, shipmentMode, shippingMethodId, carrierCompanyId, cbm, containerId } = payload;
    const whereCondition: any = {
      routeId: Number(routeId),
      cargoType,
      shipmentMode,
      shippingMethodId: Number(shippingMethodId),
      carrierCompanyId: Number(carrierCompanyId),
    };
    if (cbm !== undefined && cbm !== null) whereCondition.cbm = Number(cbm);
    if (containerId !== undefined && containerId !== null) whereCondition.containerId = Number(containerId);
    const client = tx || this.prisma;
    const rate = await client.freightRate.findFirst({
      where: whereCondition
    });
    return rate;
  }


  async countryMethodWiseRateFreight(payload: any, tx?: PrismaClient): Promise<any> {
    const { shippingMethodId, countryCombinationId } = payload;
    const client = tx || this.prisma;
    const rates = await client.freightRate.findMany({
    });
    return rates;
  }
  
}

// Export a singleton instance, similar to module.exports = new CountryRepository(UserSchema)
const rateRepository = new RateFreightRepository();
export default rateRepository;
