"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchError_1 = __importDefault(require("../../middleware/errors/catchError"));
const responseHandler_1 = require("../../utils/responseHandler");
const withTransaction_1 = __importDefault(require("../../middleware/transactions/withTransaction"));
const banner_service_1 = __importDefault(require("./banner.service"));
class BannerController {
    constructor() {
        this.createBanner = (0, withTransaction_1.default)(async (req, res, next, session) => {
            var _a, _b;
            const payloadFiles = {
                files: req.files,
            };
            const payload = {
                bannerType: (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.bannerType,
                link: (_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.link,
            };
            const bannerResult = await banner_service_1.default.createBanner(payload, payloadFiles, session);
            const resDoc = (0, responseHandler_1.responseHandler)(201, 'Banner Created successfully', bannerResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getAllBanner = (0, catchError_1.default)(async (req, res, next) => {
            let payload = {
                bannerType: req.query.bannerType,
            };
            const bannerResult = await banner_service_1.default.getAllBanner(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Get All Banners', bannerResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getBannerWithPagination = (0, catchError_1.default)(async (req, res, next) => {
            let payload = {
                page: Number(req.query.page),
                limit: Number(req.query.limit),
                order: req.query.order,
            };
            const banner = await banner_service_1.default.getBannerWithPagination(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Banners get successfully', { ...banner });
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getSingleBanner = (0, catchError_1.default)(async (req, res, next) => {
            const id = req.params.id;
            const bannerResult = await banner_service_1.default.getSingleBanner(id);
            const resDoc = (0, responseHandler_1.responseHandler)(201, 'Single Banner successfully', bannerResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.updateBanner = (0, catchError_1.default)(async (req, res, next) => {
            var _a, _b;
            const id = req.params.id;
            const payloadFiles = {
                files: req.files,
            };
            const payload = {
                bannerType: (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.bannerType,
                link: (_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.link,
            };
            const bannerResult = await banner_service_1.default.updateBanner(id, payload, payloadFiles);
            const resDoc = (0, responseHandler_1.responseHandler)(201, 'Banner Update successfully');
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.deleteBanner = (0, catchError_1.default)(async (req, res, next) => {
            const id = req.params.id;
            const bannerResult = await banner_service_1.default.deleteBanner(id);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Banner Deleted successfully');
            res.status(resDoc.statusCode).json(resDoc);
        });
    }
}
exports.default = new BannerController();
