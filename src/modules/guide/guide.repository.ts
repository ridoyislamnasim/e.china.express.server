import prisma from "../../config/prismadatabase";
import { Guide, GuideVideo } from "@prisma/client";
import { CreateGuideDTO, UpdateGuideDTO, CreateGuideVideoDTO, GuideVideoResponseDTO } from "../../types/guide";

export default new (class GuideRespository {
  private prisma = prisma;

  async getGuideData(serial: number): Promise<(Guide & { videos: GuideVideo[] }) | null> {
    try {
      const guide = await this.prisma.guide.findUnique({
        where: { id: serial },
        include: {
          videos: {
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

  async getAllGuidesRepository(): Promise<any> {
    return await this.prisma.guide.findMany({
      orderBy: { serial: "asc" },
    });
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
        url: body.url,
        videoSerial: body.videoSerial,
        imgSrc: body.imgSrc,
        videoLength: body.videoLength,
        title: body.title,
        shortDes: body.shortDes,
      },
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

  async deleteGuideVideoRepository(id: number): Promise<GuideVideo> {
    const result = await this.prisma.guideVideo.delete({
      where: { id },
    });
    return result;
  }
})();
