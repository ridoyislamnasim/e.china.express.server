// AuthController (TypeScript version)
import { Request, Response, NextFunction } from 'express';
import { responseHandler } from '../../utils/responseHandler';
import { RateWeightCategoriesService } from './rateWeightCategories.service';
import rateWeightCategoriesRepository from './rateWeightCategories.repository';
const rateWeightCategoriesService = new RateWeightCategoriesService(rateWeightCategoriesRepository);

export const createRateWeightCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { label, min_weight, max_weight } = req.body;
    const payload = {
      label, min_weight, max_weight
    };
    const shippingMethod = await rateWeightCategoriesService.createRateWeightCategories(payload);
    const resDoc = responseHandler(201, 'Rate weight categories created successfully', shippingMethod);
    res.status(resDoc.statusCode).json(resDoc);
  } catch (error) {
    next(error);
  }
};

