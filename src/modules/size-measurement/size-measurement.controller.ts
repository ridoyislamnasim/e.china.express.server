import { NextFunction, Request, Response } from "express";
import sizeMeasurementService from "./size-measurement.service";
import { responseHandler } from "../../utils/responseHandler";
import catchError from "../../middleware/errors/catchError";
import withTransaction from "../../middleware/transactions/withTransaction";

export default new (class SizeMeasurementController {
  getAllSizeMeasurementTypes = catchError(async (req: Request, res: Response) => {
    const allSizeMeasurementTypes = await sizeMeasurementService.getAllSizeMeasurementTypes();
    const resDoc = responseHandler(201, "All size-measurement types fetched successfully.", allSizeMeasurementTypes);
    res.status(resDoc.statusCode).json(resDoc);
  });

  createSizeMeasurementType = catchError(async (req: Request, res: Response) => {
    const { title } = req.body;
    const newSizeMeasurementType = await sizeMeasurementService.createSizeMeasurementType({ title });
    const resDoc = responseHandler(201, "New size-measurement type created successfully.", newSizeMeasurementType);
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateSizeMeasurementType = catchError(async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const { title, id } = req.body;
    const payload = { title, id };
    const updated = await sizeMeasurementService.updateSizeMeasurementType(slug, payload);
    const resDoc = responseHandler(200, "Size-measurement Type updated successfully.", updated);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSizeMeasurementTypesWithPagination = withTransaction(async (req: Request, res: Response, next: NextFunction) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const data = await sizeMeasurementService.getSizeMeasurementTypesWithPagination({ page, limit });

    const resDoc = responseHandler(200, "Size-measurement types retrieved successfully with pagination.", data);
    res.status(resDoc.statusCode).json(resDoc);
  });

  deleteSizeMeasurementType = catchError(async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const result = await sizeMeasurementService.deleteSizeMeasurementType(slug);

    const resDoc = responseHandler(200, "Size-measurement type deleted successfully.", result);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllSizeMeasurementTableView = catchError(async (req: Request, res: Response) => {
    const payload = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      order: (req.query.order as "asc" | "desc") || "desc",
    };
    const sizeMeasurements = await sizeMeasurementService.getAllSizeMeasurementTableView(payload);
    const resDoc = responseHandler(200, "All size-measurements fetched successfully.", sizeMeasurements);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSingleSizeMeasurementById = catchError(async (req: Request, res: Response) => {
    const id = req.params.id;
    const sizeMeasurement = await sizeMeasurementService.getSingleSizeMeasurementById(id);
    const resDoc = responseHandler(200, "Size-measurement fetched successfully.", sizeMeasurement);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllSizeMeasurementTitles = catchError(async (req: Request, res: Response) => {
    const getAllSizeMeasurements = await sizeMeasurementService.getAllSizeMeasurementTitles();
    const getAllSizeMeasurementsCount = await sizeMeasurementService.getAllSizeMeasurementsCount();
    const resDoc = responseHandler(201, "All size-measurements fetched successfully.", { data: getAllSizeMeasurements, count: getAllSizeMeasurementsCount });
    res.status(resDoc.statusCode).json(resDoc);
  });

  createSizeMeasurement = catchError(async (req: Request, res: Response) => {
    const newSizeMeasurement = await sizeMeasurementService.createSizeMeasurement(req.body);

    const resDoc = responseHandler(201, "New size-measurement created successfully.", newSizeMeasurement);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSizeMeasurementById = catchError(async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const sizeMeasurement = await sizeMeasurementService.getSizeMeasurementById(slug);
    const resDoc = responseHandler(200, "Size-measurement fetched successfully.", sizeMeasurement);
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateSizeMeasurement = catchError(async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const { title, description, sizeMeasurementTypeId, sizeMeasurementTypeTitle, id } = req.body;
    const payload = { title, description, sizeMeasurementTypeId, sizeMeasurementTypeTitle, id };
    const updated = await sizeMeasurementService.updateSizeMeasurement(slug, payload);

    const resDoc = responseHandler(200, "Size-measurement updated successfully.", updated);
    res.status(resDoc.statusCode).json(resDoc);
  });

  deleteSizeMeasurement = catchError(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    await sizeMeasurementService.deleteSizeMeasurement(id);

    const resDoc = responseHandler(200, `Size-measurement with id ${id} deleted successfully.`, null);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSizeMeasurementsWithPagination = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const data = await sizeMeasurementService.getSizeMeasurementsWithPagination({ page, limit }, tx);

    const resDoc = responseHandler(200, "Size-measurements retrieved successfully with pagination.", data);
    res.status(resDoc.statusCode).json(resDoc);
  });

  // addHelpfulCount = catchError(async (req: Request, res: Response) => {
  //   const { id } = req.body;
  //   // res.send(id)
  //   const result = await sizeMeasurementService.addHelpfulCount(id);

  //   const resDoc = responseHandler(200, "Size-measurement Counted as helpful.", result);
  //   res.status(resDoc.statusCode).json(resDoc);
  // });

  // addUnhelpfulCount = catchError(async (req: Request, res: Response) => {
  //   const { id } = req.body;
  //   // res.send(id)
  //   const result = await sizeMeasurementService.addUnhelpfulCount(id);

  //   const resDoc = responseHandler(200, "Size-measurement Counted as unhelpful.", result);
  //   res.status(resDoc.statusCode).json(resDoc);
  // });
})();
