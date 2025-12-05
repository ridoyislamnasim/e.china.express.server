import { Request, Response } from "express";
import catchError from "../../middleware/errors/catchError";
import guideService from "./guide.service";
import { CreateGuideDTO, GuideVideoResponseDTO, UpdateGuideDTO } from "../../types/guide";

export default new (class GuideController {
  getAllGuides = catchError(async (req: Request, res: Response) => {
    const guides = await guideService.getAllGuides();
    res.status(200).json({
      status: "success",
      message: "All guides retrieved successfully.",
      data: guides,
    });
  });

  createGuide = catchError(async (req: Request, res: Response) => {
    const payload: CreateGuideDTO = req.body;
    const newGuide = await guideService.createGuideData(payload);
    res.status(201).json({
      status: "success",
      message: "Guide created successfully.",
      data: newGuide,
    });
  });

  getGuideBySlug = catchError(async (req: Request, res: Response) => {
    const { id } = req.params;
    const guideData = await guideService.getGuideById(id);
    res.status(200).json({
      status: "success",
      message: `Guide data for ID ${id} retrieved successfully.`,
      data: guideData,
    });
  });

  updateGuide = catchError(async (req: Request, res: Response) => {
    const id = req.params.id;
    const { serial, title } = req.body;
    const payload = { serial, title };
    const updatedGuide = await guideService.updateGuideData(id, payload);
    res.status(200).json({
      status: "success",
      message: `Guide with ID ${id} updated successfully.`,
      data: updatedGuide,
    });
  });

  deleteGuide = catchError(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await guideService.deleteGuideData(id);
    res.status(200).json({
      status: "success",
      message: result.message,
      data: result.data,
    });
  });

  //todo update guide video
  updateGuideVideo = catchError(async (req: Request, res: Response) => {
    const id = req.params.id;
    const { guideId, url, imgSrc, videoLength, title, shortDes, videoSerial } = req.body;

    const payload = { guideId, url, imgSrc, videoLength, title, shortDes, videoSerial };

    const updatedGuide = await guideService.updateGuideVideo(parseInt(id), payload as GuideVideoResponseDTO);
    res.status(200).json({
      status: "success",
      message: `Guide with ID ${id} updated successfully.`,
      data: updatedGuide,
    });
  });

  deleteGuideVideo = catchError(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await guideService.deleteGuideVideo(id);
    const { message, data } = result;
    res.status(200).json({
      status: "success",
      message: message,
      data: data,
    });
  });
})();
