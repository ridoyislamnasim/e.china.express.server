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

    getAllCategory1688ForAgent = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const category1688Result = await Category1688Service.getAllCategory1688ForAgent();
    const resDoc = responseHandler(200, 'Get All Category1688s', category1688Result);
    res.status(resDoc.statusCode).json(resDoc);
  });

    getCategoryIdBySubcategoryForAgent = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { categoryId } = req.params;
   const payload ={
      categoryId: Number(categoryId)
   }
   const category1688Result = await Category1688Service.getCategoryIdBySubcategoryForAgent(payload);
    const resDoc = responseHandler(200, 'Get Category1688 by Subcategory', category1688Result);
    res.status(resDoc.statusCode).json(resDoc);
  });


  getCategoryIdBySubcategory = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { categoryId } = req.params;
   const payload ={
      categoryId: Number(categoryId)
   }
   const category1688Result = await Category1688Service.getCategoryIdBySubcategory(payload);
    const resDoc = responseHandler(200, 'Get Category1688 by Subcategory', category1688Result);
    res.status(resDoc.statusCode).json(resDoc);
  });
  
  getAllCategory1688ForRateCalculation = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const category1688Result = await Category1688Service.getAllCategory1688ForRateCalculation();
    const resDoc = responseHandler(200, 'Get All Category1688s for Rate Calculation', category1688Result);
    res.status(resDoc.statusCode).json(resDoc);
  });

  addCategoryForRateCalculation = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { categoryId } = req.params;
    console.log('Received categoryId in controller:', categoryId);
   const payload ={
      categoryId: Number(categoryId)
   }
   const category1688Result = await Category1688Service.addCategoryForRateCalculation(payload);
    const resDoc = responseHandler(200, 'Category added for rate calculation', category1688Result);
    res.status(resDoc.statusCode).json(resDoc);
  });


    // HS Code Entry Handlers
  createHsCodeEntryByCategoryId = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { globalHsCodes, chinaHsCodes, globalMaterialComment, countryHsCode } = req.body;
    const payload = {
      id: Number(id),
      globalHsCodes,
      chinaHsCodes,
      globalMaterialComment,
      countryHsCode: countryHsCode ?? []
   }
    const hsCodeEntryResult = await Category1688Service.createHsCodeEntryByCategoryId(payload);
    const resDoc = responseHandler(201, 'HS Code Entry Created successfully', hsCodeEntryResult);
    res.status(resDoc.statusCode).json(resDoc);
  });
  getHsCodeEntryByCategoryId = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const payload = {
      id: Number(id)
   }
    const hsCodeEntryResult = await Category1688Service.getHsCodeEntryByCategoryId(payload);
    const resDoc = responseHandler(200, 'Get HS Code Entry by Category ID', hsCodeEntryResult);
    res.status(resDoc.statusCode).json(resDoc);
  });




   }


export default new Category1688Controller();
