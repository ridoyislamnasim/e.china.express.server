"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerService = void 0;
const errors_1 = require("../../utils/errors");
const base_service_1 = require("../base/base.service");
const banner_repository_1 = __importDefault(require("./banner.repository"));
// import { removeUploadFile } from '../../middleware/upload/removeUploadFile';
const ImgUploder_1 = __importDefault(require("../../middleware/upload/ImgUploder"));
class BannerService extends base_service_1.BaseService {
    constructor(repository, serviceName) {
        super(repository);
        this.repository = repository;
    }
    async createBanner(payload, payloadFiles, session) {
        const { files } = payloadFiles;
        if (!files)
            throw new Error('image is required');
        const images = await (0, ImgUploder_1.default)(files);
        for (const key in images) {
            payload[key] = images[key];
        }
        const bannerData = await this.repository.createBanner(payload);
        return bannerData;
    }
    async getAllBanner(payload) {
        const { bannerType } = payload;
        const filter = {};
        if (bannerType)
            filter.bannerType = bannerType;
        return await this.repository.getAllBanner(filter);
    }
    async getBannerWithPagination(payload) {
        const banner = await this.repository.getBannerWithPagination(payload);
        return banner;
    }
    async getSingleBanner(id) {
        const numericId = Number(id);
        const bannerData = await this.repository.getSingleBanner(numericId);
        if (!bannerData)
            throw new errors_1.NotFoundError('Banner Not Find');
        return bannerData;
    }
    async updateBanner(id, payload, payloadFiles, session) {
        const { files } = payloadFiles;
        if (files === null || files === void 0 ? void 0 : files.length) {
            const images = await (0, ImgUploder_1.default)(files);
            for (const key in images) {
                payload[key] = images[key];
            }
        }
        const bannerData = await this.repository.updateBanner(Number(id), payload);
        if (!bannerData)
            throw new errors_1.NotFoundError('Banner Not Find');
        if ((files === null || files === void 0 ? void 0 : files.length) && bannerData) {
            // await removeUploadFile(bannerData?.image);
        }
        return bannerData;
    }
    async deleteBanner(id) {
        const numericId = Number(id);
        const deletedBanner = await this.repository.deleteBanner(numericId);
        if (deletedBanner) {
            // await removeUploadFile(banner?.image);
        }
        return deletedBanner;
    }
}
exports.BannerService = BannerService;
exports.default = new BannerService(banner_repository_1.default, 'banner');
