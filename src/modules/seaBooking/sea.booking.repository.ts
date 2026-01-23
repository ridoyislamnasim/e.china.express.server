import { PrismaClient, Prisma } from '@prisma/client';
import { pagination } from '../../utils/pagination';

const prisma = new PrismaClient();

export interface SeaBookingDoc {
  title: string;
  details: string;
  type: string;
  seaBookingCategory: string;
  status: string;
  link: string;
  // add other fields as needed
}

class SeaBookingRepository {
    private prisma = prisma;
  async createSeaBooking(seaBookingPayload: any, tx?: any) {
    const prismaClient: PrismaClient = tx || this.prisma;
    const newSeaBooking = await prismaClient.shipmentBooking.create({
      data: seaBookingPayload,
    });
    return newSeaBooking;
    // make tx than use tx

  }

  async getAllSeaBookingByFilterWithPagination(payload: any) {
    const { seaBookingStatus , userRef} = payload;
    const filter: any = {};
    if (seaBookingStatus == "CUSTOMER_ALL"){
      filter.warehouseReceivingStatus = { in: ["PENDING", "RECEIVED"] };
    } else {
      filter.warehouseReceivingStatus = seaBookingStatus;
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
                importWarehouseRef: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                exportWarehouseRef: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                importCountryRef: {
                  select: {
                    id: true,
                    name: true,
                    isoCode: true,
                    zone: true,
                  },
                },
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

  async getSingleSeaBooking(id: number) {
    const seaBooking = await prisma.shipmentBooking.findUnique({
      where: { id },
    });
    return seaBooking;
  }

  async updateSeaBooking(id: number, payload: Prisma.ShipmentBookingUpdateInput) {
    const updatedSeaBooking = await prisma.shipmentBooking.update({
      where: { id },
      data: payload,
    });
    return updatedSeaBooking;
  }

  async deleteSeaBooking(id: number) {
    const deletedSeaBooking = await prisma.shipmentBooking.delete({
      where: { id },
    });
    return deletedSeaBooking;
  }
}

export default new SeaBookingRepository();
