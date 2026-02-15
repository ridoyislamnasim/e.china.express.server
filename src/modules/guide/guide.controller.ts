import { Request, Response } from "express";
import catchError from "../../middleware/errors/catchError";
import guideService from "./guide.service";
import {
  CreateGuideDTO,
  GuideVideoResponseDTO,
  UpdateGuideDTO,
} from "../../types/guide";

export default new (class GuideController {
  //done
  getAllGuideWithPagination = catchError(
    async (req: Request, res: Response) => {
      const { page, limit } = req.query;
      const query = { page, limit };
      const result = await guideService.getAllGuideWithPagination(query);

      res.status(200).json({
        status: "success",
        message: "Guides retrieved successfully.",
        data: result,
      });
    },
  );

  getAllGuides = catchError(async (req: Request, res: Response) => {
    const guides = await guideService.getAllGuides();
    res.status(200).json({
      status: "success",
      message: "All guides retrieved successfully.",
      data: guides,
    });
  });

  deleteGuide = catchError(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await guideService.deleteGuideData(id as string);
    res.status(200).json({
      status: "success",
      message: result.message,
      data: result.data,
    });
  });

  getGuideVideosById = catchError(async (req: Request, res: Response) => {
    const { id } = req.params;
    const guides = await guideService.getGuideVideosById(
      parseInt(id as string),
    );
    res.status(200).json({
      status: "success",
      message: "All guides retrieved successfully.",
      data: guides,
    });
  });

  updateGuide = catchError(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { serial, title } = req.body;
    const payload = { serial, title };
    const updatedGuide = await guideService.updateGuideData(id, payload);
    res.status(200).json({
      status: "success",
      ...updatedGuide,
    });
  });

  deleteGuideVideo = catchError(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await guideService.deleteGuideVideo(id as string);
    const { message, data } = result;
    res.status(200).json({
      status: "success",
      message: message,
      data: data,
    });
  });

  createGuideVideo = catchError(async (req: Request, res: Response) => {
    const { guideId, title, url, shortDes, videoLength, videoSerial } =
      req.body;

    console.log("🚀 ~ guide.controller.ts:76 ~ req.files:", req.files);
    const payloadFiles = { files: req.files };

    // console.log("🚀 ~ guide.controller.ts:97 ~ file:", file);

    const payload = {
      guideId: Number(guideId),
      title,
      url,
      shortDes,
      videoLength,
      videoSerial: Number(videoSerial),
    };

    const result = await guideService.createGuideVideo(payload, payloadFiles);

    res.status(201).json({
      status: "success",
      message: result.message,
      data: result.data,
    });
  });

  //todo

  //   async getPolicesWithPagination(payload: { limit: number; offset: number }, tx: any): Promise<any> {
  //   const { limit, offset } = payload;
  //   const prismaClient: PrismaClient = tx || this.prisma;
  //   return await pagination(payload, async (limit: number, offset: number, sortOrder: any) => {
  //     const [doc, totalDoc] = await Promise.all([
  //       this.prisma.policyType.findMany({
  //         where: {},
  //         skip: offset,
  //         take: limit,
  //       }),
  //       prisma.policyType.count({ where: {} }),
  //     ]);
  //     return { doc, totalDoc };
  //   });
  // }

  createGuide = catchError(async (req: Request, res: Response) => {
    const payload: CreateGuideDTO = req.body;
    const payloadFiles = { files: req.files };

    const newGuide = await guideService.createGuideData(payload, payloadFiles);

    res.status(201).json({
      status: "success",
      message: "Guide created successfully.",
      data: newGuide,
    });
  });

  getGuideBySlug = catchError(async (req: Request, res: Response) => {
    const { id } = req.params;
    const guideData = await guideService.getGuideById(id as string);
    res.status(200).json({
      status: "success",
      message: `Guide data for ID ${id} retrieved successfully.`,
      data: guideData,
    });
  });

  //todo update guide video
  updateGuideVideo = catchError(async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const { guideId, url, videoLength, title, shortDes, videoSerial } =
      req.body;

    const payloadFiles = {
      files: req.files,
    };
    console.log("🚀 ~ guide.controller.ts:200 ~ payloadFiles:", payloadFiles);

    const payload = {
      guideId: Number(guideId),
      url,
      videoLength,
      title,
      shortDes,
      videoSerial: Number(videoSerial),
    };

    const updatedGuide = await guideService.updateGuideVideo(
      id,
      payload,
      payloadFiles,
    );

    res.status(200).json({
      status: "success",
      message: `Guide with ID ${id} updated successfully.`,
      data: updatedGuide,
    });
  });
})();
