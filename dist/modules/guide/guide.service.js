"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const guide_repository_1 = __importDefault(require("./guide.repository"));
const errors_1 = require("../../utils/errors");
exports.default = new (class GuideService {
    async getGuideById(id) {
        const guideId = parseInt(id, 10);
        if (isNaN(guideId)) {
            const error = new Error("Invalid Guide ID provided.");
            error.statusCode = 400;
            throw error;
        }
        try {
            const guide = await guide_repository_1.default.getGuideData(guideId);
            if (!guide) {
                throw new errors_1.NotFoundError(`Guide with ID ${guideId} not found.`);
            }
            const responseData = {
                id: guide.id,
                serial: guide.serial,
                title: guide.title,
                createdAt: guide.createdAt,
                updatedAt: guide.updatedAt,
                videos: guide.videos.map((video) => {
                    var _a, _b, _c, _d;
                    return ({
                        id: video.id,
                        guideId: video.guideId,
                        url: video.url,
                        videoSerial: video.videoSerial,
                        imgSrc: (_a = video.imgSrc) !== null && _a !== void 0 ? _a : undefined,
                        videoLength: (_b = video.videoLength) !== null && _b !== void 0 ? _b : undefined,
                        title: (_c = video.title) !== null && _c !== void 0 ? _c : undefined,
                        shortDes: (_d = video.shortDes) !== null && _d !== void 0 ? _d : undefined,
                        createdAt: video.createdAt,
                        updatedAt: video.updatedAt,
                    });
                }),
            };
            return responseData;
        }
        catch (error) {
            console.error("Error retrieving guide data by ID:", error);
            throw error;
        }
    }
    async getAllGuides() {
        try {
            const allGuides = await guide_repository_1.default.getAllGuidesRepository();
            if (!allGuides || allGuides.length === 0) {
                return [];
            }
            return allGuides;
        }
        catch (error) {
            console.error("Error getting all guides:", error);
            throw error;
        }
    }
    async createGuideData(payload) {
        const { title, serial, videos } = payload;
        if (!title || serial === undefined) {
            const missingFields = [];
            if (!title)
                missingFields.push("title");
            if (serial === undefined)
                missingFields.push("serial");
            const error = new Error(`Missing required field(s): ${missingFields.join(", ")}`);
            error.statusCode = 400;
            throw error;
        }
        try {
            const newGuide = await guide_repository_1.default.createGuideRepository({ title, serial });
            if (videos && videos.length > 0) {
                const createdVideos = await Promise.all(videos.map((video) => guide_repository_1.default.createGuideVideoRepository(newGuide.id, video)));
                newGuide.videos = createdVideos;
            }
            return newGuide;
        }
        catch (error) {
            console.error("Error creating guide data:", error);
            throw error;
        }
    }
    async updateGuideData(id, payload) {
        const guideId = parseInt(id, 10);
        if (isNaN(guideId)) {
            const error = new Error("Invalid Guide ID provided for update.");
            error.statusCode = 400;
            throw error;
        }
        const existingGuide = await guide_repository_1.default.getGuideData(guideId);
        if (!existingGuide) {
            throw new errors_1.NotFoundError(`Guide with ID ${guideId} not found for update.`);
        }
        try {
            const updatedGuide = await guide_repository_1.default.updateGuideRepository(guideId, payload);
            return {
                message: `Guide data with id ${id} updated successfully`,
                data: updatedGuide,
            };
        }
        catch (error) {
            console.error("Error updating guide data:", error);
            throw error;
        }
    }
    async deleteGuideData(id) {
        const guideId = parseInt(id, 10);
        if (isNaN(guideId)) {
            const error = new Error("Invalid Guide ID provided for deletion.");
            error.statusCode = 400;
            throw error;
        }
        try {
            const existingGuide = await guide_repository_1.default.getGuideData(guideId);
            if (!existingGuide) {
                throw new errors_1.NotFoundError(`Guide with ID ${guideId} not found for deletion.`);
            }
            await guide_repository_1.default.deleteGuideRepository(guideId);
            return { message: `Guide data with id ${id} deleted successfully` };
        }
        catch (error) {
            console.error("Error deleting guide data:", error);
            throw error;
        }
    }
})();
