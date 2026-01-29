import prisma from '../../config/prismadatabase';
import { PrismaClient } from '@prisma/client';
import { pagination } from '../../utils/pagination';

export class CarrierCompanyRepository {
  private prisma = prisma;

  async createCarrierCompany(payload: any) : Promise<any> {
    const newCarrierCompany = await this.prisma.carrierCompany.create({
      data: payload
    })
    return newCarrierCompany
  }


  async getCarrierCompanyWithCondition(condition: any): Promise<any> {
    return await this.prisma.carrierCompany.findMany({
      where: condition,
    });
  }

  async updateCarrierCompanyByCondition(id: number, payload: any): Promise<any> {
    return await this.prisma.carrierCompany.update({
      where: { id },
      data: payload,
    });
  }



  async getAllCarrierCompanys() {
    // include ports
    return await this.prisma.carrierCompany.findMany();
  }

  async getCarrierCompanyById(id: number) {
    if (typeof id !== 'number' || isNaN(id)) {
      throw new Error('Argument `id` is missing or not a valid number.');
    }
    return await this.prisma.carrierCompany.findUnique({
      where: { id },
    });
  }

//  async getCarrierCompanyWithPagination(payload: { limit: number; offset: number }, tx: any): Promise<any> {
    async getCarrierCompanyWithPagination(payload: any, tx: any) {
    const prismaClient: PrismaClient = tx || this.prisma;

        return await pagination(payload, async (limit: number, offset: number, sortOrder: any) => {
          const [doc, totalDoc] = await Promise.all([
            prismaClient.carrierCompany.findMany({
              skip: offset, // Use the offset passed by the pagination callback
              take: limit,  // Use the limit passed by the pagination callback
              orderBy: { createdAt: sortOrder },
            }),
            prismaClient.carrierCompany.count(),
          ]);
          return { doc, totalDoc };
        });
 }

//  update 
  async updateCarrierCompany(id: number, payload: any, tx: any): Promise<any> {
    const prismaClient: PrismaClient = tx || this.prisma;
    const updatedCarrierCompany = await prismaClient.carrierCompany.update({
      where: { id },
      data: payload,
    });
    return updatedCarrierCompany;
  }

  async deleteCarrierCompany(id: number): Promise<void> { // Corrected method name
    await this.prisma.carrierCompany.delete({ where: { id } });
  }

}

const carrierCompanyRepository = new CarrierCompanyRepository();
export default carrierCompanyRepository;
