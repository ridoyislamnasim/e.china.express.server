
import prisma from '../../config/prismadatabase';
import { PrismaClient } from '@prisma/client';

export class ShippingMethodRepository {
  private prisma = prisma;

  async createShippingMethod(payload: any): Promise<any> {
    const newRateShippingMethod = await this.prisma.rateShippingMethod.create({
      data: payload
    })
    return newRateShippingMethod
  }

  async getShippingMethod(): Promise<any> {
    const shippingMethods = await this.prisma.rateShippingMethod.findMany();
    return shippingMethods;
  }
}

// Export a singleton instance, similar to module.exports = new CountryRepository(UserSchema)
const shippingMethodRepository = new ShippingMethodRepository();
export default shippingMethodRepository;
