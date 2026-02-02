import { NotFoundError } from "../../utils/errors";
import { BaseService } from "../base/base.service";
import BookingRepository from "./booking.repository";
// import { removeUploadFile } from '../../middleware/upload/removeUploadFile';

import ImgUploader from "../../middleware/upload/ImgUploder";
import { bookingIdGenerate } from "../../utils/bookingIdGenerator";
import { Prisma, PrismaClient } from "@prisma/client";
import rateRepository from "../rate/rate.repository";
import prisma from "../../config/prismadatabase";
import { idGenerate } from "../../utils/IdGenerator";
import packageRepository from "../package/package.repository";

export class BookingService extends BaseService<typeof BookingRepository> {
  private repository: typeof BookingRepository;
  private packageRepository: typeof packageRepository;
  constructor(repository: typeof BookingRepository, serviceName: string) {
    super(repository);
    this.repository = repository;
    this.packageRepository = packageRepository;
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
    const packageExists = await  this.packageRepository.getSinglePackage(String(packageId));
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
