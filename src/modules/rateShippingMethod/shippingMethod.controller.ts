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

getShippingMethodWithPagination = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let payload = {
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      order: req.query.order,
    };
    const shippingMethods = await rateShippingMethodService.getShippingMethodWithPagination(payload);
    const resDoc = responseHandler(200, 'Rate shipping methods retrieved successfully', { ...shippingMethods });
    res.status(resDoc.statusCode).json(resDoc);
  } catch (error) {
    next(error);
  }
}
getSingleShippingMethod = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const shippingMethod = await rateShippingMethodService.getSingleShippingMethod(id);
    const resDoc = responseHandler(200, 'Rate shipping method retrieved successfully', shippingMethod);
    res.status(resDoc.statusCode).json(resDoc);
  } catch (error) {
    next(error);
  }
}
updateShippingMethod = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const payload = {
      name: req.body.name,
    };
    await rateShippingMethodService.updateShippingMethod(id, payload);
    const resDoc = responseHandler(200, 'Rate shipping method updated successfully');
    res.status(resDoc.statusCode).json(resDoc);
  } catch (error) {
    next(error);
  }
}
deleteShippingMethod = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    await rateShippingMethodService.deleteShippingMethod(id);
    const resDoc = responseHandler(200, 'Rate shipping method deleted successfully');
    res.status(resDoc.statusCode).json(resDoc);
  } catch (error) {
    next(error);
  }
}

}

export default new RateShippingMethodController();
