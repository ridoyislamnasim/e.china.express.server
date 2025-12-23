import { Request, Response, NextFunction } from "express";
import catchError from "../../middleware/errors/catchError";
import { responseHandler } from "../../utils/responseHandler";
import withTransaction from "../../middleware/transactions/withTransaction";
import BannerService from "./banner.service";

class BannerController {
  createBanner = withTransaction(async (req: Request, res: Response, next: NextFunction, session: any) => {
    const payloadFiles = {
      files: req.files,
    };
    const payload = {
      bannerType: req?.body?.bannerType,
      link: req?.body?.link,
    };
    const bannerResult = await BannerService.createBanner(payload, payloadFiles, session);
    const resDoc = responseHandler(201, "Banner Created successfully", bannerResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllBanner = catchError(async (req: Request, res: Response, next: NextFunction) => {
    console.log("Banner Get All request body:", req);
    // ip address logging
    const ip = (typeof req.headers["x-forwarded-for"] === "string" ? req.headers["x-forwarded-for"].split(",")[0] : Array.isArray(req.headers["x-forwarded-for"]) ? req.headers["x-forwarded-for"][0] : req.socket.remoteAddress || req.ip || "").replace(/^.*:/, ""); // Clean IPv6 prefix if present

    console.log("Extracted IP -------------- :", ip);

    let payload = {
      bannerType: req.query.bannerType,
    };
    const bannerResult = await BannerService.getAllBanner(payload);
    const resDoc = responseHandler(200, "Get All Banners", bannerResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getBannerWithPagination = catchError(async (req: Request, res: Response, next: NextFunction) => {
    let payload = {
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      order: req.query.order,
    };
    const banner = await BannerService.getBannerWithPagination(payload);
    const resDoc = responseHandler(200, "Banners get successfully", { ...banner });
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSingleBanner = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const bannerResult = await BannerService.getSingleBanner(id);
    const resDoc = responseHandler(201, "Single Banner successfully", bannerResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateBanner = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const payloadFiles = {
      files: req.files,
    };
    const payload = {
      bannerType: req?.body?.bannerType,
      link: req?.body?.link,
    };
    const bannerResult = await BannerService.updateBanner(id, payload, payloadFiles);
    const resDoc = responseHandler(201, "Banner Update successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });
  deleteBanner = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const bannerResult = await BannerService.deleteBanner(id);
    const resDoc = responseHandler(200, "Banner Deleted successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });
}

export default new BannerController();
