import { Request, Response, NextFunction } from "express";
import catchError from "../../middleware/errors/catchError";
import { responseHandler } from "../../utils/responseHandler";
import withTransaction from "../../middleware/transactions/withTransaction";
import AirBookingService from "./air.booking.service";

class AirBookingController {
  createAirBooking = withTransaction(async (req: Request, res: Response, next: NextFunction, session: any) => {
    const payloadFiles = {
      files: req.files,
    };
    const userRef = req.user?.user_info_encrypted?.id?.toString() ?? null;
    const payload = {
      shippingRateId: req.body.shippingRateId,
      userRef: userRef,
      warehouseImportId: req.body.warehouseImportId,
      warehouseExportId: req.body.warehouseExportId,
      packingId: req.body.packingId,
      brandingId: req.body.brandingId,
      bookingDate: new Date(req.body.bookingDate),
      arrivalDate: req.body.arrivalDate ? new Date(req.body.arrivalDate) : null,
      countryExportId: req.body.countryExportId,
      countryImportId: req.body.countryImportId,
      weight: req.body.weight,
      productQuantity: req.body.productQuantity,
    };
    const airBookingResult = await AirBookingService.createAirBooking(payload, payloadFiles, session);
    const resDoc = responseHandler(201, "AirBooking Created successfully", airBookingResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllAirBooking = catchError(async (req: Request, res: Response, next: NextFunction) => {
    console.log("AirBooking Get All request body:", req);
    // ip address logging
    const ip = (typeof req.headers["x-forwarded-for"] === "string" ? req.headers["x-forwarded-for"].split(",")[0] : Array.isArray(req.headers["x-forwarded-for"]) ? req.headers["x-forwarded-for"][0] : req.socket.remoteAddress || req.ip || "").replace(/^.*:/, ""); // Clean IPv6 prefix if present

    console.log("Extracted IP -------------- :", ip);

    let payload = {
      airBookingType: req.query.airBookingType,
    };
    const airBookingResult = await AirBookingService.getAllAirBooking(payload);
    const resDoc = responseHandler(200, "Get All AirBookings", airBookingResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAirBookingWithPagination = catchError(async (req: Request, res: Response, next: NextFunction) => {
    let payload = {
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      order: req.query.order,
    };
    const airBooking = await AirBookingService.getAirBookingWithPagination(payload);
    const resDoc = responseHandler(200, "AirBookings get successfully", { ...airBooking });
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSingleAirBooking = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const airBookingResult = await AirBookingService.getSingleAirBooking(id);
    const resDoc = responseHandler(201, "Single AirBooking successfully", airBookingResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateAirBooking = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const payloadFiles = {
      files: req.files,
    };
    const payload = {
      airBookingType: req?.body?.airBookingType,
      link: req?.body?.link,
    };
    const airBookingResult = await AirBookingService.updateAirBooking(id, payload, payloadFiles);
    const resDoc = responseHandler(201, "AirBooking Update successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });
  deleteAirBooking = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const airBookingResult = await AirBookingService.deleteAirBooking(id);
    const resDoc = responseHandler(200, "AirBooking Deleted successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });
}

export default new AirBookingController();
