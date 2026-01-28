import prisma from '../../config/prismadatabase';
import { PrismaClient } from '@prisma/client';
import { pagination } from '../../utils/pagination';

export class ShipRouteRepository {
  private prisma = prisma;

  async createShipRoute(payload: any): Promise<any> {
    const newShipRoute = await this.prisma.shipRoute.create({
      data: payload
    })
    return newShipRoute
  }


  async getShipRouteWithCondition(condition: any): Promise<any> {
    return await this.prisma.shipRoute.findMany({
      where: condition,
    });
  }

  async updateShipRouteByCondition(id: number, payload: any): Promise<any> {
    return await this.prisma.shipRoute.update({
      where: { id },
      data: payload,
    });
  }



  async getAllShipRoutes() {
    // include ports
    return await this.prisma.shipRoute.findMany(
      {
        include: {
          ship: true,
          fromPort: true,
          toPort: true,
          shipSchedule: true,
        },
      }
    );
  }

  async getShipRouteById(id: number) {
    if (typeof id !== 'number' || isNaN(id)) {
      throw new Error('Argument `id` is missing or not a valid number.');
    }
    return await this.prisma.shipRoute.findUnique({
      where: { id },
    });
  }

  //  async getShipRouteWithPagination(payload: { limit: number; offset: number }, tx: any): Promise<any> {
  async getShipRouteWithPagination(payload: any, tx: any) {
    const prismaClient: PrismaClient = tx || this.prisma;

    return await pagination(payload, async (limit: number, offset: number, sortOrder: any) => {
      const [doc, totalDoc] = await Promise.all([
        prismaClient.shipRoute.findMany({
          skip: offset, // Use the offset passed by the pagination callback
          take: limit,  // Use the limit passed by the pagination callback
          orderBy: { createdAt: sortOrder },
          include: {
            ship: true,
            fromPort: true,
            toPort: true,
            shipSchedule: true,
          },
        }),
        prismaClient.shipRoute.count(),
      ]);
      return { doc, totalDoc };
    });
  }

  //  update 
  async updateShipRoute(id: number, payload: any, tx: any): Promise<any> {
    const prismaClient: PrismaClient = tx || this.prisma;
    const updatedShipRoute = await prismaClient.shipRoute.update({
      where: { id },
      data: payload,
    });
    return updatedShipRoute;
  }

  async deleteShipRoute(id: number): Promise<void> { // Corrected method name
    await this.prisma.shipRoute.delete({ where: { id } });
  }

}

const shipRouteRepository = new ShipRouteRepository();
export default shipRouteRepository;
