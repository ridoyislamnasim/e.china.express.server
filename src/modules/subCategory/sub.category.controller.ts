import { Request, Response, NextFunction } from 'express';
import catchError from '../../middleware/errors/catchError';
import {responseHandler} from '../../utils/responseHandler';
import withTransaction from '../../middleware/transactions/withTransaction';
import SubCategoryService from './sub.category.service';

class SubCategoryController {
  createSubCategory = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    const payloadFiles = {
      files: req.files,
    };
    const payload = {
      name: req.body.name,
      status: Boolean(req.body.status),
      slug: req.body.slug,
      categoryRef: Number(req.body.categoryRef) ,
    };
    const subCategoryResult = await SubCategoryService.createSubCategory(
      payloadFiles,
      payload,
      tx
    );
    const resDoc = responseHandler(
      201,
      'SubCategory Created successfully',
      subCategoryResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllSubCategory = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const subCategoryResult = await SubCategoryService.getAllSubCategory();
    const resDoc = responseHandler(
      200,
      'Get All SubCategorys',
      subCategoryResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSubCategoryWithPagination = catchError(async (req: Request, res: Response, next: NextFunction) => {
    let payload = {
      page: req.query.page,
      limit: req.query.limit,
      order: req.query.order,
    };
    const subCategory = await SubCategoryService.getSubCategoryWithPagination(
      payload
    );
    const resDoc = responseHandler(
      200,
      'SubCategorys get successfully',
      subCategory
    );
    res.status(resDoc.statusCode).json(resDoc);
  });
       
  getSingleSubCategory = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug;
    const subCategoryResult = await SubCategoryService.getSingleSubCategory(slug);
    const resDoc = responseHandler(
      201,
      'Single SubCategory successfully',
      subCategoryResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });


  updateSubCategory = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug;
    const payloadFiles = {
      files: req?.files,
    };
    const payload = {
      name: req.body.name,
      status: typeof req.body.status === 'boolean' ? req.body.status : req.body.status === 'true' || req.body.status === true,
      categoryRef: Number(req.body.categoryRef),
    };
    const subCategoryResult = await SubCategoryService.updateSubCategory(
      slug,
      payloadFiles,
      payload
    );
    const resDoc = responseHandler(201, 'SubCategory Update successfully');
    res.status(resDoc.statusCode).json(resDoc);
  });

//   updateSubCategoryStatus = catchError(async (req: Request, res: Response, next: NextFunction) => {
//     const slug = req.params.slug;
//     const status = req.query.status === 'true' ? true : req.query.status === 'false' ? false : true;
//     const subCategoryResult = await SubCategoryService.updateSubCategoryStatus(
//       slug,
//       status
//     );
//     const resDoc = responseHandler(
//       201,
//       'SubCategory Status Update successfully'
//     );
//     res.status(resDoc.statusCode).json(resDoc);
//   });

  deleteSubCategory = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug;
    const subCategoryResult = await SubCategoryService.deleteSubCategory(slug);
    const resDoc = responseHandler(200, 'SubCategory Deleted successfully');
    res.status(resDoc.statusCode).json(resDoc);
  });
}

export default new SubCategoryController();
