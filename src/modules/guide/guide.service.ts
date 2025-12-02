import guideRepository from "./guide.repository";
import { CreateGuideDTO, UpdateGuideDTO, CreateGuideVideoDTO, GuideVideoResponseDTO } from "../../types/guide";
import { NotFoundError } from "../../utils/errors";
import { GuideResponseDTO } from "../../types/guide";

export default new (class GuideService {
  async getGuideById(id: string): Promise<GuideResponseDTO> {
    const guideId = parseInt(id, 10);

    if (isNaN(guideId)) {
      const error = new Error("Invalid Guide ID provided.");
      (error as any).statusCode = 400;
      throw error;
    }

    try {
      const guide = await guideRepository.getGuideData(guideId);

      if (!guide) {
        throw new NotFoundError(`Guide with ID ${guideId} not found.`);
      }

      const responseData: GuideResponseDTO = {
        id: guide.id,
        serial: guide.serial,
        title: guide.title,
        createdAt: guide.createdAt,
        updatedAt: guide.updatedAt,

        videos: guide.videos.map((video: GuideVideoResponseDTO) => ({
          id: video.id,
          guideId: video.guideId,
          url: video.url,
          videoSerial: video.videoSerial,

          imgSrc: video.imgSrc ?? undefined,
          videoLength: video.videoLength ?? undefined,
          title: video.title ?? undefined,
          shortDes: video.shortDes ?? undefined,

          createdAt: video.createdAt,
          updatedAt: video.updatedAt,
        })),
      };

      return responseData;
    } catch (error) {
      console.error("Error retrieving guide data by ID:", error);
      throw error;
    }
  }

  async getAllGuides(): Promise<any> {
    try {
      const allGuides = await guideRepository.getAllGuidesRepository();
      if (!allGuides || allGuides.length === 0) {
        return [];
      }
      return allGuides;
    } catch (error) {
      console.error("Error getting all guides:", error);
      throw error;
    }
  }

  async createGuideData(payload: CreateGuideDTO): Promise<any> {
    const { title, serial, videos } = payload;

    if (!title || serial === undefined) {
      const missingFields: string[] = [];
      if (!title) missingFields.push("title");
      if (serial === undefined) missingFields.push("serial");

      const error = new Error(`Missing required field(s): ${missingFields.join(", ")}`);
      (error as any).statusCode = 400;
      throw error;
    }

    try {
      const newGuide = await guideRepository.createGuideRepository({ title, serial });

      if (videos && videos.length > 0) {
        const createdVideos = await Promise.all(videos.map((video) => guideRepository.createGuideVideoRepository(newGuide.id, video as CreateGuideVideoDTO)));
        (newGuide as any).videos = createdVideos;
      }

      return newGuide;
    } catch (error) {
      console.error("Error creating guide data:", error);
      throw error;
    }
  }

  async updateGuideData(id: string, payload: UpdateGuideDTO): Promise<any> {
    const guideId = parseInt(id, 10);

    if (isNaN(guideId)) {
      const error = new Error("Invalid Guide ID provided for update.");
      (error as any).statusCode = 400;
      throw error;
    }

    const existingGuide = await guideRepository.getGuideData(guideId);
    if (!existingGuide) {
      throw new NotFoundError(`Guide with ID ${guideId} not found for update.`);
    }

    try {
      const updatedGuide = await guideRepository.updateGuideRepository(guideId, payload);
      return {
        message: `Guide data with id ${id} updated successfully`,
        data: updatedGuide,
      };
    } catch (error) {
      console.error("Error updating guide data:", error);
      throw error;
    }
  }

  async deleteGuideData(id: string): Promise<any> {
    const guideId = parseInt(id, 10);

    if (isNaN(guideId)) {
      const error = new Error("Invalid Guide ID provided for deletion.");
      (error as any).statusCode = 400;
      throw error;
    }

    try {
      const existingGuide = await guideRepository.getGuideData(guideId);
      if (!existingGuide) {
        throw new NotFoundError(`Guide with ID ${guideId} not found for deletion.`);
      }

      await guideRepository.deleteGuideRepository(guideId);
      return { message: `Guide data with id ${id} deleted successfully` };
    } catch (error) {
      console.error("Error deleting guide data:", error);
      throw error;
    }
  }
})();
