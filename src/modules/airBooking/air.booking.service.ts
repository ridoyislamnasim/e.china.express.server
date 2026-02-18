import { NotFoundError } from "../../utils/errors";
import { BaseService } from "../base/base.service";
import airBookingRepository from "./air.booking.repository";
// import { removeUploadFile } from '../../middleware/upload/removeUploadFile';

import ImgUploader from "../../middleware/upload/ImgUploder";
import { bookingIdGenerate } from "../../utils/bookingIdGenerator";
import { Prisma, PrismaClient } from "@prisma/client";
import rateRepository from "../rate/rate.repository";

export class AirBookingService extends BaseService<typeof airBookingRepository> {
  private repository: typeof airBookingRepository;
  constructor(repository: typeof airBookingRepository, serviceName: string) {
    super(repository);
    this.repository = repository;
  }

  async createAirBooking(payload: any, payloadFiles: any, tx?: any) {
    const { files } = payloadFiles;
    if (files?.length) {
      const images = await ImgUploader(files);
      for (const key in images) {
        payload[key] = images[key];
      }
    }

    // find shipping rate to get price
    // find country combination
    console.log("Payload received in AirBooking Service:", payload);
    const countryCombination = await rateRepository.existingCountryConbination({
      importCountryId: Number(payload.importCountryId),
      exportCountryId: Number(payload.exportCountryId),
    });
    // findWeightCategoryByWeight
    const weightCategory = await rateRepository.findWeightCategoryByWeight(Number(payload.weight));
    console.log("Country Combination found in AirBooking Service:", countryCombination);
    const rate = await rateRepository.findRateByCriteria({
      countryCombinationId: countryCombination?.id,
      weightCategoryId: weightCategory?.id,
      shippingMethodId: Number(payload.shippingMethodId),
      category1688Id: Number(payload.category1688Id)
    });
    console.log("Rate found in AirBooking Service:", rate);

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

    const airBookingPayload = {
      rateRef: { connect: { id: Number(payload.rateId) } },
      shippingMethodRef: { connect: { id: Number(payload.shippingMethodId) } },
      weight: payload.weight ? new Prisma.Decimal(payload.weight) : undefined,
      orderNumber,
      warehouseReceivingStatus: "PENDING",
      mainStatus: "PENDING",
      customerRef: payload.userRef ? { connect: { id: Number(payload.userRef) } } : undefined,
      // 🔥 REQUIRED RELATIONS
      importCountryRef: { connect: { id: Number(payload.importCountryId) }, },
      exportCountryRef: { connect: { id: Number(payload.exportCountryId) }, },
      importWarehouseRef: { connect: { id: String(payload.warehouseImportId) } },
      exportWarehouseRef: { connect: { id: String(payload.warehouseExportId) }, },
      bookingNo: Math.floor(Date.now() / 1000),
      bookingDate: new Date(),
      arrivalDate: payload.arrivalDate ? new Date(payload.arrivalDate) : null,
      totalWeightkg: payload.weight ? new Prisma.Decimal(payload.weight) : undefined,
      totalProductCost: payload.totalCost ? new Prisma.Decimal(payload.totalCost) : undefined,
      cartonQuantity: payload.cartonQuantity ? Number(payload.cartonQuantity) : undefined,
      productQuantity: payload.productQuantity ? Number(payload.productQuantity) : undefined,
      shippingPrice: price ? new Prisma.Decimal(price) : undefined,
      // totalProductCost: 
      // price: rate
    };
    console.log("AirBooking Payload in Service:", airBookingPayload);
    // return airBookingPayload;
    const airBookingData = await this.repository.createAirBooking(airBookingPayload, tx);
    return airBookingData;
  }

  async getAllAirBookingByFilterWithPagination(payload: any) {
    const airBookings = await this.repository.getAllAirBookingByFilterWithPagination(payload);
    return airBookings;
  }

  async getSingleAirBooking(id: string) {
    const numericId = Number(id);
    const airBookingData = await this.repository.getSingleAirBooking(numericId);
    if (!airBookingData) throw new NotFoundError("AirBooking Not Find");
    return airBookingData;
  }

  async updateAirBooking(id: string, payload: any, payloadFiles: any, session?: any) {
    const { files } = payloadFiles;
    if (files?.length) {
      const images = await ImgUploader(files);
      for (const key in images) {
        payload[key] = images[key];
      }
    }
    const airBookingData = await this.repository.updateAirBooking(Number(id), payload);
    if (!airBookingData) throw new NotFoundError("AirBooking Not Find");
    if (files?.length && airBookingData) {
      // await removeUploadFile(airBookingData?.image);
    }
    return airBookingData;
  }

  async deleteAirBooking(id: string) {
    const numericId = Number(id);
    const deletedAirBooking = await this.repository.deleteAirBooking(numericId);
    if (deletedAirBooking) {
      // await removeUploadFile(airBooking?.image);
    }
    return deletedAirBooking;
  }
}

export default new AirBookingService(airBookingRepository, "airBooking");
