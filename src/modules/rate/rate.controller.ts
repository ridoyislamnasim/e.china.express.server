// AuthController (TypeScript version)
import { Request, Response, NextFunction } from 'express';
import { responseHandler } from '../../utils/responseHandler';
import { RateService } from './rate.service';
import rateRepository from './rate.repository';
import catchError from '../../middleware/errors/catchError';
const rateService = new RateService(rateRepository);


class RateController {
  createRate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { price, weightCategoryId, shippingMethodId, productId, importCountryId, exportCountryId } = req.body;
      const payload = {
        price, weightCategoryId, shippingMethodId, productId, importCountryId, exportCountryId
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
      const { importCountryId, exportCountryId, weightCategoryId, shippingMethodId, productId } = req.body;
      const payload: any = {
        importCountryId,
        exportCountryId,
        weightCategoryId,
        shippingMethodId,
        productId
      };
      const rates = await rateService.findRateByCriteria(payload);
      const resDoc = responseHandler(200, 'Rates retrieved successfully', rates);
      res.status(resDoc.statusCode).json(resDoc);
  })
}

export default new RateController();