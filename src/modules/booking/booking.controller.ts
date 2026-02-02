import { Request, Response, NextFunction } from "express";
import catchError from "../../middleware/errors/catchError";
import { responseHandler } from "../../utils/responseHandler";
import withTransaction from "../../middleware/transactions/withTransaction";
import BookingService from "./booking.service";

class BookingController {
  createSupplierInformation = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {

    const userRef = req.user?.user_info_encrypted?.id?.toString() ?? null;
    const payload = {
      // supplier fields
      bookingId: req.body.bookingId ,
      supplierId: req.body.supplierId ,
      customerId: userRef ? Number(userRef) : undefined,
      supplierNo: req.body.supplierNo ,
      contact_person: req.body.contact_person ,
      supplierEmail: req.body.supplierEmail,
      supplierPhone: req.body.supplierPhone,
      supplierAddress: req.body.supplierAddress,
    };
    console.log("Booking Create request body:", payload);
    const BookingResult = await BookingService.createSupplierInformation(payload, tx);
    const resDoc = responseHandler(201, "Booking Created successfully", BookingResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  createBookingPackage = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {

    const userRef = req.user?.user_info_encrypted?.id?.toString() ?? null;
    const payload = {
      customerId: userRef ? Number(userRef) : undefined,
      bookingId: req.body.bookingId ,
      packageId: req.body.packageId ,
      quantity: req.body.quantity ,
    };
    console.log("Booking Create request body:", payload);
    const BookingResult = await BookingService.createBookingPackage(payload, tx);
    const resDoc = responseHandler(201, "Booking Created successfully", BookingResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllSupplierInformation = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const payload = {
      search: req.query.search as string,
    }
    const BookingResult = await BookingService.getAllSupplierInformation(payload);
    const resDoc = responseHandler(200, "Get All Supplier Information", BookingResult);
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
