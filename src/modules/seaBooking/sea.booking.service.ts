import { NotFoundError } from "../../utils/errors";
import { BaseService } from "../base/base.service";
import seaBookingRepository from "./sea.booking.repository";
// import { removeUploadFile } from '../../middleware/upload/removeUploadFile';

import ImgUploader from "../../middleware/upload/ImgUploder";
import { idGenerate } from "../../utils/IdGenerator";
import { Prisma, PrismaClient } from "@prisma/client";
import rateRepository from "../rate/rate.repository";

export class SeaBookingService extends BaseService<typeof seaBookingRepository> {
  private repository: typeof seaBookingRepository;
  constructor(repository: typeof seaBookingRepository, serviceName: string) {
    super(repository);
    this.repository = repository;
  }

  async createSeaBooking(payload: any, payloadFiles: any, tx?: any) {
    const { files } = payloadFiles;
    if (files?.length) {
      const images = await ImgUploader(files);
      for (const key in images) {
        payload[key] = images[key];
      }
    }

    // find shipping rate to get price
    // find country combination
    console.log("Payload received in SeaBooking Service:", payload);
    const countryCombination = await rateRepository.existingCountryConbination({
      importCountryId: Number(payload.importCountryId),
      exportCountryId: Number(payload.exportCountryId),
    });
    // findWeightCategoryByWeight
    const weightCategory = await rateRepository.findWeightCategoryByWeight(Number(payload.weight));
    console.log("Country Combination found in SeaBooking Service:", countryCombination);
    const rate = await rateRepository.findRateByCriteria({
      countryCombinationId: countryCombination?.id,
      weightCategoryId: weightCategory?.id,
      shippingMethodId: Number(payload.shippingMethodId),
      category1688Id: Number(payload.category1688Id)
    });
    console.log("Rate found in SeaBooking Service:", rate);

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

    const seaBookingPayload = {
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
      shippingDate: payload.shippingDate ? new Date(payload.shippingDate): undefined,
      arrivalDate: payload.arrivalDate ? new Date(payload.arrivalDate) : null,
      totalWeightkg: payload.weight ? new Prisma.Decimal(payload.weight) : undefined,
      totalProductCost: payload.totalCost ? new Prisma.Decimal(payload.totalCost) : undefined,
      cartonQuantity: payload.cartonQuantity ? Number(payload.cartonQuantity) : undefined,
      productQuantity: payload.productQuantity ? Number(payload.productQuantity) : undefined,
      price: price ? new Prisma.Decimal(price) : undefined,
      // totalProductCost: 
      // price: rate
    };
    console.log("SeaBooking Payload in Service:", seaBookingPayload);
    // return seaBookingPayload;
    const seaBookingData = await this.repository.createSeaBooking(seaBookingPayload, tx);
    return seaBookingData;
  }

  async getAllSeaBookingByFilterWithPagination(payload: any) {
    const seaBookings = await this.repository.getAllSeaBookingByFilterWithPagination(payload);
    return seaBookings;
  }

  async getSingleSeaBooking(id: string) {
    const numericId = Number(id);
    const seaBookingData = await this.repository.getSingleSeaBooking(numericId);
    if (!seaBookingData) throw new NotFoundError("SeaBooking Not Find");
    return seaBookingData;
  }

  async updateSeaBooking(id: string, payload: any, payloadFiles: any, session?: any) {
    const { files } = payloadFiles;
    if (files?.length) {
      const images = await ImgUploader(files);
      for (const key in images) {
        payload[key] = images[key];
      }
    }
    const seaBookingData = await this.repository.updateSeaBooking(Number(id), payload);
    if (!seaBookingData) throw new NotFoundError("SeaBooking Not Find");
    if (files?.length && seaBookingData) {
      // await removeUploadFile(seaBookingData?.image);
    }
    return seaBookingData;
  }

  async deleteSeaBooking(id: string) {
    const numericId = Number(id);
    const deletedSeaBooking = await this.repository.deleteSeaBooking(numericId);
    if (deletedSeaBooking) {
      // await removeUploadFile(seaBooking?.image);
    }
    return deletedSeaBooking;
  }
}

export default new SeaBookingService(seaBookingRepository, "seaBooking");
