import { NextFunction, Request, Response } from "express";
import catchError from "../../middleware/errors/catchError";
import withTransaction from "../../middleware/transactions/withTransaction";
import { responseHandler } from "../../utils/responseHandler";
import packageService from "./package.service";

class PackageController {
  createPackage = withTransaction(
    async (req: Request, res: Response, next: NextFunction, tx: any) => {
      const payloadFiles = {
        files: req.files,
      };
      const {
        type,
        name,
        size,
        weight,
        volume,
        cbm,
        thin,
        category,
        episodes,
        metadata,
        price,
        status,
      } = req.body;

      const payload = {
        type,
        name,
        size,
        weight,
        volume,
        cbm,
        thin,
        category,
        episodes,
        metadata,
        price,
        status: status || "ACTIVE",
      };

      const packageResult = await packageService.createPackage(
        payloadFiles,
        payload,
        tx,
      );
      const resDoc = responseHandler(
        201,
        "Package created successfully",
        packageResult,
      );
      res.status(resDoc.statusCode).json(resDoc);
    },
  );

  getAllPackages = catchError(async (req: Request, res: Response) => {
    const payload = {
      type: req.query.type as string,
      status: req.query.status as string,
      search: req.query.search as string,
    };
    const packages = await packageService.getAllPackages(payload);
    const resDoc = responseHandler(200, "Get all packages", packages);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllPackagesByGroup = catchError(async (req: Request, res: Response) => {
    const payload = {
      type: req.query.type as string,
    };
    const packages = await packageService.getAllPackagesGrouped(payload);
    const resDoc = responseHandler(
      200,
      "Get all packages grouped by type",
      packages,
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getPackagesWithPagination = catchError(
    async (req: Request, res: Response) => {
      const payload = {
        type: req.query.type as string,
        status: req.query.status as string,
        search: req.query.search as string,
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        order: (req.query.order as string) || "desc",
        sortBy: (req.query.sortBy as string) || "createdAt",
      };
      const packages = await packageService.getPackagesWithPagination(payload);
      const resDoc = responseHandler(
        200,
        "Packages retrieved successfully",
        packages,
      );
      res.status(resDoc.statusCode).json(resDoc);
    },
  );

  getPackagesByType = catchError(async (req: Request, res: Response) => {
    const type = req.params.type;
    const payload = {
      type,
      status: req.query.status as string,
    };
    const packages = await packageService.getPackagesByType(payload);
    const resDoc = responseHandler(
      200,
      `Packages of type ${type} retrieved`,
      packages,
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getPackagesByStatus = catchError(async (req: Request, res: Response) => {
    const status = req.params.status as string;
    const packages = await packageService.getPackagesByStatus(status);
    const resDoc = responseHandler(
      200,
      `Packages with status ${status} retrieved`,
      packages,
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSinglePackage = catchError(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const packageData = await packageService.getSinglePackage(id);
    const resDoc = responseHandler(
      200,
      "Package retrieved successfully",
      packageData,
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  updatePackage = catchError(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    // Handle file upload if exists
    const payloadFiles = {
      files: req.files,
    };

    // Prepare payload from FormData
    const {
      type,
      name,
      size,
      weight,
      volume,
      cbm,
      thin,
      category,
      episodes,
      metadata,
      price,
      status,
    } = req.body;

    const payload = {
      type: type ?? undefined,
      name: name ?? undefined,
      size: size ?? undefined,
      weight: weight ?? undefined,
      volume: volume ?? undefined,
      cbm: cbm ?? undefined,
      thin: thin ?? undefined,
      category: category ?? undefined,
      episodes: episodes ?? undefined,
      metadata: metadata ?? undefined,
      price: price ?? undefined,
      status: status ?? undefined,
    };

    // Call service with files and payload
    const packageData = await packageService.updatePackage(
      id,
      payloadFiles,
      payload,
    );
    const resDoc = responseHandler(
      200,
      "Package updated successfully",
      packageData,
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  updatePackageStatus = catchError(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const status = req.body.status;
    const packageData = await packageService.updatePackageStatus(id, status);
    const resDoc = responseHandler(
      200,
      "Package status updated successfully",
      packageData,
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  deletePackage = catchError(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await packageService.deletePackage(id);
    const resDoc = responseHandler(200, "Package deleted successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });
}

export default new PackageController();
