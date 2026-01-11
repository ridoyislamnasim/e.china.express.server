import { NotFoundError } from "../../utils/errors";
import { BaseService } from "../base/base.service";
import airBookingRepository from "./air.booking.repository";
// import { removeUploadFile } from '../../middleware/upload/removeUploadFile';

import ImgUploader from "../../middleware/upload/ImgUploder";
import { idGenerate } from "../../utils/IdGenerator";
import { Prisma, PrismaClient } from "@prisma/client";

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

    // shippingbookingItems BookingProduct[]
    // shippingInfos ShippingInfo[]

    // Generate sequential order number using latest shipmentBooking.orderNumber
    const prisma = new PrismaClient();
    const orderNumber = await idGenerate('EBK', 'orderNumber', (tx?.shipmentBooking ?? prisma.shipmentBooking));

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
      weight: payload.weight ? new Prisma.Decimal(payload.weight) : undefined,
      shippingDate: payload.shippingDate ? new Date(payload.shippingDate): undefined,
      orderNumber,
      warehouseReceivingStatus: "PENDING",
      customerRef: payload.userRef? { connect: { id: Number(payload.userRef) } }: undefined,
      // 🔥 REQUIRED RELATIONS
      countryImportRef: {connect: { id: Number(payload.importCountryId) },},
      countryExportRef: {connect: { id: Number(payload.exportCountryId) },},
      warehouseRef: { connect: { id: String(payload.warehouseImportId) }, },
      warehouseExportRef: { connect: { id: String(payload.warehouseExportId) }, },
      bookingNo: Math.floor(Date.now() / 1000),
      bookingDate: new Date(),
      arrivalDate: payload.arrivalDate ? new Date(payload.arrivalDate) : null,
      originCountry: String(payload.exportCountryId),
      destinationCountry: String(payload.importCountryId),
      total_weight_kg: payload.weight ? new Prisma.Decimal(payload.weight) : undefined,
      cartonQuantity: payload.cartonQuantity ? Number(payload.cartonQuantity) : undefined,
      productQuantity: payload.productQuantity ? Number(payload.productQuantity) : undefined,
    };
    console.log("AirBooking Payload in Service:", airBookingPayload);
    const airBookingData = await this.repository.createAirBooking(airBookingPayload, tx);
    return airBookingData;
  }

  async getAllAirBookingByFilterWithPagination(payload: any) {
    const airBookings = await this.repository.getAllAirBookingByFilterWithPagination(payload);
    return airBookings;
  }

  async getAirBookingWithPagination(payload: any) {
    const airBooking = await this.repository.getAirBookingWithPagination(payload);
    return airBooking;
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
