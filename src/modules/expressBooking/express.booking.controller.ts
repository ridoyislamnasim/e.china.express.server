import { Request, Response, NextFunction } from "express";
import catchError from "../../middleware/errors/catchError";
import { responseHandler } from "../../utils/responseHandler";
import withTransaction from "../../middleware/transactions/withTransaction";
import ExpressBookingService from "./express.booking.service";

class ExpressBookingController {
  createExpressBooking = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    const payloadFiles = {
      files: req.files,
    };
    const userRef = req.user?.user_info_encrypted?.id?.toString() ?? null;
    const payload = {
      cartonQuantity: req.body.cartonQuantity,
      
      shippingRateId: req.body.shippingRateId,
      importCountryId: req.body.importCountryId,
      exportCountryId: req.body.exportCountryId,
      shippingMethodId: req.body.shippingMethodId,
      weight: req.body.weight,
      totalCost: req.body.totalCost,
      rateId: req.body.rateId,
      categoryId: req.body.categoryId,
      userRef: userRef,
      warehouseImportId: req.body.warehouseImportId,
      warehouseExportId: req.body.warehouseExportId,
      packingId: req.body.packingId,
      brandingId: req.body.brandingId,
      arrivalDate: req.body.arrivalDate ? new Date(req.body.arrivalDate) : null,
      countryExportId: req.body.countryExportId,
      countryImportId: req.body.countryImportId,
      productQuantity: req.body.productQuantity,

      // variants
      variants: req.body.variants ? JSON.parse(req.body.variants) : undefined,
     
    };
    console.log("ExpressBooking Create request body:", payload);
    console.log("ExpressBooking Create request files:", payloadFiles);
    const expressBookingResult = await ExpressBookingService.createExpressBooking(payload, payloadFiles, tx);
    const resDoc = responseHandler(201, "ExpressBooking Created successfully", expressBookingResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllExpressBookingByFilterWithPagination = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const userRef = req.user?.user_info_encrypted?.id?.toString() ?? null;
    const payload = {
      userRef: userRef,
      expressBookingStatus: req.query.expressBookingStatus as string,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      sortOrder: req.query.sortOrder === 'asc' ? 'asc' : 'desc',
    };
    const expressBookingResult = await ExpressBookingService. getAllExpressBookingByFilterWithPagination(payload);
    const resDoc = responseHandler(200, "Get All ExpressBookings", expressBookingResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSingleExpressBooking = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const expressBookingResult = await ExpressBookingService.getSingleExpressBooking(id);
    const resDoc = responseHandler(201, "Single ExpressBooking successfully", expressBookingResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateExpressBooking = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const payloadFiles = {
      files: req.files,
    };
    const payload = {
      expressBookingType: req?.body?.expressBookingType,
      link: req?.body?.link,
    };
    const expressBookingResult = await ExpressBookingService.updateExpressBooking(id, payload, payloadFiles);
    const resDoc = responseHandler(201, "ExpressBooking Update successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });
  deleteExpressBooking = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const expressBookingResult = await ExpressBookingService.deleteExpressBooking(id);
    const resDoc = responseHandler(200, "ExpressBooking Deleted successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });
}

export default new ExpressBookingController();
