"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prismadatabase_1 = __importDefault(require("../../config/prismadatabase"));
exports.default = new (class GuideRespository {
    constructor() {
        this.prisma = prismadatabase_1.default;
    }
    async getGuideData(serial) {
        try {
            const guide = await this.prisma.guide.findUnique({
                where: { id: serial },
                include: {
                    guideVideos: {
                        orderBy: { videoSerial: "asc" },
                    },
                },
            });
            return guide;
        }
        catch (error) {
            console.error("Error retrieving guide data:", error);
            throw new Error("Failed to retrieve guide data from the database.");
        }
    }
    async getGuideVideoData(serial) {
        try {
            const guideVideo = await this.prisma.guideVideo.findFirst({
                where: { id: serial },
            });
            return guideVideo;
        }
        catch (error) {
            console.error("Error retrieving guide data:", error);
            throw new Error("Failed to retrieve guide data from the database.");
        }
    }
    async getGuideVideo(id) {
        try {
            const guide = await this.prisma.guideVideo.findFirst({
                where: { id: id },
            });
            return guide;
        }
        catch (error) {
            console.error("Error retrieving guide video data:", error);
            throw new Error("Failed to retrieve guide video data from the database.");
        }
    }
    async getAllGuidesRepository() {
        return await this.prisma.guide.findMany({
            orderBy: { serial: "asc" },
        });
    }
    async getAllGuidesVideosRepository() {
        return await this.prisma.guideVideo.findMany({
            orderBy: { guideId: "asc" },
        });
    }
    async isSerialExists(serial) {
        const count = await this.prisma.guide.count({
            where: { serial },
        });
        return count > 0;
    }
    async createGuideRepository(body) {
        return await this.prisma.guide.create({
            data: {
                title: body.title,
                serial: body.serial,
            },
        });
    }
    async updateGuideRepository(serial, body) {
        return await this.prisma.guide.update({
            where: { id: serial },
            data: {
                title: body.title,
                serial: body.serial,
            },
        });
    }
    async updateGuideVideoRepository(videoId, body) {
        return await this.prisma.guideVideo.update({
            where: { id: videoId },
            data: {
                guideId: body.guideId,
                url: body.url,
                imgSrc: body.imgSrc,
                videoLength: body.videoLength,
                title: body.title,
                shortDes: body.shortDes,
                videoSerial: body.videoSerial,
            },
        });
    }
    async createGuideVideoRepository(guideId, body) {
        return await this.prisma.guideVideo.create({
            data: {
                guideId: guideId,
                index: body.videoSerial,
                url: body.url,
                videoSerial: body.videoSerial,
                imgSrc: body.imgSrc,
                videoLength: body.videoLength,
                title: body.title,
                shortDes: body.shortDes,
            },
        });
    }
    async deleteGuideRepository(id) {
        return await this.prisma.guide.delete({
            where: { id },
        });
    }
    async deleteAllGuideVideos(guideId) {
        const result = await this.prisma.$transaction(async (tx) => {
            // Delete all related videos first
            const deleted = await tx.guideVideo.deleteMany({
                where: { guideId },
            });
            return deleted.count; // optional, returns number of deleted rows
        });
        return result;
    }
    async deleteGuideVideoRepository(id) {
        const result = await this.prisma.guideVideo.delete({
            where: { id },
        });
        return result;
    }
})();
