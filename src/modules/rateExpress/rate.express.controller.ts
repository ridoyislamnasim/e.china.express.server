// AuthController (TypeScript version)
import { Request, Response, NextFunction } from 'express';
import { responseHandler } from '../../utils/responseHandler';
import { RateExpressService } from './rate.express.service';
import rateRepository from './rate.express.repository';
import catchError from '../../middleware/errors/catchError';
import withTransaction from '../../middleware/transactions/withTransaction';
import withBalkTransaction from '../../middleware/transactions/withBalkTransaction';
const rateService = new RateExpressService(rateRepository);


class RateExpressController {
  createRateExpress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { price, weightCategoryId, shippingMethodId, countryZoneId } = req.body;
      const payload = {
        price: Number(price),
        weightCategoryId: Number(weightCategoryId),
        shippingMethodId: Number(shippingMethodId),
        countryZoneId: Number(countryZoneId),
      };
      const shippingMethod = await rateService.createRateExpress(payload);
      const resDoc = responseHandler(201, 'RateExpress created successfully', shippingMethod);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };


  getAllRateExpress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rates = await rateService.getAllRateExpress();
      const resDoc = responseHandler(200, 'RateExpresss retrieved successfully', rates);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  }

  findRateExpressByCriteria = catchError(async (req: Request, res: Response, next: NextFunction) => {
    console.log("req.body", req.body);
    const { countryZoneId, weight, shippingMethodId } = req.body;
    const payload: any = {
      countryZoneId,
      weight,
      shippingMethodId
    };
    const rates = await rateService.findRateExpressByCriteria(payload);
    const resDoc = responseHandler(200, 'RateExpresss retrieved successfully', rates);
    res.status(resDoc.statusCode).json(resDoc);
  })


  findBookingShippingRateExpress = catchError(async (req: Request, res: Response, next: NextFunction) => {
    console.log("req.body", req.body);
    const { importCountryId, exportCountryId, weight, shippingMethodId, category1688Id } = req.body;
    const payload: any = {
      importCountryId,
      exportCountryId,
      weight,
      shippingMethodId,
      category1688Id
    };
    const rates = await rateService.findBookingShippingRateExpress(payload);
    const resDoc = responseHandler(200, 'RateExpresss retrieved successfully', rates);
    res.status(resDoc.statusCode).json(resDoc);
  })

  countryMethodWiseRateExpress = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { importCountryId, exportCountryId, shippingMethodId } = req.query;
    const payload: any = {
      importCountryId,
      exportCountryId,
      shippingMethodId
    };
    const rates = await rateService.countryMethodWiseRateExpress(payload);
    const resDoc = responseHandler(200, 'Country Method Wise RateExpresss retrieved successfully', rates);
    res.status(resDoc.statusCode).json(resDoc);
  })

  bulkAdjustRateExpress = withBalkTransaction(async (req: Request, res: Response, next: NextFunction, transaction: any) => {
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
    const result = await rateService.bulkAdjustRateExpress(payload, transaction);
    const resDoc = responseHandler(200, 'Bulk RateExpress Adjustment completed successfully', result);
    res.status(resDoc.statusCode).json(resDoc);
  });

  findShippingRateExpressForProduct = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const userRef = req.user?.user_info_encrypted?.id?.toString() ?? null;
    const { importCountryId, productId, topCategoryId, secondCategoryId } = req.body;
    const payload: any = {
      importCountryId,
      productId: Number(productId),
      categoryId: Number(topCategoryId),
      subCategoryId: Number(secondCategoryId),
      userRef
    };
    console.log("Finding shipping rate for product with payload:", payload);
    const rates = await rateService.findShippingRateExpressForProduct(payload);
    const resDoc = responseHandler(200, 'Shipping RateExpresss for Product retrieved successfully', rates);
    res.status(resDoc.statusCode).json(resDoc);
  })

}

export default new RateExpressController();