import { Request, Response, NextFunction } from 'express';
import catchError from '../../middleware/errors/catchError';
import { responseHandler } from '../../utils/responseHandler';
import withTransaction from '../../middleware/transactions/withTransaction';
import shoppingOrderService from './shopping.order.service';
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
                const order = await shoppingOrderService.createShoppingOrder(payload, tx);
                const resDoc = responseHandler(201, 'Order created successfully', order);
                res.status(resDoc.statusCode).json(resDoc);
            } catch (error) {
                next(error);
            }
        }
    )

    getShoppingOrderWithPagination = catchError(
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const userId = getAuthUserId(req);
                const { page, limit } = req.query;
                const payload = {
                    userId,
                    page: Number(page) || 1,
                    limit: Number(limit) || 10,
                };
                const orders = await shoppingOrderService.getShoppingOrderWithPagination(payload);
                const resDoc = responseHandler(200, 'Orders retrieved successfully', orders);
                res.status(resDoc.statusCode).json(resDoc);
            } catch (error) {
                next(error);
            }
        }
    )

        getAllShoppingOrdersWithPaginationForAdmin = catchError(
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const userId = getAuthUserId(req);
                const { page, limit } = req.query;
                const payload = {
                    userId,
                    page: Number(page) || 1,
                    limit: Number(limit) || 10,
                };
                const orders = await shoppingOrderService.getAllShoppingOrdersWithPaginationForAdmin(payload);
                const resDoc = responseHandler(200, 'Orders retrieved successfully', orders);
                res.status(resDoc.statusCode).json(resDoc);
            } catch (error) {
                next(error);
            }
        }
    )
  
}

export default new OrderController();
