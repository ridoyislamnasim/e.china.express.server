// import { Request, Response, NextFunction } from 'express';
// import catchError from '../../middleware/errors/catchError';
// import { responseHandler } from '../../utils/responseHandler';
// import withTransaction from '../../middleware/transactions/withTransaction';
// import ChildCategoryService from './child.category.service';

// class ChildCategoryController {
//   createChildCategory = withTransaction(async (req: Request, res: Response, next: NextFunction, session: any) => {
//     const payloadFiles = {
//       files: req.files,
//     };
//     const payload = {
//       name: req.body.name,
//       status: typeof req.body.status === 'boolean' ? req.body.status : req.body.status === 'true' || req.body.status === true,
//       slug: req.body.slug,
//       viewType: req.body.viewType,
//       subCategoryRef: req.body.subCategoryRef,
//     };
//     const childCategoryResult = await ChildCategoryService.createChildCategory(
//       payloadFiles,
//       payload,
//       session
//     );
//     const resDoc = responseHandler(
//       201,
//       'ChildCategory Created successfully',
//       childCategoryResult
//     );
//     res.status(resDoc.statusCode).json(resDoc);
//   });

//   getAllChildCategory = catchError(async (req: Request, res: Response, next: NextFunction) => {
//     const payload = {
//       viewType: req.query.viewType,
//       limit: req.query.limit,
//     };
//     const childCategoryResult = await ChildCategoryService.getAllChildCategory(payload);
//     const resDoc = responseHandler(
//       200,
//       'Get All ChildCategorys',
//       childCategoryResult
//     );
//     res.status(resDoc.statusCode).json(resDoc);
//   });

//   getChildCategoryWithPagination = catchError(async (req: Request, res: Response, next: NextFunction) => {
//     let payload = {
//       page: req.query.page,
//       limit: req.query.limit,
//       order: req.query.order,
//     };
//     const childCategory = await ChildCategoryService.getChildCategoryWithPagination(
//       payload
//     );
//     const resDoc = responseHandler(
//       200,
//       'ChildCategorys get successfully',
//       childCategory
//     );
//     res.status(resDoc.statusCode).json(resDoc);
//   });

//   getSingleChildCategory = catchError(async (req: Request, res: Response, next: NextFunction) => {
//     const id = req.params.id;
//     const childCategoryResult = await ChildCategoryService.getSingleChildCategory(id);
//     const resDoc = responseHandler(
//       201,
//       'Single ChildCategory successfully',
//       childCategoryResult
//     );
//     res.status(resDoc.statusCode).json(resDoc);
//   });

//   getSingleChildCategoryWithSlug = catchError(async (req: Request, res: Response, next: NextFunction) => {
//     const slug = req.params.slug;
//     const childCategoryResult = await ChildCategoryService.getSingleChildCategoryWithSlug(slug);
//     const resDoc = responseHandler(
//       201,
//       'Single ChildCategory successfully',
//       childCategoryResult
//     );
//     res.status(resDoc.statusCode).json(resDoc);
//   });

//   updateChildCategory = withTransaction(async (req: Request, res: Response, next: NextFunction, session: any) => {
//     const id = req.params.id;
//     const payloadFiles = {
//       files: req?.files,
//     };
//     const payload = {
//       name: req.body.name,
//       status: typeof req.body.status === 'boolean' ? req.body.status : req.body.status === 'true' || req.body.status === true,
//       viewType: req.body.viewType,
//       subCategoryRef: req.body.subCategoryRef,
//     };
//     const childCategoryResult = await ChildCategoryService.updateChildCategory(
//       id,
//       payloadFiles,
//       payload,
//       session
//     );
//     const resDoc = responseHandler(201, 'ChildCategory Update successfully');
//     res.status(resDoc.statusCode).json(resDoc);
//   });

//   updateChildCategoryStatus = catchError(async (req: Request, res: Response, next: NextFunction) => {
//     const id = req.params.id;
//     const status = typeof req.query.status === 'boolean' ? req.query.status : req.query.status === 'true' || req.query.status === true;
//     const childCategoryResult = await ChildCategoryService.updateChildCategoryStatus(
//       id,
//       status
//     );
//     const resDoc = responseHandler(
//       201,
//       'ChildCategory Status Update successfully'
//     );
//     res.status(resDoc.statusCode).json(resDoc);
//   });

//   deleteChildCategory = catchError(async (req: Request, res: Response, next: NextFunction) => {
//     const id = req.params.id;
//     const childCategoryResult = await ChildCategoryService.deleteChildCategory(id);
//     const resDoc = responseHandler(200, 'ChildCategory Deleted successfully');
//     res.status(resDoc.statusCode).json(resDoc);
//   });
// }

// export default new ChildCategoryController();
