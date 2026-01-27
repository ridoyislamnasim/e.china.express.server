import prisma from '../../config/prismadatabase';
import { PrismaClient } from '@prisma/client';
import { pagination } from '../../utils/pagination';

export class ShipRepository {
  private prisma = prisma;

  async createShip(payload: any) : Promise<any> {
    const newShip = await this.prisma.ship.create({
      data: payload
    })
    return newShip
  }


  async getShipWithCondition(condition: any): Promise<any> {
    return await this.prisma.ship.findMany({
      where: condition,
    });
  }

  async updateShipByCondition(id: number, payload: any): Promise<any> {
    return await this.prisma.ship.update({
      where: { id },
      data: payload,
    });
  }



  async getAllShips() {
    // include ports
    return await this.prisma.ship.findMany();
  }

  async getShipById(id: number) {
    if (typeof id !== 'number' || isNaN(id)) {
      throw new Error('Argument `id` is missing or not a valid number.');
    }
    return await this.prisma.ship.findUnique({
      where: { id },
    });
  }

//  async getShipWithPagination(payload: { limit: number; offset: number }, tx: any): Promise<any> {
    async getShipWithPagination(payload: any, tx: any) {
    const prismaClient: PrismaClient = tx || this.prisma;

        return await pagination(payload, async (limit: number, offset: number, sortOrder: any) => {
          const [doc, totalDoc] = await Promise.all([
            prismaClient.ship.findMany({
              skip: offset, // Use the offset passed by the pagination callback
              take: limit,  // Use the limit passed by the pagination callback
              orderBy: { createdAt: sortOrder },
            }),
            prismaClient.ship.count(),
          ]);
          return { doc, totalDoc };
        });
 }

//  update 
  async updateShip(id: number, payload: any, tx: any): Promise<any> {
    const prismaClient: PrismaClient = tx || this.prisma;
    const updatedShip = await prismaClient.ship.update({
      where: { id },
      data: payload,
    });
    return updatedShip;
  }

  async deleteShip(id: number): Promise<void> { // Corrected method name
    await this.prisma.ship.delete({ where: { id } });
  }

}

const shipRepository = new ShipRepository();
export default shipRepository;
