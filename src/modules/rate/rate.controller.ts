// AuthController (TypeScript version)
import { Request, Response, NextFunction } from 'express';
import { responseHandler } from '../../utils/responseHandler';
import { RateService } from './rate.service';
import rateRepository from './rate.repository';
const rateService = new RateService(rateRepository);

export const createRate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { price, weightCategoryId, shippingMethodId, productId, status, route_name, importCountryId, exportCountryId } = req.body;
    const payload = {
      price, weightCategoryId, shippingMethodId, productId, status, route_name, importCountryId, exportCountryId
    };
    const shippingMethod = await rateService.createRate(payload);
    const resDoc = responseHandler(201, 'Rate created successfully', shippingMethod);
    res.status(resDoc.statusCode).json(resDoc);
  } catch (error) {
    next(error);
  }
};

