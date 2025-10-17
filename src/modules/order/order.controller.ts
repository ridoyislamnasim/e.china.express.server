import { Request, Response, NextFunction } from 'express';
import catchError from '../../middleware/errors/catchError';
import { responseHandler } from '../../utils/responseHandler';
import withTransaction from '../../middleware/transactions/withTransaction';
import OrderService from './order.service';

class OrderController {
  createOrder = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    try {
      const {
        subTotalPrice,
        totalPrice,
        coupon,
        shippingCost,
        userRef,
        customerName,
        customerPhone,
        customerEmail,
        customerCity,
        customerAddress,
        customerHouse,
        customerRoad,
        customerThana,
        customerAltPhone,
        paymentMethod,
        note,
      } = req.body;
      const payload = {
        subTotalPrice,
        totalPrice,
        shippingCost,
        coupon,
        userRef,
        customerName,
        customerPhone,
        customerEmail,
        customerCity,
        customerAddress,
        customerHouse,
        customerRoad,
        customerThana,
        customerAltPhone,
        paymentMethod,
        note,
      };
      const orderResult = await OrderService.createOrder(payload,tx);
      const resDoc = responseHandler(201, 'Order successfully', orderResult);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error: any) {
      if (error.message === 'OrderId must be unique') {
        const resDoc = responseHandler(400, error.message);
        res.status(resDoc.statusCode).json(resDoc);
      } else {
        next(error);
      }
    }
  });

  createAdminOrder = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    const payload = {
      userRef: req.body.userRef,
      orders: req?.body?.order,
      warehouseRef: req.body.warehouseRef,
      payment: req.body.payment,
      note: req.body.note,
    };
    const orderResult = await OrderService.createAdminOrder(payload, tx);
    const resDoc = responseHandler(201, 'Order Created successfully', orderResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllOrder = catchError(async (req: Request, res: Response) => {
    const orderResult = await OrderService.getAllOrder();
    const resDoc = responseHandler(200, 'Get All Orders', orderResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

    getOrderProducts = catchError(async (req: Request, res: Response) => {
    const orderResult = await OrderService.getOrderProducts();
    const resDoc = responseHandler(200, 'Get All Orders', orderResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

    getOrderWithPagination = catchError(async (req: Request, res: Response) => {
    let payload = {
      page: req.query.page,
      limit: req.query.limit,
      order: req.query.order,
      warehouseRef: req.query.warehouseRef,
    };
    const order = await OrderService.getOrderWithPagination(payload);
    const resDoc = responseHandler(200, 'Orders get successfully', order);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getIncompleteOrderWithPagination = catchError(async (req: Request, res: Response) => {
    let payload = {
      page: req.query.page,
      limit: req.query.limit,
      order: req.query.order,
      warehouseRef: req.query.warehouseRef,
    };
    const order = await OrderService.getIncompleteOrderWithPagination(payload);
    const resDoc = responseHandler(200, 'Orders get successfully', order);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSingleOrder = catchError(async (req: Request, res: Response) => {
    const id = req.params.id;
    const orderResult = await OrderService.getSingleOrder(id);
    const resDoc = responseHandler(201, 'Single Order successfully', orderResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getUserAllOrder = catchError(async (req: Request, res: Response) => {
    const id = req.params.id;
    const orderResult = await OrderService.getUserAllOrder(id);
    const resDoc = responseHandler(201, 'User All Order get successfully', orderResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  orderTracking = catchError(async (req: Request, res: Response) => {
    const payload = {
      orderId: req.body.orderId,
    };
    const orderResult = await OrderService.orderTracking(payload);
    const resDoc = responseHandler(201, 'User Order get successfully', orderResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateOrder = catchError(async (req: Request, res: Response) => {
    const id = req.params.id;
    const payload = {
      orderId: req.body.orderId,
      subTotal: req.body.subTotal,
      total: req.body.total,
      status: req.body.status,
      coupon: req.body.coupon,
      userRef: req.body.userRef,
    };
    await OrderService.updateOrder(id, payload);
    const resDoc = responseHandler(201, 'Order Update successfully');
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateOrderStatus = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    const id = req.params.id;
    const status = req.body.status;
    await OrderService.updateOrderStatus(id, status, tx);
    const resDoc = responseHandler(201, 'Order Status Update successfully');
    res.status(resDoc.statusCode).json(resDoc);
  });

  isCourierSending = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    const id = req.params.id;
    await OrderService.isCourierSending(id, tx);
    const resDoc = responseHandler(201, 'Order Status Update successfully');
    res.status(resDoc.statusCode).json(resDoc);
  });

  deleteOrder = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    const id = req.params.id;
    const orderResult = await OrderService.deleteOrder(id, tx);
    // if (orderResult) {
    //   const resDoc = responseHandler(200, 'Order Deleted successfully');
    //   res.status(resDoc.statusCode).json(resDoc);
    // }
  });
}

export default new OrderController();
