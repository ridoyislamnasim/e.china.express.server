import { Request, Response, NextFunction } from 'express';
import catchError from '../../middleware/errors/catchError';
import { responseHandler } from '../../utils/responseHandler';
import withTransaction from '../../middleware/transactions/withTransaction';
import OrderService from './order.service';

class OrderController {
  
}

export default new OrderController();
