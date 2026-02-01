import { PrismaClient, Prisma } from '@prisma/client';
import { pagination } from '../../utils/pagination';

const prisma = new PrismaClient();

export interface BookingDoc {
  title: string;
  details: string;
  type: string;
  BookingCategory: string;
  status: string;
  link: string;
  // add other fields as needed
}

class BookingRepository {
    private prisma = prisma;
  async createBooking(BookingPayload: any, tx?: any) {
    const prismaClient: PrismaClient = tx || this.prisma;
    const newBooking = await prismaClient.shipmentBooking.create({
      data: BookingPayload,
    });
    return newBooking;
    // make tx than use tx

  }

  async getAllBookingByFilterWithPagination(payload: any) {
    const { BookingStatus , userRef} = payload;
    const filter: any = {};
    if (BookingStatus == "CUSTOMER_ALL"){
      filter.warehouseReceivingStatus = { in: ["PENDING", "RECEIVED"] };
    } else {
      filter.warehouseReceivingStatus = BookingStatus;
    }
    if (userRef) filter.customerId = Number(userRef);

     return await pagination(payload, async (limit: number, offset: number, sortOrder: any) => {
          const [doc, totalDoc] = await Promise.all([
            this.prisma.shipmentBooking.findMany({
              where: filter,
              skip: offset,
              take: limit,
              orderBy: {
                id: sortOrder,
              },
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

  async getSingleBooking(id: number) {
    const Booking = await prisma.shipmentBooking.findUnique({
      where: { id },
    });
    return Booking;
  }

  async updateBooking(id: number, payload: Prisma.ShipmentBookingUpdateInput) {
    const updatedBooking = await prisma.shipmentBooking.update({
      where: { id },
      data: payload,
    });
    return updatedBooking;
  }

  async deleteBooking(id: number) {
    const deletedBooking = await prisma.shipmentBooking.delete({
      where: { id },
    });
    return deletedBooking;
  }
}

export default new BookingRepository();
