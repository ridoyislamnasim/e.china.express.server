import { PrismaClient, Prisma } from '@prisma/client';
import { pagination } from '../../utils/pagination';

const prisma = new PrismaClient();

export interface AirBookingDoc {
  title: string;
  details: string;
  type: string;
  airBookingCategory: string;
  status: string;
  link: string;
  // add other fields as needed
}

class AirBookingRepository {
  async createAirBooking(payload: Prisma.ShipmentBookingCreateInput) {
    const newAirBooking = await prisma.shipmentBooking.create({
      data: payload,
    });
    return newAirBooking;
  }

  async getAllAirBooking(filter: any) {
    return await prisma.shipmentBooking.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAirBookingWithPagination(payload: any) {
    // try {
    //   const airBookings = await prisma.airBooking.findMany({
    //     skip: payload.offset,
    //     take: payload.limit,
    //     orderBy: { createdAt: payload.sortOrder },
    //   });
    //   const totalAirBooking = await prisma.airBooking.count();
    //   return { doc: airBookings, totalDoc: totalAirBooking };
    // } catch (error) {
    //   console.error('Error getting airBookings with pagination:', error);
    //   throw error;
    // }

    return await pagination(payload, async (limit: number, offset: number) => {
      const [doc, totalDoc] = await Promise.all([
        await prisma.shipmentBooking.findMany({
          skip: payload.offset,
          take: payload.limit,
          orderBy: { createdAt: payload.sortOrder },
        }),
        await prisma.shipmentBooking.count(),
      ]);
      return { doc, totalDoc };
    });
  }

  async getSingleAirBooking(id: number) {
    const airBooking = await prisma.shipmentBooking.findUnique({
      where: { id },
    });
    return airBooking;
  }

  async updateAirBooking(id: number, payload: Prisma.ShipmentBookingUpdateInput) {
    const updatedAirBooking = await prisma.shipmentBooking.update({
      where: { id },
      data: payload,
    });
    return updatedAirBooking;
  }

  async deleteAirBooking(id: number) {
    const deletedAirBooking = await prisma.shipmentBooking.delete({
      where: { id },
    });
    return deletedAirBooking;
  }
}

export default new AirBookingRepository();
