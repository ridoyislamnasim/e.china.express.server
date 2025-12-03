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
    async getGuideData(guideId) {
        try {
            const guide = await this.prisma.guide.findUnique({
                where: { id: guideId },
                include: {
                    videos: {
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
    async getAllGuidesRepository() {
        return await this.prisma.guide.findMany({
            orderBy: { serial: "asc" },
        });
    }
    async createGuideRepository(body) {
        return await this.prisma.guide.create({
            data: {
                title: body.title,
                serial: body.serial,
            },
        });
    }
    async updateGuideRepository(guideId, body) {
        return await this.prisma.guide.update({
            where: { id: guideId },
            data: {
                title: body.title,
                serial: body.serial,
            },
        });
    }
    async deleteGuideRepository(id) {
        return await this.prisma.guide.delete({
            where: { id },
        });
    }
    async createGuideVideoRepository(guideId, body) {
        return await this.prisma.guideVideo.create({
            data: {
                guideId: guideId,
                url: body.url,
                videoSerial: body.videoSerial,
                imgSrc: body.imgSrc,
                videoLength: body.videoLength,
                title: body.title,
                shortDes: body.shortDes,
            },
        });
    }
    async deleteGuideVideoRepository(id) {
        return await this.prisma.guideVideo.delete({
            where: { id },
        });
    }
})();
