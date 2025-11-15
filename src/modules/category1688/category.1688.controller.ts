import { Request, Response, NextFunction } from 'express';
import catchError from '../../middleware/errors/catchError';
import {responseHandler} from '../../utils/responseHandler';
import withTransaction from '../../middleware/transactions/withTransaction';
import Category1688Service from './category.1688.service';

export class Category1688Controller {
  createCategory1688 = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    const category1688Result = await Category1688Service.createCategory1688();
    const resDoc = responseHandler(
      201,
      'Category1688 Created successfully',
      category1688Result
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllCategory1688 = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const category1688Result = await Category1688Service.getAllCategory1688();
    const resDoc = responseHandler(200, 'Get All Category1688s', category1688Result);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getCategory1688WithPagination = catchError(async (req: Request, res: Response, next: NextFunction) => {
    let payload = {
      page: req.query.page,
      limit: req.query.limit,
      order: req.query.order,
    };
    const category1688 = await Category1688Service.getCategory1688WithPagination(payload);
    const resDoc = responseHandler(200, 'Category1688s get successfully', category1688);
    res.status(resDoc.statusCode).json(resDoc);
  });

  // Lightweight endpoint to fetch raw 1688 category data (no DB upsert)
  fetchCategory1688 = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.query.categoryId ? Number(req.query.categoryId) : req.body?.categoryId ? Number(req.body.categoryId) : undefined;
    const data = await Category1688Service.fetchCategoryFrom1688(categoryId);
    // data will contain { prepared, response }
    const resDoc = responseHandler(200, 'Fetched category data from 1688', data);
    res.status(resDoc.statusCode).json(resDoc);
  });


  getSingleCategory1688 = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug;
    const category1688Result = await Category1688Service.getSingleCategory1688(slug);
    const resDoc = responseHandler(
      201,
      'Single Category1688 successfully',
      category1688Result
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSingleCategory1688WithSlug = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug;
    const category1688Result = await Category1688Service.getSingleCategory1688WithSlug(slug);
    const resDoc = responseHandler(
      201,
      'Single Category1688 successfully',
      category1688Result
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getNavBar = catchError(async (req: Request, res: Response, next: NextFunction) => {
    console.log('Fetching Navbar Data...');
    const navBarResult = await Category1688Service.getNavBar();
    const resDoc = responseHandler(
      201,
      'Navbar successfully',
      navBarResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateCategory1688 = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug;
    const payloadFiles = {
      files: req.files,
    };
    const payload = {
      name: req.body.name,
      slug: req.body.slug,
      // subCategory1688Ref: req.body.subCategory1688Ref,
      status: typeof req.body.status === 'boolean' ? req.body.status : req.body.status === 'true' || req.body.status === true,
      colorCode: req.body.colorCode,
    };
    const category1688Result = await Category1688Service.updateCategory1688(
      slug,
      payloadFiles,
      payload
    );
    const resDoc = responseHandler(201, 'Category1688 Update successfully');
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateCategory1688Status = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug;
    const status = req.query.status;
    const category1688Result = await Category1688Service.updateCategory1688Status(
      slug,
      status
    );
    const resDoc = responseHandler(201, 'Category1688 Status Update successfully');
    res.status(resDoc.statusCode).json(resDoc);
  });

  deleteCategory1688 = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug;
    const category1688Result = await Category1688Service.deleteCategory1688(slug);
    const resDoc = responseHandler(200, 'Category1688 Deleted successfully');
    res.status(resDoc.statusCode).json(resDoc);
  });
}

export default new Category1688Controller();
