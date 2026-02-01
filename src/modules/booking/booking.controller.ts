import { Request, Response, NextFunction } from "express";
import catchError from "../../middleware/errors/catchError";
import { responseHandler } from "../../utils/responseHandler";
import withTransaction from "../../middleware/transactions/withTransaction";
import BookingService from "./booking.service";

class BookingController {
  createBooking = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
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
    console.log("Booking Create request body:", payload);
    console.log("Booking Create request files:", payloadFiles);
    const BookingResult = await BookingService.createBooking(payload, payloadFiles, tx);
    const resDoc = responseHandler(201, "Booking Created successfully", BookingResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllBookingByFilterWithPagination = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const userRef = req.user?.user_info_encrypted?.id?.toString() ?? null;
    const payload = {
      userRef: userRef,
      BookingStatus: req.query.BookingStatus as string,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      order: req.query.order === 'asc' ? 'asc' : 'desc',
    };
    const BookingResult = await BookingService. getAllBookingByFilterWithPagination(payload);
    const resDoc = responseHandler(200, "Get All Bookings", BookingResult);
    res.status(resDoc.statusCode).json(resDoc);
  });


  getSingleBooking = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const BookingResult = await BookingService.getSingleBooking(id);
    const resDoc = responseHandler(201, "Single Booking successfully", BookingResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateBooking = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const payloadFiles = {
      files: req.files,
    };
    const payload = {
      BookingType: req?.body?.BookingType,
      link: req?.body?.link,
    };
    const BookingResult = await BookingService.updateBooking(id, payload, payloadFiles);
    const resDoc = responseHandler(201, "Booking Update successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });
  deleteBooking = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const BookingResult = await BookingService.deleteBooking(id);
    const resDoc = responseHandler(200, "Booking Deleted successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });
}

export default new BookingController();
