import { PrismaClient, Prisma } from '@prisma/client';
import { pagination } from '../../utils/pagination';
import { NotFoundError } from '../../utils/errors';

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
  async createSupplierInformation(supplierData: any, tx?: any) {
    const prismaClient: PrismaClient = tx || this.prisma;
    const newBooking = await prismaClient.suppliers.create({
      data: supplierData,
    });
    return newBooking;
    // make tx than use tx

  }

  async getAllBookingByFilterWithPagination(payload: any) {
    const { bookingStatus , userRef} = payload;
    const filter: any = {};
    if (bookingStatus == "CUSTOMER_ALL"){
      filter.warehouseReceivingStatus = { in: ["PENDING", "REJECTED_AT_WAREHOUSE", "APPROVE"] };
    } else {
      filter.warehouseReceivingStatus = bookingStatus.toUpperCase();
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
                supplierRef: true,
                packageRef: true,
                shippingMethodRef: true,
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

    async getAllBookingForAdminByFilterWithPagination(payload: any) {
    const { bookingStatus } = payload;
    const filter: any = {};
    if (bookingStatus == "PENDING_REJECTED_AT_WAREHOUSE_APPROVE"){
      filter.warehouseReceivingStatus = { in: ["PENDING", "REJECTED_AT_WAREHOUSE", "APPROVE"] };
    } else {
      filter.warehouseReceivingStatus = bookingStatus.toUpperCase();
    }

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
                supplierRef: true,
                packageRef: true,
                customerRef:{
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                  }
                },
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

  async getAllSupplierInformation(payload: any) {
    const { search } = payload;
    const filter: any = {};
    if (search) {
      filter.OR = [
        { supplierNo: { contains: search, mode: 'insensitive' } },
        { supplierEmail: { contains: search, mode: 'insensitive' } },
        { supplierPhone: { contains: search, mode: 'insensitive' } },
        { contact_person: { contains: search, mode: 'insensitive' } },
      ];
    }
    const suppliers = await this.prisma.suppliers.findMany({
      where: filter,
      orderBy: {
        id: 'desc',
      },
    });
    return suppliers;
  }

  async getSingleBooking(id: number) {
    const Booking = await prisma.shipmentBooking.findUnique({
      where: { id },
    });
    return Booking;
  }

  async findByConditionAndUpdate(where: object, data: Partial<BookingDoc>, tx?: any) {
    const prismaClient: PrismaClient = tx || this.prisma;
    const updatedBooking = await prismaClient.shipmentBooking.updateMany({
      where,
      data,
    });
    return updatedBooking;
  }

  async updateBooking(id: number, payload: Prisma.ShipmentBookingUpdateInput, tx?: any) {
    console.log("Update Booking Payload:",id, payload);
    const prismaClient: PrismaClient = tx || this.prisma;
    try {
      const updatedBooking = await prismaClient.shipmentBooking.update({
        where: { id },
        data: payload,
      });
      return updatedBooking;
    } catch (err: any) {
      // Prisma throws P2025 when record to update is not found
      if (err?.code === 'P2025') throw new NotFoundError('Booking Not Find');
      throw err;
    }
  }

  async deleteBooking(id: number) {
    const deletedBooking = await prisma.shipmentBooking.delete({
      where: { id },
    });
    return deletedBooking;
  }
}

export default new BookingRepository();
