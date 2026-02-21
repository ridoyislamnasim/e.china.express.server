import { Request, Response, NextFunction } from 'express';
import catchError from '../../middleware/errors/catchError';
import { responseHandler } from '../../utils/responseHandler';
import withTransaction from '../../middleware/transactions/withTransaction';
import OrderService from './shopping.order.service';
import { getAuthUserId } from '../../utils/auth.helper';

class OrderController {
    createShoppingOrder = withTransaction(
        async (req: Request, res: Response, next: NextFunction, tx: any) => {
            try {
                const {  addressId, products, payment } = req.body;
                const userId = getAuthUserId(req);
                const payload = {
                    userId,
                    addressId,
                    products,
                    payment,
                };
                const order = await OrderService.createShoppingOrder(payload, tx);
                const resDoc = responseHandler(201, 'Order created successfully', order);
                res.status(resDoc.statusCode).json(resDoc);
            } catch (error) {
                next(error);
            }
        }
    )
  
}

export default new OrderController();
