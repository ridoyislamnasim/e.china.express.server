"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchError_1 = __importDefault(require("../../middleware/errors/catchError"));
const guide_service_1 = __importDefault(require("./guide.service"));
exports.default = new (class GuideController {
    constructor() {
        this.getAllGuides = (0, catchError_1.default)(async (req, res) => {
            const guides = await guide_service_1.default.getAllGuides();
            res.status(200).json({
                status: "success",
                message: "All guides retrieved successfully.",
                data: guides,
            });
        });
        this.createGuide = (0, catchError_1.default)(async (req, res) => {
            const payload = req.body;
            const newGuide = await guide_service_1.default.createGuideData(payload);
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
        this.updateGuide = (0, catchError_1.default)(async (req, res) => {
            const id = req.params.id;
            const { serial, title } = req.body;
            const payload = { serial, title };
            const updatedGuide = await guide_service_1.default.updateGuideData(id, payload);
            res.status(200).json({
                status: "success",
                message: `Guide with ID ${id} updated successfully.`,
                data: updatedGuide,
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
        //todo update guide video
        this.updateGuideVideo = (0, catchError_1.default)(async (req, res) => {
            const id = req.params.id;
            const { guideId, url, imgSrc, videoLength, title, shortDes, videoSerial } = req.body;
            const payload = { guideId, url, imgSrc, videoLength, title, shortDes, videoSerial };
            const updatedGuide = await guide_service_1.default.updateGuideVideo(parseInt(id), payload);
            res.status(200).json({
                status: "success",
                message: `Guide with ID ${id} updated successfully.`,
                data: updatedGuide,
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
    }
})();
