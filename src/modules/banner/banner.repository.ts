import { PrismaClient } from '@prisma/client';
import { pagination } from '../../utils/pagination';

const prisma = new PrismaClient();

export interface BannerDoc {
  title: string;
  details: string;
  type: string;
  bannerCategory: string;
  status: boolean;
  link: string;
  // add other fields as needed
}

class BannerRepository {
  async createBanner(payload: Partial<BannerDoc>) {
    const newBanner = await prisma.banner.create({
      data: payload,
    });
    return newBanner;
  }

  async getAllBanner(filter: any) {
    return await prisma.banner.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBannerWithPagination(payload: any) {
    // try {
    //   const banners = await prisma.banner.findMany({
    //     skip: payload.offset,
    //     take: payload.limit,
    //     orderBy: { createdAt: payload.sortOrder },
    //   });
    //   const totalBanner = await prisma.banner.count();
    //   return { doc: banners, totalDoc: totalBanner };
    // } catch (error) {
    //   console.error('Error getting banners with pagination:', error);
    //   throw error;
    // }

        return await pagination(payload, async (limit: number, offset: number) => {
      const [doc, totalDoc] = await Promise.all([
       await prisma.banner.findMany({
        skip: payload.offset,
        take: payload.limit,
        orderBy: { createdAt: payload.sortOrder },
      }),
      await prisma.banner.count(),
    ]);
    return { doc, totalDoc };
  });
  }

  async getSingleBanner(id: number) {
    const banner = await prisma.banner.findUnique({
      where: { id },
    });
    return banner;
  }

  async updateBanner(id: number, payload: Partial<BannerDoc>) {
    const updatedBanner = await prisma.banner.update({
      where: { id },
      data: payload,
    });
    return updatedBanner;
  }

  async deleteBanner(id: number) {
    const deletedBanner = await prisma.banner.delete({
      where: { id },
    });
    return deletedBanner;
  }
}

export default new BannerRepository();
