import { Request, Response, NextFunction } from 'express';
import catchError from '../../middleware/errors/catchError';
import { responseHandler } from '../../utils/responseHandler';
import withTransaction from '../../middleware/transactions/withTransaction';
import CouponService from './coupon.service';

class CouponController {
  
}

export default new CouponController();
