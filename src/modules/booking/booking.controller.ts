import { Request, Response, NextFunction } from "express";
import catchError from "../../middleware/errors/catchError";
import { responseHandler } from "../../utils/responseHandler";
import withTransaction from "../../middleware/transactions/withTransaction";
import BookingService from "./booking.service";

class BookingController {
  createSupplierInformation = withTransaction(
    async (req: Request, res: Response, next: NextFunction, tx: any) => {
      const userRef = req.user?.user_info_encrypted?.id?.toString() ?? null;
      const payload = {
        // supplier fields
        bookingId: req.body.bookingId,
        supplierId: req.body.supplierId,
        customerId: userRef ? Number(userRef) : undefined,
        supplierNo: req.body.supplierNo,
        contact_person: req.body.contact_person,
        supplierEmail: req.body.supplierEmail,
        supplierPhone: req.body.supplierPhone,
        supplierAddress: req.body.supplierAddress,
      };
      console.log("Booking Create request body:", payload);
      const BookingResult = await BookingService.createSupplierInformation(
        payload,
        tx,
      );
      const resDoc = responseHandler(
        201,
        "Booking Created successfully",
        BookingResult,
      );
      res.status(resDoc.statusCode).json(resDoc);
    },
  );

  createBookingPackage = withTransaction(
    async (req: Request, res: Response, next: NextFunction, tx: any) => {
      const userRef = req.user?.user_info_encrypted?.id?.toString() ?? null;
      const payload = {
        customerId: userRef ? Number(userRef) : undefined,
        bookingId: req.body.bookingId,
        packageId: req.body.packageId,
        quantity: req.body.quantity,
      };
      console.log("Booking Create request body:", payload);
      const BookingResult = await BookingService.createBookingPackage(
        payload,
        tx,
      );
      const resDoc = responseHandler(
        201,
        "Booking Created successfully",
        BookingResult,
      );
      res.status(resDoc.statusCode).json(resDoc);
    },
  );

  updateBookingTrackingNumberByCustomer = withTransaction(
    async (req: Request, res: Response, next: NextFunction, tx: any) => {
      const userRef = req.user?.user_info_encrypted?.id?.toString() ?? null;
      const payload = {
        customerId: userRef ? Number(userRef) : undefined,
        bookingId: req.body.bookingId,
        trackingNumber: req.body.trackingNumber,
      };
      console.log("Booking Update Tracking Number request body:", payload);
      const BookingResult =
        await BookingService.updateBookingTrackingNumberByCustomer(payload, tx);
      const resDoc = responseHandler(
        201,
        "Booking Tracking Number Updated successfully",
        BookingResult,
      );
      res.status(resDoc.statusCode).json(resDoc);
    },
  );

  updateBookingInvoiceByCustomer = withTransaction(
    async (req: Request, res: Response, next: NextFunction, tx: any) => {
      const userRef = req.user?.user_info_encrypted?.id?.toString() ?? null;
      const payload = {
        customerId: userRef ? Number(userRef) : undefined,
        bookingId: req.body.bookingId,
      };
      const payloadFiles = {
        files: req.files,
      };
      console.log("Booking Update Invoice request body:", payload);
      const BookingResult = await BookingService.updateBookingInvoiceByCustomer(
        payload,
        payloadFiles,
        tx,
      );
      const resDoc = responseHandler(
        201,
        "Booking Invoice Updated successfully",
        BookingResult,
      );
      res.status(resDoc.statusCode).json(resDoc);
    },
  );

  updateBookingProductByCustomer = withTransaction(
    async (req: Request, res: Response, next: NextFunction, tx: any) => {
      const userRef = req.user?.user_info_encrypted?.id?.toString() ?? null;
      const payload = {
        customerId: userRef ? Number(userRef) : undefined,
        bookingId: req.body.bookingId,
      };
      const payloadFiles = {
        files: req.files,
      };
      console.log("Booking Update Product request body:", payload);
      const BookingResult = await BookingService.updateBookingProductByCustomer(
        payload,
        payloadFiles,
        tx,
      );
      const resDoc = responseHandler(
        201,
        "Booking Product Updated successfully",
        BookingResult,
      );
      res.status(resDoc.statusCode).json(resDoc);
    },
  );

  updateBookingPackingListByCustomer = withTransaction(
    async (req: Request, res: Response, next: NextFunction, tx: any) => {
      const userRef = req.user?.user_info_encrypted?.id?.toString() ?? null;
      const payload = {
        customerId: userRef ? Number(userRef) : undefined,
        bookingId: req.body.bookingId,
        packingList: req.body.packingList,
      };
      const payloadFiles = {
        files: req.files,
      };
      console.log("Booking Update Packing List request body:", payload);
      const BookingResult =
        await BookingService.updateBookingPackingListByCustomer(
          payload,
          payloadFiles,
          tx,
        );
      const resDoc = responseHandler(
        201,
        "Booking Packing List Updated successfully",
        BookingResult,
      );
      res.status(resDoc.statusCode).json(resDoc);
    },
  );

  findBookingForWarehouseByTrackingNumberAndOrderNumber = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
      const payload = {
        query: req.query.query as string,
      };
      console.log("Find Booking for Warehouse request query:", payload);
      const BookingResult =
        await BookingService.findBookingForWarehouseByTrackingNumberAndOrderNumber(
          payload,
        );
      const resDoc = responseHandler(
        200,
        "Find Booking for Warehouse successfully",
        BookingResult,
      );
      res.status(resDoc.statusCode).json(resDoc);
    },
  );

  createInventoryStoredByWarehouse = withTransaction(
    async (req: Request, res: Response, next: NextFunction, tx: any) => {
      const userRef = req.user?.user_info_encrypted?.id?.toString() ?? null;
      console.log("Create Inventory Stored by Warehouse request body (raw):", req.body);
      console.log("Create Inventory Stored by Warehouse request body (raw):", req.body.cartons);

      // Helper to safely parse numbers from multipart/form-data (all fields are strings)
      const toNumber = (v: any) => (v === undefined || v === null || v === '' ? undefined : Number(v));
      const toFloat = (v: any) => (v === undefined || v === null || v === '' ? undefined : parseFloat(v));

      // parse cartons if sent as JSON string
      let parsedCartons: any[] | undefined = undefined;
      if (req.body?.cartons) {
        try {
          parsedCartons = typeof req.body.cartons === 'string' ? JSON.parse(req.body.cartons) : req.body.cartons;
          if (!Array.isArray(parsedCartons)) parsedCartons = undefined;
          else {
            parsedCartons = parsedCartons.map((c: any) => ({
              width: c?.width !== null && c?.width !== undefined && c.width !== '' ? Number(c.width) : null,
              height: c?.height !== null && c?.height !== undefined && c.height !== '' ? Number(c.height) : null,
              length: c?.length !== null && c?.length !== undefined && c.length !== '' ? Number(c.length) : null,
            }));
          }
        } catch (e) {
          parsedCartons = undefined;
        }
      }

      const payload = {
        bookingId: toNumber(req.body.bookingId),
        warehouseId: req.body.warehouseId,
        agentId: toNumber(req.body.agentId),
        customerId: toNumber(req.body.customerId),
        shippingMark: req.body.shippingMark,
        quantity: toNumber(req.body.quantity),
        totalWeightkg: toFloat(req.body.totalWeightkg),
        productType: req.body.productType,
        packagingCharge: toFloat(req.body.packagingCharge),
        shippingRate: toFloat(req.body.shippingRate),
        warehouseReceivingNote: req.body.warehouseReceivingNote,
        orderNumber: req.body.orderNumber,
        trackingNumber: req.body.trackingNumber,
        cartons: parsedCartons,
      };

      console.log("Create Inventory Stored by Warehouse (parsed) request body:", payload);
      const BookingResult = await BookingService.createInventoryStoredByWarehouse(payload, req.files, tx); 

      // NOTE: booking service method not implemented here — return parsed payload so client validation passes for now
      const resDoc = responseHandler(201, "Inventory Receipt received", payload);
      res.status(resDoc.statusCode).json(resDoc);
    },
  );

  createInventoryReceiptByWarehouse = withTransaction(
    async (req: Request, res: Response, next: NextFunction, tx: any) => {
      const userRef = req.user?.user_info_encrypted?.id?.toString() ?? null;
      console.log("Create Inventory Receipt by Warehouse request body (raw):", req.body);
      console.log("Create Inventory Receipt by Warehouse request body (raw):", req.body.cartons);
      // Helper to safely parse numbers from multipart/form-data (all fields are strings)
      const toNumber = (v: any) => (v === undefined || v === null || v === '' ? undefined : Number(v));
      const toFloat = (v: any) => (v === undefined || v === null || v === '' ? undefined : parseFloat(v));
      // parse cartons if sent as JSON string
      let parsedCartons: any[] | undefined = undefined;
      if (req.body?.cartons) {
        try {
          parsedCartons = typeof req.body.cartons === 'string' ? JSON.parse(req.body.cartons) : req.body.cartons;
          if (!Array.isArray(parsedCartons)) parsedCartons = undefined;
          else {
            parsedCartons = parsedCartons.map((c: any) => ({
              width: c?.width !== null && c?.width !== undefined && c.width !== '' ? Number(c.width) : null,
              height: c?.height !== null && c?.height !== undefined && c.height !== '' ? Number(c.height) : null,
              length: c?.length !== null && c?.length !== undefined && c.length !== '' ? Number(c.length) : null,
            }));
          }
        } catch (e) {
          parsedCartons = undefined;
        }
      }
      const payload = {
        warehouseId: req.body.warehouseId,
        bookingId: toNumber(req.body.bookingId),
        agentId: toNumber(req.body.agentId),
        customerId: toNumber(req.body.customerId),
        shippingMark: req.body.shippingMark,

        cartonQuantity: toNumber(req.body.cartonQuantity),
        quantity: toNumber(req.body.quantity),
        totalWeightkg: toFloat(req.body.totalWeightkg),
        productType: req.body.productType,
        packagingCharge: toFloat(req.body.packagingCharge),
        shippingRate: toFloat(req.body.shippingRate),
        warehouseReceivingNote: req.body.warehouseReceivingNote,
        orderNumber: req.body.orderNumber,
        trackingNumber: req.body.trackingNumber,
        cartons: parsedCartons,
      };
      console.log("Create Inventory Receipt by Warehouse (parsed) request body:", payload);
      const BookingResult = await BookingService.createInventoryReceiptByWarehouse(payload, req.files, tx);
      // NOTE: booking service method not implemented here — return parsed payload so client validation passes for now
      const resDoc = responseHandler(201, "Inventory Receipt received", payload);
      res.status(resDoc.statusCode).json(resDoc);
    },
  );

  updateBookingApprovedRejectByAdmin = withTransaction(
    async (req: Request, res: Response, next: NextFunction, tx: any) => {
      const payload = {
        adminId: req.user?.user_info_encrypted?.id
          ? Number(req.user.user_info_encrypted.id)
          : undefined,
        status: req.body.status,
        adminRemarks: req.body.adminRemarks,
      };
      const BookingResult =
        await BookingService.updateBookingApprovedRejectByAdmin(
          req.params.id as string,
          payload,
          tx,
        );
      const resDoc = responseHandler(
        201,
        "Booking Status Updated successfully",
        BookingResult,
      );
      res.status(resDoc.statusCode).json(resDoc);
    },
  );

  getAllSupplierInformation = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
      const payload = {
        search: req.query.search as string,
      };
      const BookingResult =
        await BookingService.getAllSupplierInformation(payload);
      const resDoc = responseHandler(
        200,
        "Get All Supplier Information",
        BookingResult,
      );
      res.status(resDoc.statusCode).json(resDoc);
    },
  );

  getAllBookingByFilterWithPagination = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
      const userRef = req.user?.user_info_encrypted?.id?.toString() ?? null;
      const payload = {
        userRef: userRef,
        bookingStatus: req.query.bookingStatus as string,
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        order: req.query.order === "asc" ? "asc" : "desc",
      };
      const BookingResult =
        await BookingService.getAllBookingByFilterWithPagination(payload);
      const resDoc = responseHandler(200, "Get All Bookings", BookingResult);
      res.status(resDoc.statusCode).json(resDoc);
    },
  );

  getAllBookingForWarehouseByFilterWithPagination = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
      const userRef = req.user?.user_info_encrypted?.id?.toString() ?? null;
      const payload = {
        userRef: userRef,
        mode: req.query.mode as string,
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        order: req.query.order === "asc" ? "asc" : "desc",
      };
      const BookingResult =await BookingService.getAllBookingForWarehouseByFilterWithPagination(
          payload,
        );
      const resDoc = responseHandler(200, "Get All Bookings", BookingResult);
      res.status(resDoc.statusCode).json(resDoc);
    },
  );

  getAllBookingForAdminByFilterWithPagination = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
      const userRef = req.user?.user_info_encrypted?.id?.toString() ?? null;
      const payload = {
        userRef: userRef,
        bookingStatus: req.query.bookingStatus as string,
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        order: req.query.order === "asc" ? "asc" : "desc",
      };
      const BookingResult =
        await BookingService.getAllBookingForAdminByFilterWithPagination(
          payload,
        );
      const resDoc = responseHandler(200, "Get All Bookings", BookingResult);
      res.status(resDoc.statusCode).json(resDoc);
    },
  );

  getSingleBooking = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = req.params.id as string;
      const BookingResult = await BookingService.getSingleBooking(id);
      const resDoc = responseHandler(
        201,
        "Single Booking successfully",
        BookingResult,
      );
      res.status(resDoc.statusCode).json(resDoc);
    },
  );

  updateBooking = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = req.params.id as string;
      const payloadFiles = {
        files: req.files,
      };
      const payload = {
        BookingType: req?.body?.BookingType,
        link: req?.body?.link,
      };
      const BookingResult = await BookingService.updateBooking(
        id,
        payload,
        payloadFiles,
      );
      const resDoc = responseHandler(201, "Booking Update successfully");
      res.status(resDoc.statusCode).json(resDoc);
    },
  );
  deleteBooking = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = req.params.id as string;
      const BookingResult = await BookingService.deleteBooking(id);
      const resDoc = responseHandler(200, "Booking Deleted successfully");
      res.status(resDoc.statusCode).json(resDoc);
    },
  );
}

export default new BookingController();
