
import prisma from '../../config/prismadatabase';
import { PrismaClient } from '@prisma/client';
import { pagination } from '../../utils/pagination';

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
  
    async getShippingMethodWithPagination(payload: any) {
  
      return await pagination(payload, async (limit: number, offset: number) => {
        const [doc, totalDoc] = await Promise.all([
          await prisma.rateShippingMethod.findMany({
            skip: offset,
            take: limit,
            orderBy: { createdAt: payload.sortOrder },
          }),
          await prisma.rateShippingMethod.count(),
        ]);
        return { doc, totalDoc };
      });
    }
  
    // get single shipping method by id
    async getSingleShippingMethod(id: string): Promise<any> {
      const shippingMethod = await this.prisma.rateShippingMethod.findUnique({
        where: { id: Number(id) },
      });
      return shippingMethod;
    }

  async updateShippingMethod(id: string, payload: any): Promise<any> {
    // Implement update logic here
    const updatedShippingMethod = await this.prisma.rateShippingMethod.update({
      where: { id: Number(id) },
      data: payload,
    });
    return updatedShippingMethod;
  }

  async deleteShippingMethod(id: string): Promise<any> {
    // Implement delete logic here
    const deletedShippingMethod = await this.prisma.rateShippingMethod.delete({
      where: { id: Number(id) },
    });
    return deletedShippingMethod;
  }
}

// Export a singleton instance, similar to module.exports = new CountryRepository(UserSchema)
const shippingMethodRepository = new ShippingMethodRepository();
export default shippingMethodRepository;
