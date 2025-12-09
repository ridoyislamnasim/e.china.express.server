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
                videos: guide.guideVideos.map((video) => {
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
        let allGuides = [];
        let allGuidesVideos = [];
        try {
            allGuides = await guide_repository_1.default.getAllGuidesRepository();
            allGuidesVideos = await guide_repository_1.default.getAllGuidesVideosRepository();
        }
        catch (error) {
            console.error("Error getting all guides:", error);
            throw error;
        }
        return { allGuides, allGuidesVideos };
    }
    async createGuideData(payload) {
        const { title, serial, videos } = payload;
        if (serial !== undefined) {
            try {
                const serialExist = await guide_repository_1.default.isSerialExists(serial);
                if (serialExist) {
                    const error = new Error(`Serial ${serial} already exists.`);
                    error.statusCode = 400;
                    throw error;
                }
            }
            catch (error) {
                throw error; // Let your controller/service catch this
            }
        }
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
        const serial = parseInt(id, 10);
        if (isNaN(serial)) {
            const error = new Error("Invalid Serial provided for update.");
            error.statusCode = 400;
            throw error;
        }
        const existingGuide = await guide_repository_1.default.getGuideData(serial);
        if (!existingGuide) {
            throw new errors_1.NotFoundError(`Serial ${serial} not found for update.`);
        }
        try {
            const updatedGuide = await guide_repository_1.default.updateGuideRepository(serial, payload);
            return {
                message: `Guide data with serial ${id} updated successfully`,
                data: updatedGuide,
            };
        }
        catch (error) {
            console.error("Error updating guide data:", error);
            throw error;
        }
    }
    async updateGuideVideo(id, payload) {
        if (isNaN(id)) {
            const error = new Error("Invalid id provided for update.");
            error.statusCode = 400;
            throw error;
        }
        const existingGuide = await guide_repository_1.default.getGuideVideoData(id);
        if (!existingGuide) {
            throw new errors_1.NotFoundError(`Id ${id} not found for update.`);
        }
        const isSameSerial = await guide_repository_1.default.getGuideVideo(id);
        if (Object.keys(isSameSerial).length != 0 && isSameSerial.videoSerial === payload.videoSerial) {
            throw new errors_1.NotFoundError(`Change the video Serial.`);
        }
        try {
            const updatedGuide = await guide_repository_1.default.updateGuideVideoRepository(id, payload);
            return {
                message: `Guide data with serial ${id} updated successfully`,
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
            const totalDeleted = await guide_repository_1.default.deleteAllGuideVideos(guideId);
            const data = await guide_repository_1.default.deleteGuideRepository(guideId);
            return { message: `Guide data with id ${id} deleted successfully`, data: data };
        }
        catch (error) {
            console.error("Error deleting guide data:", error);
            throw error;
        }
    }
    async deleteGuideVideo(id) {
        const guideId = parseInt(id, 10);
        if (isNaN(guideId)) {
            const error = new Error("Invalid Guide Video ID provided for deletion.");
            error.statusCode = 400;
            throw error;
        }
        try {
            const existingGuide = await guide_repository_1.default.getGuideVideo(guideId);
            if (!existingGuide) {
                throw new errors_1.NotFoundError(`Guide Video ID ${guideId} not found for deletion.`);
            }
            const data = await guide_repository_1.default.deleteGuideVideoRepository(guideId);
            return { message: `Guide Video ID ${id} deleted successfully`, data };
        }
        catch (error) {
            console.error("Error deleting guide data:", error);
            throw error;
        }
    }
})();
