import { Request, Response, NextFunction } from "express";
import catchError from "../../middleware/errors/catchError";
import { responseHandler } from "../../utils/responseHandler";
import withTransaction from "../../middleware/transactions/withTransaction";
import SeaBookingService from "./sea.booking.service";

class SeaBookingController {
  createSeaBooking = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    const payloadFiles = {
      files: req.files,
    };
    const userRef = req.user?.user_info_encrypted?.id?.toString() ?? null;
    const payload = {
      shippingDate: new Date(req.body.shippingDate),
      cartonQuantity: req.body.cartonQuantity,
      
      shippingRateId: req.body.shippingRateId,
      importCountryId: req.body.importCountryId,
      exportCountryId: req.body.exportCountryId,
      shippingMethodId: req.body.shippingMethodId,
      category1688Id: req.body.category1688Id,
      weight: req.body.weight,
      totalCost: req.body.totalCost,
      rateId: req.body.rateId,
      categoryId: req.body.categoryId,
      subCategoryId: req.body.subCategoryId,
      userRef: userRef,
      warehouseImportId: req.body.warehouseImportId,
      warehouseExportId: req.body.warehouseExportId,
      packingId: req.body.packingId,
      brandingId: req.body.brandingId,
      arrivalDate: req.body.arrivalDate ? new Date(req.body.arrivalDate) : null,
      countryExportId: req.body.countryExportId,
      countryImportId: req.body.countryImportId,
      productQuantity: req.body.productQuantity,
     
    };
    console.log("SeaBooking Create request body:", payload);
    console.log("SeaBooking Create request files:", payloadFiles);
    const seaBookingResult = await SeaBookingService.createSeaBooking(payload, payloadFiles, tx);
    const resDoc = responseHandler(201, "SeaBooking Created successfully", seaBookingResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllSeaBookingByFilterWithPagination = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const userRef = req.user?.user_info_encrypted?.id?.toString() ?? null;
    const payload = {
      userRef: userRef,
      seaBookingStatus: req.query.seaBookingStatus as string,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      sortOrder: req.query.sortOrder === 'asc' ? 'asc' : 'desc',
    };
    const seaBookingResult = await SeaBookingService. getAllSeaBookingByFilterWithPagination(payload);
    const resDoc = responseHandler(200, "Get All SeaBookings", seaBookingResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSingleSeaBooking = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const seaBookingResult = await SeaBookingService.getSingleSeaBooking(id);
    const resDoc = responseHandler(201, "Single SeaBooking successfully", seaBookingResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateSeaBooking = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const payloadFiles = {
      files: req.files,
    };
    const payload = {
      seaBookingType: req?.body?.seaBookingType,
      link: req?.body?.link,
    };
    const seaBookingResult = await SeaBookingService.updateSeaBooking(id, payload, payloadFiles);
    const resDoc = responseHandler(201, "SeaBooking Update successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });
  deleteSeaBooking = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const seaBookingResult = await SeaBookingService.deleteSeaBooking(id);
    const resDoc = responseHandler(200, "SeaBooking Deleted successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });
}

export default new SeaBookingController();
