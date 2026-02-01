import { NotFoundError } from "../../utils/errors";
import { BaseService } from "../base/base.service";
import BookingRepository from "./booking.repository";
// import { removeUploadFile } from '../../middleware/upload/removeUploadFile';

import ImgUploader from "../../middleware/upload/ImgUploder";
import { idGenerate } from "../../utils/IdGenerator";
import { Prisma, PrismaClient } from "@prisma/client";
import rateRepository from "../rate/rate.repository";

export class BookingService extends BaseService<typeof BookingRepository> {
  private repository: typeof BookingRepository;
  constructor(repository: typeof BookingRepository, serviceName: string) {
    super(repository);
    this.repository = repository;
  }

  async createBooking(payload: any, payloadFiles: any, tx?: any) {
    const { files } = payloadFiles;
    if (files?.length) {
      const images = await ImgUploader(files);
      for (const key in images) {
        payload[key] = images[key];
      }
    }

    // find shipping rate to get price
    // find country combination
    console.log("Payload received in Booking Service:", payload);
    const countryCombination = await rateRepository.existingCountryConbination({
      importCountryId: Number(payload.importCountryId),
      exportCountryId: Number(payload.exportCountryId),
    });
    // findWeightCategoryByWeight
    const weightCategory = await rateRepository.findWeightCategoryByWeight(Number(payload.weight));
    console.log("Country Combination found in Booking Service:", countryCombination);
    const rate = await rateRepository.findRateByCriteria({
      countryCombinationId: countryCombination?.id,
      weightCategoryId: weightCategory?.id,
      shippingMethodId: Number(payload.shippingMethodId),
      category1688Id: Number(payload.category1688Id)
    });
    console.log("Rate found in Booking Service:", rate);

    const price = Number(rate[0].price) * (payload.weight ? Number(payload.weight) : 0);


    // Generate sequential order number using latest shipmentBooking.orderNumber
    const prisma = new PrismaClient();
    const orderNumber = await idGenerate('ABK', 'orderNumber', (tx?.shipmentBooking ?? prisma.shipmentBooking));

    // shippingRateId: payload.shippingRateId,
    // bookerName: payload.bookerName,
    // bookerPhone: payload.bookerPhone,
    // bookerEmail: payload.bookerEmail,
    // bookerAddress: payload.bookerAddress,
    // shippingMethodId: payload.shippingMethodId,
    // category1688Id: payload.category1688Id,
    // categoryId: payload.categoryId,
    // subCategoryId: payload.subCategoryId,

    const BookingPayload = {
      rateRef: { connect: { id: Number(payload.rateId) } },
      weight: payload.weight ? new Prisma.Decimal(payload.weight) : undefined,
      orderNumber,
      warehouseReceivingStatus: "PENDING",
      customerRef: payload.userRef? { connect: { id: Number(payload.userRef) } }: undefined,
      // 🔥 REQUIRED RELATIONS
      importCountryRef: {connect: { id: Number(payload.importCountryId) },},
      exportCountryRef: {connect: { id: Number(payload.exportCountryId) },},
      importWarehouseRef: {connect: { id: String(payload.warehouseImportId) }},
      exportWarehouseRef: { connect: { id: String(payload.warehouseExportId) }, },
      bookingNo: Math.floor(Date.now() / 1000),   
      bookingDate: new Date(),
      arrivalDate: payload.arrivalDate ? new Date(payload.arrivalDate) : null,
      totalWeightkg: payload.weight ? new Prisma.Decimal(payload.weight) : undefined,
      totalProductCost: payload.totalCost ? new Prisma.Decimal(payload.totalCost) : undefined,
      cartonQuantity: payload.cartonQuantity ? Number(payload.cartonQuantity) : undefined,
      productQuantity: payload.productQuantity ? Number(payload.productQuantity) : undefined,
      price: price ? new Prisma.Decimal(price) : undefined,
      // totalProductCost: 
      // price: rate
    };
    console.log("Booking Payload in Service:", BookingPayload);
    // return BookingPayload;
    const BookingData = await this.repository.createBooking(BookingPayload, tx);
    return BookingData;
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
