// AuthController (TypeScript version)
import { Request, Response, NextFunction } from 'express';
import { responseHandler } from '../../utils/responseHandler';
import { RateService } from './rate.service';
import rateRepository from './rate.repository';
import catchError from '../../middleware/errors/catchError';
import withTransaction from '../../middleware/transactions/withTransaction';
import withBalkTransaction from '../../middleware/transactions/withBalkTransaction';
const rateService = new RateService(rateRepository);


class RateController {
  createRate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { price, weightCategoryId, shippingMethodId, category1688Id, importCountryId, exportCountryId } = req.body;
      const payload = {
        price: Number(price),
         weightCategoryId: Number(weightCategoryId), 
         shippingMethodId: Number(shippingMethodId), 
         category1688Id: Number(category1688Id), 
         importCountryId: Number(importCountryId), 
         exportCountryId: Number(exportCountryId)
      };
      const shippingMethod = await rateService.createRate(payload);
      const resDoc = responseHandler(201, 'Rate created successfully', shippingMethod);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };


  getAllRate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rates = await rateService.getAllRate();
      const resDoc = responseHandler(200, 'Rates retrieved successfully', rates);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  }

  findRateByCriteria = catchError(async (req: Request, res: Response, next: NextFunction) => {
    console.log("req.body", req.body);
    const { importCountryId, exportCountryId, weight, shippingMethodId, category1688Id } = req.body;
    const payload: any = {
      importCountryId,
      exportCountryId,
      weight,
      shippingMethodId,
      category1688Id
    };
    const rates = await rateService.findRateByCriteria(payload);
    const resDoc = responseHandler(200, 'Rates retrieved successfully', rates);
    res.status(resDoc.statusCode).json(resDoc);
  })


    findBookingShippingRate = catchError(async (req: Request, res: Response, next: NextFunction) => {
    console.log("req.body", req.body);
    const { importCountryId, exportCountryId, weight, shippingMethodId, category1688Id } = req.body;
    const payload: any = {
      importCountryId,
      exportCountryId,
      weight,
      shippingMethodId,
      category1688Id
    };
    const rates = await rateService.findBookingShippingRate(payload);
    const resDoc = responseHandler(200, 'Rates retrieved successfully', rates);
    res.status(resDoc.statusCode).json(resDoc);
  })

  countryMethodWiseRate = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { importCountryId, exportCountryId, shippingMethodId } = req.query;
    const payload: any = {
      importCountryId,
      exportCountryId,
      shippingMethodId
    };
    const rates = await rateService.countryMethodWiseRate(payload);
    const resDoc = responseHandler(200, 'Country Method Wise Rates retrieved successfully', rates);
    res.status(resDoc.statusCode).json(resDoc);
  })

  bulkAdjustRate = withBalkTransaction(async (req: Request, res: Response, next: NextFunction, transaction: any) => {
    const { adjustIsPercent, adjustMode, amount, weightCategoryId, applyToNonEmptyOnly, exportCountryId, importCountryId, shippingMethodId } = req.body;
    const payload: any = {
      adjustIsPercent,
      adjustMode,
      amount,
      weightCategoryId,
      applyToNonEmptyOnly,
      exportCountryId,
      importCountryId,
      shippingMethodId
    };
    const result = await rateService.bulkAdjustRate(payload, transaction);
    const resDoc = responseHandler(200, 'Bulk Rate Adjustment completed successfully', result);
    res.status(resDoc.statusCode).json(resDoc);
  });

  findShippingRateForProduct = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const userRef = req.user?.user_info_encrypted?.id?.toString() ?? null;
    const {  importCountryId, productId, topCategoryId, secondCategoryId } = req.body;
    const payload: any = {
      importCountryId,
      productId: Number(productId),
      categoryId: Number(topCategoryId),
      subCategoryId: Number(secondCategoryId),
      userRef
    };
    console.log("Finding shipping rate for product with payload:", payload);
    const rates = await rateService.findShippingRateForProduct(payload);
    const resDoc = responseHandler(200, 'Shipping Rates for Product retrieved successfully', rates);
    res.status(resDoc.statusCode).json(resDoc);
  })

}

export default new RateController();