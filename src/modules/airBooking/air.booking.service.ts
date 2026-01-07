import { NotFoundError } from "../../utils/errors";
import { BaseService } from "../base/base.service";
import airBookingRepository from "./air.booking.repository";
// import { removeUploadFile } from '../../middleware/upload/removeUploadFile';

import ImgUploader from "../../middleware/upload/ImgUploder";

export class AirBookingService extends BaseService<typeof airBookingRepository> {
  private repository: typeof airBookingRepository;
  constructor(repository: typeof airBookingRepository, serviceName: string) {
    super(repository);
    this.repository = repository;
  }

  async createAirBooking(payload: any, payloadFiles: any, session?: any) {
    const { files } = payloadFiles;
    if (!files) throw new Error("image is required");
    const images = await ImgUploader(files);
    for (const key in images) {
      payload[key] = images[key];
    }
    const airBookingData = await this.repository.createAirBooking(payload);
    return airBookingData;
  }

  async getAllAirBooking(payload: any) {
    const { airBookingType } = payload;
    const filter: any = {};
    if (airBookingType) filter.airBookingType = airBookingType;
    return await this.repository.getAllAirBooking(filter);
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
