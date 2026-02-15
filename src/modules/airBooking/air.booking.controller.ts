import { Request, Response, NextFunction } from "express";
import catchError from "../../middleware/errors/catchError";
import { responseHandler } from "../../utils/responseHandler";
import withTransaction from "../../middleware/transactions/withTransaction";
import AirBookingService from "./air.booking.service";

class AirBookingController {
  createAirBooking = withTransaction(
    async (req: Request, res: Response, next: NextFunction, tx: any) => {
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
        arrivalDate: req.body.arrivalDate
          ? new Date(req.body.arrivalDate)
          : null,
        countryExportId: req.body.countryExportId,
        countryImportId: req.body.countryImportId,
        productQuantity: req.body.productQuantity,
      };
      console.log("AirBooking Create request body:", payload);
      console.log("AirBooking Create request files:", payloadFiles);
      const airBookingResult = await AirBookingService.createAirBooking(
        payload,
        payloadFiles,
        tx,
      );
      const resDoc = responseHandler(
        201,
        "AirBooking Created successfully",
        airBookingResult,
      );
      res.status(resDoc.statusCode).json(resDoc);
    },
  );

  getAllAirBookingByFilterWithPagination = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
      const userRef = req.user?.user_info_encrypted?.id?.toString() ?? null;
      const payload = {
        userRef: userRef,
        airBookingStatus: req.query.airBookingStatus as string,
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        sortOrder: req.query.sortOrder === "asc" ? "asc" : "desc",
      };
      const airBookingResult =
        await AirBookingService.getAllAirBookingByFilterWithPagination(payload);
      const resDoc = responseHandler(
        200,
        "Get All AirBookings",
        airBookingResult,
      );
      res.status(resDoc.statusCode).json(resDoc);
    },
  );

  getSingleAirBooking = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = req.params.id as string;
      const airBookingResult = await AirBookingService.getSingleAirBooking(id);
      const resDoc = responseHandler(
        201,
        "Single AirBooking successfully",
        airBookingResult,
      );
      res.status(resDoc.statusCode).json(resDoc);
    },
  );

  updateAirBooking = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = req.params.id as string;
      const payloadFiles = {
        files: req.files,
      };
      const payload = {
        airBookingType: req?.body?.airBookingType,
        link: req?.body?.link,
      };
      const airBookingResult = await AirBookingService.updateAirBooking(
        id,
        payload,
        payloadFiles,
      );
      const resDoc = responseHandler(201, "AirBooking Update successfully");
      res.status(resDoc.statusCode).json(resDoc);
    },
  );
  deleteAirBooking = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = req.params.id as string;
      const airBookingResult = await AirBookingService.deleteAirBooking(id);
      const resDoc = responseHandler(200, "AirBooking Deleted successfully");
      res.status(resDoc.statusCode).json(resDoc);
    },
  );
}

export default new AirBookingController();
