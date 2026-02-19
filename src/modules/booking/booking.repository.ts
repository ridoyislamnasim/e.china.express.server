import { PrismaClient, Prisma } from '@prisma/client';
import { pagination } from '../../utils/pagination';
import { NotFoundError } from '../../utils/errors';
import e from 'express';
import { fi } from 'zod/v4/locales';

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

    async createWarehouseReceivingBooking(warehouseReceivingBookingPayload: any, tx?: any) {
    const prismaClient: PrismaClient = tx || this.prisma;
    const newWarehouseReceivingBooking = await prismaClient.shipmentBooking.create({
      data: warehouseReceivingBookingPayload,
    });
    return newWarehouseReceivingBooking;
    // make tx than use tx

  }

  async getSpaceById(id: string) {
    const space = await prisma.space.findUnique({
      where: { id: id },
    });
    return space;
  }
  async createSupplierInformation(supplierData: any, tx?: any) {
    const prismaClient: PrismaClient = tx || this.prisma;
    const newBooking = await prismaClient.suppliers.create({
      data: supplierData,
    });
    return newBooking;
    // make tx than use tx

  }

  async getAllBookingByFilterWithPagination(payload: any) {
    const { bookingStatus, userRef } = payload;
    const filter: any = {};
    if (bookingStatus == "CUSTOMER_ALL") {
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
            localDeliveryInfo: true,
            rateRef: {
              include: {
                category1688: true,
                shippingMethod: true,
              },
            },
            expressRateRef: {
              include: {
                weightCategory: true,
                shippingMethod: true,
              },
            },
            freightRateRef: {
              include: {
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
    if (bookingStatus == "PENDING_REJECTED_AT_WAREHOUSE_APPROVE") {
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
            shippingMethodRef: true,
            localDeliveryInfo: true,
            categoryRef: true,
            customerRef: {
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

  async getAllBookingForWarehouseByFilterWithPagination(payload: any) {
    console.log("Get Warehouse Bookings with Payload:", payload);
    const filter: any = {};
    // if (bookingStatus == "PENDING_REJECTED_AT_WAREHOUSE_APPROVE"){
    //   filter.warehouseReceivingStatus = { in: ["PENDING", "REJECTED_AT_WAREHOUSE", "APPROVE"] };
    // } else {
    //   filter.warehouseReceivingStatus = bookingStatus.toUpperCase();
    // }
    // mode Air or Sea or Express
    if (payload.mode) {
      const mode = payload.mode.toUpperCase();
      if (mode === 'AIR') {
        filter.warehouseReceivingStatus = { in: ["STORED"] }; 
        filter.shippingMethodRef = {
          name: { in: ['AIR D2D', 'AIR FREIGHT'], mode: 'insensitive' },
        };
      } else if (mode === 'SEA') {
        filter.warehouseReceivingStatus = { in: ["STORED"] }; 
        filter.shippingMethodRef = {
          name: { in: ['SEA D2D', 'SEA FREIGHT'], mode: 'insensitive' },
        };
      } else if (mode === 'EXPRESS') {
        filter.warehouseReceivingStatus = { in: ["STORED"] }; 
        filter.shippingMethodRef = {
          name: { equals: 'EXPRESS', mode: 'insensitive' },
        };
      } else if (mode === 'INVENTORY') {
        // Strictly match inventory shipping method to avoid returning non-inventory bookings
        filter.warehouseReceivingStatus = { in: ["STORED"] }; 
        filter.shippingMethodRef = {
          name: { equals: 'INVENTORY', mode: 'insensitive' },
        };
      } else if (mode === 'WAREHOUSE') {
        filter.warehouseReceivingStatus = { in: ["RECEIVED_AT_WAREHOUSE"] }; 
      }
    }
    console.log("Warehouse Booking Filter:", payload.mode, filter);
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
            localDeliveryInfo: true,
            shipmentCartons: true,
            customerRef: {
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
            expressRateRef: {
              include: {
                weightCategory: true,
                shippingMethod: true,
              },
            },
            freightRateRef: {
              include: {
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

  async findBookingForWarehouseByTrackingNumberAndOrderNumber(query: string) {

    const Booking = await prisma.shipmentBooking.findFirst({
      where: {
        OR: [
          { trackingNumber: { contains: query, mode: 'insensitive' } },
          { orderNumber: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        supplierRef: true,
        packageRef: true,
        shippingMethodRef: true,
        customerRef: {
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
        expressRateRef: {
          include: {
            weightCategory: true,
            shippingMethod: true,
          },
        },
        freightRateRef: {
          include: {
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

    });
    return Booking;
  }

  async getAllLocalDeliveryInformation(payload: any) {
    const { search } = payload;
    const filter: any = {};
    if (search) {
      filter.OR = [
        { deliveryCompany: { contains: search, mode: 'insensitive' } },
        { contactPerson: { contains: search, mode: 'insensitive' } },
        { deliveryPhone: { contains: search, mode: 'insensitive' } },
        { deliveryEmail: { contains: search, mode: 'insensitive' } },
      ];
    }
    const localDeliveries = await this.prisma.localDeliveryInfo.findMany({
      where: filter,
      orderBy: {
        id: 'desc',
      },
    });
    return localDeliveries;
  }


  async createCarton(cartonData: any, tx?: any) {
    const prismaClient: PrismaClient = tx || this.prisma;
    const newCarton = await prismaClient.shipmentCarton.create({
      data: cartonData,
    });
    return newCarton;
  }

  async createLocalDeliveryInformation(localDeliveryData: any, tx?: any) {
    const prismaClient: PrismaClient = tx || this.prisma;
    const newLocalDeliveryInfo = await prismaClient.localDeliveryInfo.create({
      data: localDeliveryData,
    });
    return newLocalDeliveryInfo;
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
    console.log("Update Booking Payload:", id, payload);
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
