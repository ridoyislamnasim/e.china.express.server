import { NotFoundError } from "../../utils/errors";
import { BaseService } from "../base/base.service";
import expressBookingRepository from "./express.booking.repository";
// import { removeUploadFile } from '../../middleware/upload/removeUploadFile';

import ImgUploader from "../../middleware/upload/ImgUploder";
import { bookingIdGenerate } from "../../utils/bookingIdGenerator";
import { Prisma, PrismaClient } from "@prisma/client";
import rateRepository from "../rate/rate.repository";

export class ExpressBookingService extends BaseService<typeof expressBookingRepository> {
  private repository: typeof expressBookingRepository;
  constructor(repository: typeof expressBookingRepository, serviceName: string) {
    super(repository);
    this.repository = repository;
  }

  async createExpressBooking(payload: any, payloadFiles: any, tx?: any) {
    const { files } = payloadFiles;
    if (files?.length) {
      const images = await ImgUploader(files);
      for (const key in images) {
        payload[key] = images[key];
      }
    }

    // find shipping rate to get price
    // find country combination
    console.log("Payload received in ExpressBooking Service:", payload);
    const countryCombination = await rateRepository.existingCountryConbination({
      importCountryId: Number(payload.importCountryId),
      exportCountryId: Number(payload.exportCountryId),
    });
    // findWeightCategoryByWeight
    const weightCategory = await rateRepository.findWeightCategoryByWeight(Number(payload.weight));
    console.log("Country Combination found in ExpressBooking Service:", countryCombination);
    const rate = await rateRepository.findRateByCriteria({
      countryCombinationId: countryCombination?.id,
      weightCategoryId: weightCategory?.id,
      shippingMethodId: Number(payload.shippingMethodId),
      category1688Id: Number(payload.category1688Id)
    });
    console.log("Rate found in ExpressBooking Service:", rate);

    const price = Number(rate[0].price) * (payload.weight ? Number(payload.weight) : 0);


    // Generate method-wise daily booking order number
    const prisma = new PrismaClient();
    const shippingMethodName = rate?.[0]?.shippingMethod?.name;
    const orderNumber = await bookingIdGenerate({
      model: (tx?.shipmentBooking ?? prisma.shipmentBooking),
      shippingMethodId: Number(payload.shippingMethodId),
      shippingMethodName,
    });

    // shippingRateId: payload.shippingRateId,
    // bookerName: payload.bookerName,
    // bookerPhone: payload.bookerPhone,
    // bookerEmail: payload.bookerEmail,
    // bookerAddress: payload.bookerAddress,
    // shippingMethodId: payload.shippingMethodId,
    // category1688Id: payload.category1688Id,
    // categoryId: payload.categoryId,
    // subCategoryId: payload.subCategoryId,

    const expressBookingPayload = {
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
    console.log("ExpressBooking Payload in Service:", expressBookingPayload);
    // return expressBookingPayload;
    const expressBookingData = await this.repository.createExpressBooking(expressBookingPayload, tx);
    return expressBookingData;
  }

  async getAllExpressBookingByFilterWithPagination(payload: any) {
    const expressBookings = await this.repository.getAllExpressBookingByFilterWithPagination(payload);
    return expressBookings;
  }

  async getSingleExpressBooking(id: string) {
    const numericId = Number(id);
    const expressBookingData = await this.repository.getSingleExpressBooking(numericId);
    if (!expressBookingData) throw new NotFoundError("ExpressBooking Not Find");
    return expressBookingData;
  }

  async updateExpressBooking(id: string, payload: any, payloadFiles: any, session?: any) {
    const { files } = payloadFiles;
    if (files?.length) {
      const images = await ImgUploader(files);
      for (const key in images) {
        payload[key] = images[key];
      }
    }
    const expressBookingData = await this.repository.updateExpressBooking(Number(id), payload);
    if (!expressBookingData) throw new NotFoundError("ExpressBooking Not Find");
    if (files?.length && expressBookingData) {
      // await removeUploadFile(expressBookingData?.image);
    }
    return expressBookingData;
  }

  async deleteExpressBooking(id: string) {
    const numericId = Number(id);
    const deletedExpressBooking = await this.repository.deleteExpressBooking(numericId);
    if (deletedExpressBooking) {
      // await removeUploadFile(expressBooking?.image);
    }
    return deletedExpressBooking;
  }
}

export default new ExpressBookingService(expressBookingRepository, "expressBooking");
