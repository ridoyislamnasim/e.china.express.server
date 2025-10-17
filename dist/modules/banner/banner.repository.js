"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class BannerRepository {
    async createBanner(payload) {
        const newBanner = await prisma.banner.create({
            data: payload,
        });
        return newBanner;
    }
    async getAllBanner(filter) {
        return await prisma.banner.findMany({
            where: filter,
            orderBy: { createdAt: 'desc' },
        });
    }
    async getBannerWithPagination(payload) {
        try {
            const banners = await prisma.banner.findMany({
                skip: payload.offset,
                take: payload.limit,
                orderBy: { createdAt: payload.sortOrder },
            });
            const totalBanner = await prisma.banner.count();
            return { doc: banners, totalDoc: totalBanner };
        }
        catch (error) {
            console.error('Error getting banners with pagination:', error);
            throw error;
        }
    }
    async getSingleBanner(id) {
        const banner = await prisma.banner.findUnique({
            where: { id },
        });
        return banner;
    }
    async updateBanner(id, payload) {
        const updatedBanner = await prisma.banner.update({
            where: { id },
            data: payload,
        });
        return updatedBanner;
    }
    async deleteBanner(id) {
        const deletedBanner = await prisma.banner.delete({
            where: { id },
        });
        return deletedBanner;
    }
}
exports.default = new BannerRepository();
