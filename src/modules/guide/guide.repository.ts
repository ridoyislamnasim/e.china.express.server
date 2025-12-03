import prisma from "../../config/prismadatabase";
import { Guide, GuideVideo } from "@prisma/client";
import { CreateGuideDTO, UpdateGuideDTO, CreateGuideVideoDTO } from "../../types/guide";

export default new (class GuideRespository {
  private prisma = prisma;

  async getGuideData(guideId: number): Promise<(Guide & { videos: GuideVideo[] }) | null> {
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
    } catch (error) {
      console.error("Error retrieving guide data:", error);
      throw new Error("Failed to retrieve guide data from the database.");
    }
  }

  async getAllGuidesRepository(): Promise<Guide[]> {
    return await this.prisma.guide.findMany({
      orderBy: { serial: "asc" },
    });
  }

  async createGuideRepository(body: CreateGuideDTO): Promise<Guide> {
    return await this.prisma.guide.create({
      data: {
        title: body.title,
        serial: body.serial,
      },
    });
  }

  async updateGuideRepository(guideId: number, body: UpdateGuideDTO): Promise<Guide> {
    return await this.prisma.guide.update({
      where: { id: guideId },
      data: {
        title: body.title,
        serial: body.serial,
      },
    });
  }

  async deleteGuideRepository(id: number): Promise<Guide> {
    return await this.prisma.guide.delete({
      where: { id },
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

  async deleteGuideVideoRepository(id: number): Promise<GuideVideo> {
    return await this.prisma.guideVideo.delete({
      where: { id },
    });
  }
})();
