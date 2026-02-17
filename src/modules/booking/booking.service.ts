import { NotFoundError } from "../../utils/errors";
import { BaseService } from "../base/base.service";
import BookingRepository from "./booking.repository";
// import { removeUploadFile } from '../../middleware/upload/removeUploadFile';

import ImgUploader from "../../middleware/upload/ImgUploder";
import { bookingIdGenerate } from "../../utils/bookingIdGenerator";
import { MainStatus, Prisma, PrismaClient } from "@prisma/client";
import rateRepository from "../rate/rate.repository";
import prisma from "../../config/prismadatabase";
import { idGenerate } from "../../utils/IdGenerator";
import packageRepository from "../package/package.repository";
import authRepository from "../auth/auth.repository";

export class BookingService extends BaseService<typeof BookingRepository> {
  private repository: typeof BookingRepository;
  private packageRepository: typeof packageRepository;
  private authRepository = authRepository;
  constructor(repository: typeof BookingRepository, serviceName: string) {
    super(repository);
    this.repository = repository;
    this.packageRepository = packageRepository;
    this.authRepository = authRepository;
  }

  async createSupplierInformation(payload: any, tx?: any) {
    const { supplierId, bookingId, supplierNo, contact_person, supplierEmail, supplierPhone, supplierAddress } = payload;
    console.log("Create Supplier Information Payload:", payload);
    //  check bookingId Exits
    const bookingExists = await prisma.shipmentBooking.findUnique({
      where: { id: Number(bookingId) },
    });
    console.log("Booking Exists Check:", bookingExists);
    if (!bookingExists) {
      throw new NotFoundError("Booking ID does not exist");
    }


    const prismaClient: any = tx || prisma;

    // Prepare supplier data
    const supplierData = {
      supplierNo: supplierNo || undefined,
      contact_person: contact_person || undefined,
      supplierEmail: supplierEmail || undefined,
      supplierPhone: supplierPhone || undefined,
      supplierAddress: supplierAddress || undefined,
    };

    // Idempotent upsert behavior:
    // 1) If supplierId provided, validate and use
    // 2) Else try to find by supplierNo (unique) or by email/phone
    // 3) If found -> update, else create. Handle race with unique constraint fallback.

    let supplierRecord: any = null;

    if (supplierId) {
      supplierRecord = await prismaClient.suppliers.findUnique({ where: { id: Number(supplierId) } });
      if (!supplierRecord) throw new NotFoundError("Supplier ID does not exist");
      // Optionally update existing supplier with provided fields
      supplierRecord = await prismaClient.suppliers.update({ where: { id: supplierRecord.id }, data: supplierData });
    } else {
      // Try supplierNo first (preferred, unique)
      if (supplierData.supplierNo) {
        supplierRecord = await prismaClient.suppliers.findUnique({ where: { supplierNo: supplierData.supplierNo } });
      }

      // If not found by supplierNo, try email or phone
      if (!supplierRecord && (supplierData.supplierEmail || supplierData.supplierPhone)) {
        supplierRecord = await prismaClient.suppliers.findFirst({ where: { OR: [{ supplierEmail: supplierData.supplierEmail }, { supplierPhone: supplierData.supplierPhone }] } });
      }

      if (supplierRecord) {
        // update existing
        supplierRecord = await prismaClient.suppliers.update({ where: { id: supplierRecord.id }, data: supplierData });
      } else {
        // create new - guard against race by catching unique constraint error
        try {
          supplierRecord = await prismaClient.suppliers.create({ data: supplierData });
        } catch (err: any) {
          // P2002 = unique constraint failed
          if (err?.code === 'P2002') {
            // Another transaction created the supplier concurrently - fetch it
            supplierRecord = await prismaClient.suppliers.findFirst({ where: { OR: [{ supplierNo: supplierData.supplierNo }, { supplierEmail: supplierData.supplierEmail }, { supplierPhone: supplierData.supplierPhone }] } });
            if (!supplierRecord) throw err; // unexpected
            // update with any provided fields
            supplierRecord = await prismaClient.suppliers.update({ where: { id: supplierRecord.id }, data: supplierData });
          } else {
            throw err;
          }
        }
      }
    }

    // Ensure we have supplier id
    if (!supplierRecord || !supplierRecord.id) throw new Error("Failed to resolve supplier record");

    // Attach supplier to booking using the same tx client so it's atomic
    const BookingData = await this.repository.updateBooking(Number(bookingId), { supplierRef: { connect: { id: Number(supplierRecord.id) } } }, tx);

    return BookingData;
  }

  async createBookingPackage(payload: any, tx?: any) {
    const { bookingId, packageId, quantity } = payload;
    console.log("Create Booking Package Payload:", payload);
    //  check bookingId Exits
    const bookingExists = await this.repository.getSingleBooking(Number(bookingId));
    console.log("Booking Exists Check:", bookingExists);
    if (!bookingExists) {
      throw new NotFoundError("Booking ID does not exist");
    }
    // check packaging Id Exits
    const packageExists = await this.packageRepository.getSinglePackage(String(packageId));
    console.log("Package Exists Check:", String(packageId), packageExists);
    if (!packageExists) {
      throw new NotFoundError("Package ID does not exist");
    }
    const updateData: any = {
      packageRef: { connect: { id: String(packageId) } },
      packagingCharge: Number(packageExists.price) * (quantity ? Number(quantity) : 1),
      packageQuantity: quantity ? Number(quantity) : 1,
    };
    // update Booking with package relation
    const BookingData = await this.repository.updateBooking(Number(bookingId), updateData, tx);
    return BookingData;
  }

  async getAllSupplierInformation(payload: any) {
    const suppliers = await this.repository.getAllSupplierInformation(payload);
    return suppliers;
  }

  async getAllBookingByFilterWithPagination(payload: any) {
    const Bookings = await this.repository.getAllBookingByFilterWithPagination(payload);
    return Bookings;
  }

  async updateBookingTrackingNumberByCustomer(payload: any, tx?: any) {
    const { customerId, bookingId, trackingNumber } = payload;
    // bookingid and trackingnumber required
    if (!bookingId || !trackingNumber) {
      throw new Error("bookingId and trackingNumber are required");
    }
    console.log("Update Booking Tracking Number by Customer Payload:", payload);
    const condition = {
      id: Number(bookingId),
      customerId: customerId ? Number(customerId) : undefined,
    }
    const updateData: any = {
      trackingNumber: trackingNumber || undefined,
      // customerRef: userRef ? { connect: { id: Number(userRef) } } : undefined,
    };
    const BookingData = await this.repository.findByConditionAndUpdate(condition, updateData, tx);
    if (!BookingData) throw new NotFoundError("Booking Not Find");
    return BookingData;
  }

  async updateBookingInvoiceByCustomer(payload: any, payloadFiles: any, tx?: any) {
    const { customerId, bookingId } = payload;
    console.log("Update Booking Invoice by Customer Payload before file processing:", payload);

    const { files } = payloadFiles || {};
    if (files?.length) {
      const images = await ImgUploader(files);
      // console.log('Images uploaded is images ater upload:', images);
      for (const key in images) {
        payload[key] = images[key];
      }
    } else {
      return;
    }
    // bookingid and invoice required
    if (!bookingId) {
      throw new Error("bookingId and invoice are required");
    }
    console.log("Update Booking Invoice by Customer Payload:", payload);
    const condition = {
      id: Number(bookingId)
    }
    const updateData: any = {
      invoicePhotos: payload.invoicePhotos || undefined,
      // customerRef: userRef ? { connect: { id: Number(userRef) } } : undefined,
    };
    const BookingData = await this.repository.findByConditionAndUpdate(condition, updateData, tx);
    if (!BookingData) throw new NotFoundError("Booking Not Find");
    return BookingData;
  }

  async updateBookingProductByCustomer(payload: any, payloadFiles: any, tx?: any) {
    const { customerId, bookingId } = payload;
    console.log("Update Booking Product by Customer Payload before file processing:", payload);
    const { files } = payloadFiles || {};
    if (files?.length) {
      const images = await ImgUploader(files);
      // console.log('Images uploaded is images ater upload:', images);
      for (const key in images) {
        payload[key] = images[key];
      }
    } else {
      return;
    }
    // bookingid and product required
    if (!bookingId) {
      throw new Error("bookingId and product are required");
    }
    console.log("Update Booking Product by Customer Payload:", payload);
    const condition = {
      id: Number(bookingId)
    }
    const updateData: any = {
      productPhotos: payload.productPhotos || undefined,
      // customerRef: userRef ? { connect: { id: Number(userRef) } } : undefined,
    };
    const BookingData = await this.repository.findByConditionAndUpdate(condition, updateData, tx);
    if (!BookingData) throw new NotFoundError("Booking Not Find");
    return BookingData;
  }


  async findBookingForWarehouseByTrackingNumberAndOrderNumber(payload: any) {
    const { query } = payload;
    if (!query) {
      throw new Error("query is required");
    }
    const BookingData = await this.repository.findBookingForWarehouseByTrackingNumberAndOrderNumber(query);
    if (!BookingData) throw new NotFoundError("Booking Not Find");
    return BookingData;
  }

  async updateBookingPackingListByCustomer(payload: any, payloadFiles: any, tx?: any) {
    const { customerId, bookingId } = payload;
    const { files } = payloadFiles || {};
    if (files?.length) {
      const images = await ImgUploader(files);
      // console.log('Images uploaded is images ater upload:', images);
      for (const key in images) {
        payload[key] = images[key];
      }
    }
    // bookingid and packingList required
    if (!bookingId) {
      throw new Error("bookingId is required");
    }
    console.log("Update Booking Packing List by Customer Payload:", payload);
    const condition = {
      id: Number(bookingId),
    }
    const updateData: any = {
      packingListPhotos: payload.packingListPhotos || undefined,
      // customerRef: userRef ? { connect: { id: Number(userRef) } } : undefined,
    };
    const BookingData = await this.repository.findByConditionAndUpdate(condition, updateData, tx);
    if (!BookingData) throw new NotFoundError("Booking Not Find");
    return BookingData;
  }

  async getAllBookingForWarehouseByFilterWithPagination(payload: any) {
    const Bookings = await this.repository.getAllBookingForWarehouseByFilterWithPagination(payload);
    return Bookings;
  }

  async getAllBookingForAdminByFilterWithPagination(payload: any) {
    // check userRef roleId if customer then return with error msg
    const userRef = payload.userRef;
    const user = await this.authRepository.getUserRoleById(Number(userRef));
    console.log("Admin Booking List Access Check User:", user);
    // Assuming roleId 3 is 'customer', adjust as needed
    if (user?.role.toLowerCase() === 'customer') {
      throw new Error('Customers are not allowed to access this booking list.');
    }
    const Bookings = await this.repository.getAllBookingForAdminByFilterWithPagination(payload);
    return Bookings;
  }

  async updateBookingApprovedRejectByAdmin(id: string, payload: any, session?: any) {
    console.log("Update Booking Status by Admin Payload:", id, payload);
    const { status } = payload;
    if (!status || (status.toUpperCase() !== 'APPROVE' && status.toUpperCase() !== 'REJECTED_AT_WAREHOUSE')) {
      throw new Error('Status must be either "APPROVE" or "REJECT".');
    }
    const updateData: any = {
      mainStatus: status.toUpperCase(),
      warehouseReceivingStatus: status.toUpperCase(),
      // adminRemarks: payload.adminRemarks || undefined,
      // adminRef: payload.adminId ? { connect: { id: Number(payload.adminId) } } : undefined,
    };
    const BookingData = await this.repository.updateBooking(Number(id), updateData, session);
    if (!BookingData) throw new NotFoundError("Booking Not Find");
    return BookingData;
  }

  async createInventoryStoredByWarehouse(payload: any, payloadFiles: any, tx?: any) {
    const { warehouseId, bookingId, cartons } = payload;
    console.log("Create Inventory Stored by Warehouse Payload before file processing:", payload);
    const { files } = payloadFiles || {};
    if (files?.length) {
      const images = await ImgUploader(files);
      // console.log('Images uploaded is images ater upload:', images);
      for (const key in images) {
        payload[key] = images[key];
      }
    }
    // bookingid required
    if (!bookingId) {
      throw new Error("bookingId is required");
    }
    const condition = {
      id: Number(bookingId),
    }
    const updateData: any = {
      mainStatus: "STORED",
      warehouseReceivingStatus: 'STORED',
      // warehouseRef: warehouseId ? { connect: { id: Number(warehouseId) } } : undefined,
    };
    const BookingData = await this.repository.findByConditionAndUpdate(condition, updateData, tx);
    console.log("Booking Update for Inventory Stored Result:", BookingData);
    if (!BookingData) throw new NotFoundError("Booking Not Find");
    // cartons create 
    for (const [index, carton] of cartons.entries()) {
      const cbm = (carton.length * carton.height * carton.width) / 1000000;
      const cartonData = {
        cartonNumber: index + 1,
        heightCm: carton.height,
        lengthCm: carton.length,
        widthCm: carton.width,
        cbm: cbm,
        shipmentBookingId: Number(bookingId),
      }
      await this.repository.createCarton(cartonData, tx);
    }
    return BookingData;
  }

  async createInventoryReceiptByWarehouse(payload: any, payloadFiles: any, tx?: any) {
    const { warehouseId, bookingId, cartons } = payload;
    console.log("Create Inventory Receipt by Warehouse Payload before file processing:", payload);
    const { files } = payloadFiles || {};
    if (files?.length) {
      const images = await ImgUploader(files);
      // console.log('Images uploaded is images ater upload:', images);
      for (const key in images) {
        payload[key] = images[key];
      }
    }
    // Use configured prisma client (avoid instantiating a new PrismaClient)
    const shippingMethodName = payload.shippingMethodName ?? undefined;

    const orderNumber = await bookingIdGenerate({
      model: (tx?.shipmentBooking ?? prisma.shipmentBooking),
      shippingMethodId: payload.shippingMethodId ? Number(payload.shippingMethodId) : undefined,
      shippingMethodName: shippingMethodName,
      prefix: 'WHB' // Force warehouse booking prefix for inventory receipt entries without shipping method
    });
    console.log("Generated Order Number for Inventory Receipt:", orderNumber);

    const warehouseReceivingBookingPayload: any = {
      orderNumber,
      mainStatus: "RECEIVED_AT_WAREHOUSE",
      warehouseReceivingStatus: 'RECEIVED_AT_WAREHOUSE',
      warehouseReceivingNote: payload.warehouseReceivingNote || undefined,
      weight: payload.totalWeightkg ? new Prisma.Decimal(payload.totalWeightkg) : undefined,
      totalWeightkg: payload.totalWeightkg ? new Prisma.Decimal(payload.totalWeightkg) : undefined,
      cartonQuantity: payload.cartonQuantity ? Number(payload.cartonQuantity) : undefined,
      productQuantity: payload.productQuantity ? Number(payload.productQuantity) : undefined,
      bookingNo: Math.floor(Date.now() / 1000),
      bookingDate: new Date(),
      shippingPrice: payload.shippingRate ? new Prisma.Decimal(payload.shippingRate) : undefined,
      packagingCharge: payload.packagingCharge ? new Prisma.Decimal(payload.packagingCharge) : undefined,
      
      // warehouseRef: warehouseId ? { connect: { id: Number(warehouseId) } } : undefined,
    };
    console.log("Warehouse Receiving Booking Payload for Update:", warehouseReceivingBookingPayload);
    const BookingData = await this.repository.createWarehouseReceivingBooking(warehouseReceivingBookingPayload, tx);
    console.log("Booking Update for Inventory Receipt Result:", BookingData);
    if (!BookingData) throw new NotFoundError("Booking Not Find");
    // cartons create
    for (const [index, carton] of cartons.entries()) {
      const cbm = (carton.length * carton.height * carton.width) / 1000000;
      const cartonData = {
        cartonNumber: index + 1,
        heightCm: carton.height,
        lengthCm: carton.length,
        widthCm: carton.width,
        cbm: cbm,
        shipmentBookingId: Number(BookingData.id),
      }
      await this.repository.createCarton(cartonData, tx);
    }
    return BookingData;
  }




  async getSingleBooking(id: string) {
    const numericId = Number(id);
    const BookingData = await this.repository.getSingleBooking(numericId);
    if (!BookingData) throw new NotFoundError("Booking Not Find");
    return BookingData;
  }

  async updateBooking(id: string, payload: any, payloadFiles: any, session?: any) {
    const { files } = payloadFiles;
    if (files?.length) {
      const images = await ImgUploader(files);
      for (const key in images) {
        payload[key] = images[key];
      }
    }
    const BookingData = await this.repository.updateBooking(Number(id), payload);
    if (!BookingData) throw new NotFoundError("Booking Not Find");
    if (files?.length && BookingData) {
      // await removeUploadFile(BookingData?.image);
    }
    return BookingData;
  }

  async deleteBooking(id: string) {
    const numericId = Number(id);
    const deletedBooking = await this.repository.deleteBooking(numericId);
    if (deletedBooking) {
      // await removeUploadFile(Booking?.image);
    }
    return deletedBooking;
  }
}

export default new BookingService(BookingRepository, "Booking");
