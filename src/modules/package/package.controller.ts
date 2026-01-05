import { Request, Response, NextFunction } from 'express';
import catchError from '../../middleware/errors/catchError';
import { responseHandler } from '../../utils/responseHandler';
import withTransaction from '../../middleware/transactions/withTransaction';
import packageService from './package.service';

class PackageController {
  createPackage = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    const payload = {
      type: req.body.type,
      image: req.body.image,
      name: req.body.name,
      size: req.body.size,
      weight: req.body.weight,
      volume: req.body.volume,
      cbm: req.body.cbm,
      thin: req.body.thin,
      category: req.body.category,
      episodes: req.body.episodes,
      metadata: req.body.metadata,
      price: req.body.price,
      status: req.body.status || 'ACTIVE',
    };
    const packageResult = await packageService.createPackage(payload);
    const resDoc = responseHandler(
      201,
      'Package created successfully',
      packageResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllPackages = catchError(async (req: Request, res: Response) => {
    const payload = {
      type: req.query.type as string,
      status: req.query.status as string,
      search: req.query.search as string,
    };
    const packages = await packageService.getAllPackages(payload);
    const resDoc = responseHandler(200, 'Get all packages', packages);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getPackagesWithPagination = catchError(async (req: Request, res: Response) => {
    const payload = {
      type: req.query.type as string,
      status: req.query.status as string,
      search: req.query.search as string,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      order: req.query.order as string || 'desc',
      sortBy: req.query.sortBy as string || 'createdAt',
    };
    const packages = await packageService.getPackagesWithPagination(payload);
    const resDoc = responseHandler(200, 'Packages retrieved successfully', packages);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getPackagesByType = catchError(async (req: Request, res: Response) => {
    const type = req.params.type;
    const payload = {
      type,
      status: req.query.status as string,
    };
    const packages = await packageService.getPackagesByType(payload);
    const resDoc = responseHandler(200, `Packages of type ${type} retrieved`, packages);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getPackagesByStatus = catchError(async (req: Request, res: Response) => {
    const status = req.params.status;
    const packages = await packageService.getPackagesByStatus(status);
    const resDoc = responseHandler(200, `Packages with status ${status} retrieved`, packages);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSinglePackage = catchError(async (req: Request, res: Response) => {
    const id = req.params.id;
    const packageData = await packageService.getSinglePackage(id);
    const resDoc = responseHandler(
      200,
      'Package retrieved successfully',
      packageData
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  updatePackage = catchError(async (req: Request, res: Response) => {
    const id = req.params.id;
    const payload = {
      type: req.body.type,
      image: req.body.image,
      name: req.body.name,
      size: req.body.size,
      weight: req.body.weight,
      volume: req.body.volume,
      cbm: req.body.cbm,
      thin: req.body.thin,
      category: req.body.category,
      episodes: req.body.episodes,
      metadata: req.body.metadata,
      price: req.body.price,
      status: req.body.status,
    };
    const packageData = await packageService.updatePackage(id, payload);
    const resDoc = responseHandler(
      200,
      'Package updated successfully',
      packageData
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  updatePackageStatus = catchError(async (req: Request, res: Response) => {
    const id = req.params.id;
    const status = req.body.status;
    const packageData = await packageService.updatePackageStatus(id, status);
    const resDoc = responseHandler(
      200,
      'Package status updated successfully',
      packageData
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  deletePackage = catchError(async (req: Request, res: Response) => {
    const id = req.params.id;
    await packageService.deletePackage(id);
    const resDoc = responseHandler(200, 'Package deleted successfully');
    res.status(resDoc.statusCode).json(resDoc);
  });
}

export default new PackageController();