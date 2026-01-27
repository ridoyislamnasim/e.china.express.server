
import prisma from '../../config/prismadatabase';
import { PrismaClient } from '@prisma/client';
import { pagination } from '../../utils/pagination';

export class ContainerRepository {
  private prisma = prisma;

  async createContainer(payload: any) : Promise<any> {
    const newContainer = await this.prisma.container.create({
      data: payload
    })
    return newContainer
  }


  async getContainerWithCondition(condition: any): Promise<any> {
    return await this.prisma.container.findMany({
      where: condition,
    });
  }

  async updateContainerByCondition(id: number, payload: any): Promise<any> {
    return await this.prisma.container.update({
      where: { id },
      data: payload,
    });
  }



  async getAllContainers() {
    // include ports
    return await this.prisma.container.findMany();
  }

  async getContainerById(id: number) {
    return await this.prisma.container.findUnique({
      where: { id },
    });
  }

//  async getContainerWithPagination(payload: { limit: number; offset: number }, tx: any): Promise<any> {
    async getContainerWithPagination(payload: any, tx: any) {
    const prismaClient: PrismaClient = tx || this.prisma;

        return await pagination(payload, async (limit: number, offset: number, sortOrder: any) => {
          const [doc, totalDoc] = await Promise.all([
            prismaClient.container.findMany({
              skip: offset, // Use the offset passed by the pagination callback
              take: limit,  // Use the limit passed by the pagination callback
              orderBy: { createdAt: sortOrder },
            }),
            prismaClient.container.count(),
          ]);
          return { doc, totalDoc };
        });
 }

//  update 
  async updateContainer(id: number, payload: any, tx: any): Promise<any> {
    const prismaClient: PrismaClient = tx || this.prisma;
    const updatedContainer = await prismaClient.container.update({
      where: { id },
      data: payload,
    });
    return updatedContainer;
  }

  async deleteContainer(id: number): Promise<void> { // Corrected method name
    await this.prisma.container.delete({ where: { id } });
  }

}
const containerRepository = new ContainerRepository();
export default containerRepository;
