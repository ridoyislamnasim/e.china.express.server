import guideRepository from "./guide.repository";
import { CreateGuideDTO, UpdateGuideDTO, CreateGuideVideoDTO, GuideVideoResponseDTO, GuideVideo, Guide } from "../../types/guide";
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

        videos: guide.guideVideos.map((video: any) => ({
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
    let allGuides: Guide[] = [];
    let allGuidesVideos: GuideVideo[] = [];
    try {
      allGuides = await guideRepository.getAllGuidesRepository();
      allGuidesVideos = await guideRepository.getAllGuidesVideosRepository();
    } catch (error) {
      console.error("Error getting all guides:", error);
      throw error;
    }

    return { allGuides, allGuidesVideos };
  }

  async createGuideData(payload: CreateGuideDTO): Promise<any> {
    const { title, serial, videos } = payload;

    if (serial !== undefined) {
      try {
        const serialExist = await guideRepository.isSerialExists(serial);

        if (serialExist) {
          const error: any = new Error(`Serial ${serial} already exists.`);
          error.statusCode = 400;
          throw error;
        }
      } catch (error) {
        throw error; // Let your controller/service catch this
      }
    }

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
    const serial = parseInt(id, 10);

    if (isNaN(serial)) {
      const error = new Error("Invalid Serial provided for update.");
      (error as any).statusCode = 400;
      throw error;
    }

    const existingGuide = await guideRepository.getGuideData(serial);
    if (!existingGuide) {
      throw new NotFoundError(`Serial ${serial} not found for update.`);
    }

    try {
      const updatedGuide = await guideRepository.updateGuideRepository(serial, payload);
      return {
        message: `Guide data with serial ${id} updated successfully`,
        data: updatedGuide,
      };
    } catch (error) {
      console.error("Error updating guide data:", error);
      throw error;
    }
  }

  async updateGuideVideo(id: number, payload: GuideVideoResponseDTO): Promise<any> {
    if (isNaN(id)) {
      const error = new Error("Invalid id provided for update.");
      (error as any).statusCode = 400;
      throw error;
    }

    const existingGuide = await guideRepository.getGuideVideoData(id);
    if (!existingGuide) {
      throw new NotFoundError(`Id ${id} not found for update.`);
    }

    const isSameSerial = await guideRepository.getGuideVideo(id);

    if (Object.keys(isSameSerial).length != 0 && isSameSerial.videoSerial === payload.videoSerial) {
      throw new NotFoundError(`Change the video Serial.`);
    }

    try {
      const updatedGuide = await guideRepository.updateGuideVideoRepository(id, payload);
      return {
        message: `Guide data with serial ${id} updated successfully`,
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

      const totalDeleted = await guideRepository.deleteAllGuideVideos(guideId);

      const data = await guideRepository.deleteGuideRepository(guideId);
      return { message: `Guide data with id ${id} deleted successfully`, data: data };
    } catch (error) {
      console.error("Error deleting guide data:", error);
      throw error;
    }
  }

  async deleteGuideVideo(id: string): Promise<any> {
    const guideId = parseInt(id, 10);

    if (isNaN(guideId)) {
      const error = new Error("Invalid Guide Video ID provided for deletion.");
      (error as any).statusCode = 400;
      throw error;
    }

    try {
      const existingGuide = await guideRepository.getGuideVideo(guideId);
      if (!existingGuide) {
        throw new NotFoundError(`Guide Video ID ${guideId} not found for deletion.`);
      }

      const data = await guideRepository.deleteGuideVideoRepository(guideId);
      return { message: `Guide Video ID ${id} deleted successfully`, data };
    } catch (error) {
      console.error("Error deleting guide data:", error);
      throw error;
    }
  }
})();
