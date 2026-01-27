import prisma from '../../config/prismadatabase';
import { PrismaClient } from '@prisma/client';
import { pagination } from '../../utils/pagination';

export class ShipScheduleRepository {
  private prisma = prisma;

  async createShipSchedule(payload: any): Promise<any> {
    const newShipSchedule = await this.prisma.shipSchedule.create({
      data: payload
    })
    return newShipSchedule
  }


  async getShipScheduleWithCondition(condition: any): Promise<any> {
    return await this.prisma.shipSchedule.findMany({
      where: condition,
    });
  }

  async updateShipScheduleByCondition(id: number, payload: any): Promise<any> {
    return await this.prisma.shipSchedule.update({
      where: { id },
      data: payload,
    });
  }



  async getAllShipSchedules() {
    console.log("Fetching all ship schedules from DB");
    // include ports
    return await this.prisma.shipSchedule.findMany();
  }

  async getShipScheduleById(id: number) {
    if (typeof id !== 'number' || isNaN(id)) {
      throw new Error('Argument `id` is missing or not a valid number.');
    }
    return await this.prisma.shipSchedule.findUnique({
      where: { id },
    });
  }

  //  async getShipScheduleWithPagination(payload: { limit: number; offset: number }, tx: any): Promise<any> {
  async getShipScheduleWithPagination(payload: any, tx: any) {
    const prismaClient: PrismaClient = tx || this.prisma;

    return await pagination(payload, async (limit: number, offset: number, sortOrder: any) => {
      const [doc, totalDoc] = await Promise.all([
        prismaClient.shipSchedule.findMany({
          skip: offset, // Use the offset passed by the pagination callback
          take: limit,  // Use the limit passed by the pagination callback
          orderBy: { createdAt: sortOrder },
        }),
        prismaClient.shipSchedule.count(),
      ]);
      return { doc, totalDoc };
    });
  }

  //  update 
  async updateShipSchedule(id: number, payload: any, tx: any): Promise<any> {
    const prismaClient: PrismaClient = tx || this.prisma;
    const updatedShipSchedule = await prismaClient.shipSchedule.update({
      where: { id },
      data: payload,
    });
    return updatedShipSchedule;
  }

  async deleteShipSchedule(id: number): Promise<void> { // Corrected method name
    await this.prisma.shipSchedule.delete({ where: { id } });
  }

}

const shipScheduleRepository = new ShipScheduleRepository();
export default shipScheduleRepository;
