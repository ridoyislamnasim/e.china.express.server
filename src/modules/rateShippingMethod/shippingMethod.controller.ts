// AuthController (TypeScript version)
import { Request, Response, NextFunction } from 'express';
import { responseHandler } from '../../utils/responseHandler';
import { ShippingMethodService } from './shippingMethod.service';
import shippingMethodRepository from './shippingMethod.repository';
const rateShippingMethodService = new ShippingMethodService(shippingMethodRepository);

class RateShippingMethodController {
 createShippingMethod = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description } = req.body;
        const payload = {
      name,
      description: description ?? null
    };
    const shippingMethod = await rateShippingMethodService.createShippingMethod(payload);
    const resDoc = responseHandler(201, 'Rate shipping method Created successfully', shippingMethod);
    res.status(resDoc.statusCode).json(resDoc);
  } catch (error) {
    next(error);
  }
};

getShippingMethod = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const shippingMethods = await rateShippingMethodService.getShippingMethod();
    const resDoc = responseHandler(200, 'Rate shipping methods retrieved successfully', shippingMethods);
    res.status(resDoc.statusCode).json(resDoc);
  } catch (error) {
    next(error);
  }
}
}

export default new RateShippingMethodController();
