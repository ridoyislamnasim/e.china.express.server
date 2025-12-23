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
    // done
    async getAllGuidesWithPaginationRepository(params) {
        const { limit = 10, offset = 0 } = params || {};
        const result = await this.prisma.guide.findMany({
            orderBy: { serial: "asc" },
            skip: offset,
            take: limit,
            include: {
                _count: {
                    select: { guideVideos: true }, // counts the videos for each guide
                },
            },
        });
        // Map the result to include a `totalVideos` property
        return result.map((guide) => ({
            ...guide,
            totalVideos: guide._count.guideVideos,
            _count: undefined, // optional: remove the internal _count property
        }));
    }
    async countGuidesRepository() {
        return await this.prisma.guide.count();
    }
    async getAllGuidesRepository() {
        return await this.prisma.guide.findMany({
            orderBy: { serial: "asc" },
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
    async findVideosByGuideId(id) {
        return await this.prisma.guideVideo.findMany({
            where: { guideId: id }, // guideId matches the provided id
            orderBy: { videoSerial: "asc" }, // optional: sort videos by serial
        });
    }
    async findGuideById(id) {
        return this.prisma.guide.findUnique({
            where: { id },
        });
    }
    async shiftSerialDown(current, latest) {
        return this.prisma.guide.updateMany({
            where: {
                serial: {
                    gt: current,
                    lte: latest,
                },
            },
            data: {
                serial: {
                    decrement: 1,
                },
            },
        });
    }
    async isTitleExists(title) {
        const count = await this.prisma.guide.count({
            where: { title },
        });
        return count > 0;
    }
    async shiftSerialUp(current, latest) {
        return this.prisma.guide.updateMany({
            where: {
                serial: {
                    gte: latest,
                    lt: current,
                },
            },
            data: {
                serial: {
                    increment: 1,
                },
            },
        });
    }
    async updateGuideById(id, payload) {
        return this.prisma.guide.update({
            where: { id },
            data: payload,
        });
    }
    async createGuideVideo(payload) {
        return prismadatabase_1.default.guideVideo.create({
            data: {
                guideId: payload.guideId,
                index: payload.videoSerial,
                title: payload.title,
                url: payload.url,
                shortDes: payload.shortDes,
                videoLength: payload.videoLength,
                videoSerial: payload.videoSerial,
                imgSrc: payload.imgSrc,
            },
        });
    }
    // async findGuideById(id: number): Promise<any> {
    //   return await this.prisma.guide.findUnique({
    //     where: { id },
    //   });
    // }
    //todo
    async getGuideData(id) {
        try {
            const guide = await this.prisma.guide.findUnique({
                where: { id: id },
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
    async createGuideRepository(data) {
        return await this.prisma.guide.create({
            data: data,
        });
    }
    // Optional: adjust serials when creating a new guide
    async adjustSerialsForCreate(serial) {
        await this.prisma.guide.updateMany({
            where: { serial: { gte: serial } },
            data: { serial: { increment: 1 } },
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
    async deleteAllGuideVideosByGuideId(guideId) {
        const result = await this.prisma.guideVideo.deleteMany({
            where: { guideId },
        });
        return result.count;
    }
    async deleteGuideVideoRepository(id) {
        const result = await this.prisma.guideVideo.delete({
            where: { id },
        });
        return result;
    }
})();
