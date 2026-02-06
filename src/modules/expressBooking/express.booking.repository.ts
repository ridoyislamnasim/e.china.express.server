import { PrismaClient, Prisma } from '@prisma/client';
import { pagination } from '../../utils/pagination';

const prisma = new PrismaClient();

export interface ExpressBookingDoc {
  title: string;
  details: string;
  type: string;
  expressBookingCategory: string;
  status: string;
  link: string;
  // add other fields as needed
}

class ExpressBookingRepository {
    private prisma = prisma;
  async createExpressBooking(expressBookingPayload: any, tx?: any) {
    const prismaClient: PrismaClient = tx || this.prisma;
    const newExpressBooking = await prismaClient.shipmentBooking.create({
      data: expressBookingPayload,
    });
    return newExpressBooking;
    // make tx than use tx

  }

  async getAllExpressBookingByFilterWithPagination(payload: any) {
    const { expressBookingStatus , userRef} = payload;
    const filter: any = {};
    if (expressBookingStatus == "CUSTOMER_ALL"){
      filter.warehouseReceivingStatus = { in: ["PENDING", "RECEIVED"] };
    } else {
      filter.warehouseReceivingStatus = expressBookingStatus;
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

  async getSingleExpressBooking(id: number) {
    const expressBooking = await prisma.shipmentBooking.findUnique({
      where: { id },
    });
    return expressBooking;
  }

  async updateExpressBooking(id: number, payload: Prisma.ShipmentBookingUpdateInput) {
    const updatedExpressBooking = await prisma.shipmentBooking.update({
      where: { id },
      data: payload,
    });
    return updatedExpressBooking;
  }

  async deleteExpressBooking(id: number) {
    const deletedExpressBooking = await prisma.shipmentBooking.delete({
      where: { id },
    });
    return deletedExpressBooking;
  }
}

export default new ExpressBookingRepository();
