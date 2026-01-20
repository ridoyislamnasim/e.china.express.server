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
    private prisma = prisma;
  async createAirBooking(airBookingPayload: any, tx?: any) {
    const prismaClient: PrismaClient = tx || this.prisma;
    const newAirBooking = await prismaClient.shipmentBooking.create({
      data: airBookingPayload,
    });
    return newAirBooking;
    // make tx than use tx

  }

  async getAllAirBookingByFilterWithPagination(payload: any) {
    const { airBookingStatus , userRef} = payload;
    const filter: any = {};
    if (airBookingStatus == "CUSTOMER_ALL"){
      filter.warehouseReceivingStatus = { in: ["PENDING", "RECEIVED"] };
    } else {
      filter.warehouseReceivingStatus = airBookingStatus;
    }
    if (userRef) filter.customerId = Number(userRef);

     return await pagination(payload, async (limit: number, offset: number, sortOrder: any) => {
          const [doc, totalDoc] = await Promise.all([
            this.prisma.shipmentBooking.findMany({
              where: filter,
              skip: offset,
              take: limit,
              // orderBy: sortOrder,
              include: {
                rateRef: {
                  include: {
                    category1688: true,
                    shippingMethod: true,
                  },
                },
                // warehouseImportRef: {
                //   select: {
                //     id: true,
                //     name: true,
                //   },
                // },
                warehouseExportRef: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                // importCountryRef: {
                //   select: {
                //     id: true,
                //     name: true,
                //     isoCode: true,
                //     zone: true,
                //   },
                // },
                exportCountryRef: {
                  select: {
                    id: true,
                    name: true,
                    isoCode: true,
                    zone: true,
                  },
                },
                // customer: true,
              },
            }),
            this.prisma.shipmentBooking.count({ where: filter }), // total count with filter
          ]);
          return { doc, totalDoc };
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
