import prisma from "../../config/prismadatabase";
import { Guide, GuideVideo } from "@prisma/client";
import { CreateGuideDTO, UpdateGuideDTO, CreateGuideVideoDTO, GuideVideoResponseDTO } from "../../types/guide";

export default new (class GuideRespository {
  private prisma = prisma;

  // done
  async getAllGuidesWithPaginationRepository(params?: { limit?: number; offset?: number }): Promise<any> {
    const { limit = 10, offset = 0 } = params || {};
    return await this.prisma.guide.findMany({
      orderBy: { serial: "asc" },
      skip: offset,
      take: limit,
    });
  }

  async countGuidesRepository() {
    return await this.prisma.guide.count();
  }

  async getAllGuidesRepository(): Promise<any> {
    return await this.prisma.guide.findMany({
      orderBy: { serial: "asc" },
    });
  }

  async deleteGuideRepository(id: number): Promise<Guide> {
    return await this.prisma.guide.delete({
      where: { id },
    });
  }

  async deleteAllGuideVideos(guideId: number): Promise<number> {
    const result = await this.prisma.$transaction(async (tx) => {
      // Delete all related videos first
      const deleted = await tx.guideVideo.deleteMany({
        where: { guideId },
      });
      return deleted.count; // optional, returns number of deleted rows
    });

    return result;
  }

  async findVideosByGuideId(id: number): Promise<any> {
    return await this.prisma.guideVideo.findMany({
      where: { guideId: id }, // guideId matches the provided id
      orderBy: { videoSerial: "asc" }, // optional: sort videos by serial
    });
  }

  async findGuideById(id: number) {
    return this.prisma.guide.findUnique({
      where: { id },
    });
  }

  async shiftSerialDown(current: number, latest: number) {
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

  async shiftSerialUp(current: number, latest: number) {
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

  async updateGuideById(id: number, payload: UpdateGuideDTO) {
    return this.prisma.guide.update({
      where: { id },
      data: payload,
    });
  }

  // async findGuideById(id: number): Promise<any> {
  //   return await this.prisma.guide.findUnique({
  //     where: { id },
  //   });
  // }

  //todo
  async getGuideData(id: number): Promise<(Guide & { guideVideos: GuideVideo[] }) | null> {
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
    } catch (error) {
      console.error("Error retrieving guide data:", error);
      throw new Error("Failed to retrieve guide data from the database.");
    }
  }

  async getGuideVideoData(serial: number): Promise<any> {
    try {
      const guideVideo = await this.prisma.guideVideo.findFirst({
        where: { id: serial },
      });
      return guideVideo;
    } catch (error) {
      console.error("Error retrieving guide data:", error);
      throw new Error("Failed to retrieve guide data from the database.");
    }
  }

  async getGuideVideo(id: number): Promise<any> {
    try {
      const guide = await this.prisma.guideVideo.findFirst({
        where: { id: id },
      });
      return guide;
    } catch (error) {
      console.error("Error retrieving guide video data:", error);
      throw new Error("Failed to retrieve guide video data from the database.");
    }
  }

  async getAllGuidesVideosRepository(): Promise<any> {
    return await this.prisma.guideVideo.findMany({
      orderBy: { guideId: "asc" },
    });
  }

  async isSerialExists(serial: number): Promise<boolean> {
    const count = await this.prisma.guide.count({
      where: { serial },
    });
    return count > 0;
  }

  async createGuideRepository(body: CreateGuideDTO): Promise<any> {
    return await this.prisma.guide.create({
      data: {
        title: body.title,
        serial: body.serial,
      },
    });
  }

  async updateGuideRepository(serial: number, body: UpdateGuideDTO): Promise<Guide> {
    return await this.prisma.guide.update({
      where: { id: serial },
      data: {
        title: body.title,
        serial: body.serial,
      },
    });
  }

  async updateGuideVideoRepository(videoId: number, body: GuideVideoResponseDTO): Promise<GuideVideo> {
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

  async createGuideVideoRepository(guideId: number, body: CreateGuideVideoDTO): Promise<GuideVideo> {
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

  async deleteGuideVideoRepository(id: number): Promise<GuideVideo> {
    const result = await this.prisma.guideVideo.delete({
      where: { id },
    });
    return result;
  }
})();
