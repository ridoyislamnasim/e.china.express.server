"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchError_1 = __importDefault(require("../../middleware/errors/catchError"));
const guide_service_1 = __importDefault(require("./guide.service"));
exports.default = new (class GuideController {
    constructor() {
        //done
        this.getAllGuideWithPagination = (0, catchError_1.default)(async (req, res) => {
            const { page, limit } = req.query;
            const query = { page, limit };
            const result = await guide_service_1.default.getAllGuideWithPagination(query);
            res.status(200).json({
                status: "success",
                message: "Guides retrieved successfully.",
                data: result,
            });
        });
        this.getAllGuides = (0, catchError_1.default)(async (req, res) => {
            const guides = await guide_service_1.default.getAllGuides();
            res.status(200).json({
                status: "success",
                message: "All guides retrieved successfully.",
                data: guides,
            });
        });
        this.deleteGuide = (0, catchError_1.default)(async (req, res) => {
            const { id } = req.params;
            const result = await guide_service_1.default.deleteGuideData(id);
            res.status(200).json({
                status: "success",
                message: result.message,
                data: result.data,
            });
        });
        this.getGuideVideosById = (0, catchError_1.default)(async (req, res) => {
            const { id } = req.params;
            const guides = await guide_service_1.default.getGuideVideosById(parseInt(id));
            res.status(200).json({
                status: "success",
                message: "All guides retrieved successfully.",
                data: guides,
            });
        });
        this.updateGuide = (0, catchError_1.default)(async (req, res) => {
            const id = req.params.id;
            const { serial, title } = req.body;
            const payload = { serial, title };
            const updatedGuide = await guide_service_1.default.updateGuideData(id, payload);
            res.status(200).json({
                status: "success",
                ...updatedGuide,
            });
        });
        this.deleteGuideVideo = (0, catchError_1.default)(async (req, res) => {
            const { id } = req.params;
            const result = await guide_service_1.default.deleteGuideVideo(id);
            const { message, data } = result;
            res.status(200).json({
                status: "success",
                message: message,
                data: data,
            });
        });
        this.createGuideVideo = (0, catchError_1.default)(async (req, res) => {
            const { guideId, title, url, shortDes, videoLength, videoSerial } = req.body;
            console.log("🚀 ~ guide.controller.ts:76 ~ req.files:", req.files);
            const payloadFiles = { files: req.files };
            // console.log("🚀 ~ guide.controller.ts:97 ~ file:", file);
            const payload = {
                guideId: Number(guideId),
                title,
                url,
                shortDes,
                videoLength,
                videoSerial: Number(videoSerial)
            };
            const result = await guide_service_1.default.createGuideVideo(payload, payloadFiles);
            res.status(201).json({
                status: "success",
                message: result.message,
                data: result.data,
            });
        });
        //todo
        //   async getPolicesWithPagination(payload: { limit: number; offset: number }, tx: any): Promise<any> {
        //   const { limit, offset } = payload;
        //   const prismaClient: PrismaClient = tx || this.prisma;
        //   return await pagination(payload, async (limit: number, offset: number, sortOrder: any) => {
        //     const [doc, totalDoc] = await Promise.all([
        //       this.prisma.policyType.findMany({
        //         where: {},
        //         skip: offset,
        //         take: limit,
        //       }),
        //       prisma.policyType.count({ where: {} }),
        //     ]);
        //     return { doc, totalDoc };
        //   });
        // }
        this.createGuide = (0, catchError_1.default)(async (req, res) => {
            const payload = req.body;
            const payloadFiles = { files: req.files };
            const newGuide = await guide_service_1.default.createGuideData(payload, payloadFiles);
            res.status(201).json({
                status: "success",
                message: "Guide created successfully.",
                data: newGuide,
            });
        });
        this.getGuideBySlug = (0, catchError_1.default)(async (req, res) => {
            const { id } = req.params;
            const guideData = await guide_service_1.default.getGuideById(id);
            res.status(200).json({
                status: "success",
                message: `Guide data for ID ${id} retrieved successfully.`,
                data: guideData,
            });
        });
        //todo update guide video
        this.updateGuideVideo = (0, catchError_1.default)(async (req, res) => {
            const id = Number(req.params.id);
            const { guideId, url, videoLength, title, shortDes, videoSerial } = req.body;
            const payloadFiles = {
                files: req.files,
            };
            console.log("🚀 ~ guide.controller.ts:200 ~ payloadFiles:", payloadFiles);
            const payload = {
                guideId: Number(guideId),
                url,
                videoLength,
                title,
                shortDes,
                videoSerial: Number(videoSerial),
            };
            const updatedGuide = await guide_service_1.default.updateGuideVideo(id, payload, payloadFiles);
            res.status(200).json({
                status: "success",
                message: `Guide with ID ${id} updated successfully.`,
                data: updatedGuide,
            });
        });
    }
})();
