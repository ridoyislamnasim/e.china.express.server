import { NotFoundError } from "../../utils/errors";
import { BaseService } from "../base/base.service";
import expressBookingRepository from "./express.booking.repository";
// import { removeUploadFile } from '../../middleware/upload/removeUploadFile';

import ImgUploader from "../../middleware/upload/ImgUploder";
import { bookingIdGenerate } from "../../utils/bookingIdGenerator";
import { Prisma, PrismaClient } from "@prisma/client";
import rateRepository from "../rate/rate.repository";
import  rateExpressRepository  from "../rateExpress/rate.express.repository";

export class ExpressBookingService extends BaseService<typeof expressBookingRepository> {
  private repository: typeof expressBookingRepository;
  private rateExpressRepository: typeof rateExpressRepository;
  private rateRepository = rateRepository;
  constructor(repository: typeof expressBookingRepository, serviceName: string) {
    super(repository);
    this.repository = repository;
    this.rateExpressRepository = rateExpressRepository;
    this.rateRepository = rateRepository;
  }

  async createExpressBooking(payload: any, payloadFiles: any, tx?: any) {
    const {exportCountryId, importCountryId, weight, shippingMethodId, variants} =payload
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

    //  const payload: any = {
    //   countryId:Number(countryId),
    //   weight: Number(weight),
    //   shippingMethodId: Number(shippingMethodId)
    // };

    // findWeightCategoryByWeight
    const weightCategory = await this.rateRepository.findWeightCategoryByWeight(Number(weight));
    const rate = await this.rateExpressRepository.findRateExpressByCriteria({
      countryId: Number(exportCountryId),
      weight: weightCategory?.id,
      shippingMethodId: Number(shippingMethodId)
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

    const expressBookingPayload = {
      expressRateRef: { connect: { id: Number(rate[0].id) } },
      shippingMethodRef: { connect: { id: Number(payload.shippingMethodId) } },

      weight: payload.weight ? new Prisma.Decimal(payload.weight) : undefined,
      orderNumber,
      warehouseReceivingStatus: "PENDING",
      mainStatus: "PENDING",
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
      shippingPrice: price ? new Prisma.Decimal(price) : undefined,
      // totalProductCost: 
      // price: rate
    };
    console.log("ExpressBooking Payload in Service:", expressBookingPayload);
    // return expressBookingPayload;
    const expressBookingData = await this.repository.createExpressBooking(expressBookingPayload, tx);

    // Handle variants if present. Frontend sends `variants` as JSON string in FormData
    const parsedVariants = typeof variants === 'string' ? (variants ? JSON.parse(variants) : []) : (variants || []);

    // Collect uploaded variant images. ImgUploader may attach files as keys like
    // 'variantImages[0]', 'variantImages[1]' or as an array `payload.variantImages`.
    const variantImagesArr: string[] = [];
    if (Array.isArray(payload.variantImages)) {
      variantImagesArr.push(...payload.variantImages);
    } else {
      let vi = 0;
      while (payload[`variantImages[${vi}]`]) {
        variantImagesArr.push(payload[`variantImages[${vi}]`]);
        vi++;
      }
    }

    if (parsedVariants && parsedVariants.length > 0) {
      for (let i = 0; i < parsedVariants.length; i++) {
        const variant = parsedVariants[i];
        // "color":"Black","colorHex":"#000000","colorName":"Black","quantity":7,"size":"",
        const { color, colorHex, colorName, size, quantity } = variant as any;
        const variantPayload = {
          shipmentBookingId: expressBookingData.id,
          color,
          colorHex,
          colorName,
          size,
          quantity: Number(quantity),
          skuImageUrl: variantImagesArr[i] ?? null,
        };
        await this.repository.createVariant(variantPayload, tx);
      }
    }

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
