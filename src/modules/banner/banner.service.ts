import { NotFoundError } from "../../utils/errors";
import { BaseService } from "../base/base.service";
import bannerRepository from "./banner.repository";
// import { removeUploadFile } from '../../middleware/upload/removeUploadFile';

import ImgUploader from "../../middleware/upload/ImgUploder";

export class BannerService extends BaseService<typeof bannerRepository> {
  private repository: typeof bannerRepository;
  constructor(repository: typeof bannerRepository, serviceName: string) {
    super(repository);
    this.repository = repository;
  }

  async createBanner(payload: any, payloadFiles: any, session?: any) {
    const { files } = payloadFiles;
    if (!files) throw new Error("image is required");
    const images = await ImgUploader(files);
    for (const key in images) {
      payload[key] = images[key];
    }
    const bannerData = await this.repository.createBanner(payload);
    return bannerData;
  }

  async getAllBanner(payload: any) {
    const { bannerType } = payload;
    const filter: any = {};
    if (bannerType) filter.bannerType = bannerType;
    return await this.repository.getAllBanner(filter);
  }

  async getBannerWithPagination(payload: any) {
    const banner = await this.repository.getBannerWithPagination(payload);
    return banner;
  }

  async getSingleBanner(id: string) {
    const numericId = Number(id);
    const bannerData = await this.repository.getSingleBanner(numericId);
    if (!bannerData) throw new NotFoundError("Banner Not Find");
    return bannerData;
  }

  async updateBanner(id: string, payload: any, payloadFiles: any, session?: any) {
    const { files } = payloadFiles;
    if (files?.length) {
      const images = await ImgUploader(files);
      for (const key in images) {
        payload[key] = images[key];
      }
    }
    const bannerData = await this.repository.updateBanner(Number(id), payload);
    if (!bannerData) throw new NotFoundError("Banner Not Find");
    if (files?.length && bannerData) {
      // await removeUploadFile(bannerData?.image);
    }
    return bannerData;
  }

  async deleteBanner(id: string) {
    const numericId = Number(id);
    const deletedBanner = await this.repository.deleteBanner(numericId);
    if (deletedBanner) {
      // await removeUploadFile(banner?.image);
    }
    return deletedBanner;
  }
}

export default new BannerService(bannerRepository, "banner");
