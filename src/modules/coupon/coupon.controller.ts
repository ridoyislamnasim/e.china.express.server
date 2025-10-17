import { Request, Response, NextFunction } from 'express';
import catchError from '../../middleware/errors/catchError';
import { responseHandler } from '../../utils/responseHandler';
import withTransaction from '../../middleware/transactions/withTransaction';
import CouponService from './coupon.service';

class CouponController {
  createCoupon = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    const payload = {
      code: req.body.code,
      discount: req.body.discount,
      useLimit: req.body.useLimit,
      startDate: req.body.startDate,
      expireDate: req.body.expireDate,
      discountType: req.body.discountType,
      categoryRef: req.body.categoryRef,
    //   subCategoryRef: req.body.subCategoryRef,
    //   brandRef: req.body.brandRef,
    };
    const couponResult = await CouponService.createCoupon(payload);
    const resDoc = responseHandler(
      201,
      'Coupon Created successfully',
      couponResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllCoupon = catchError(async (req: Request, res: Response) => {
    const couponResult = await CouponService.getAllCoupon();
    const resDoc = responseHandler(200, 'Get All Coupons', couponResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getCouponWithPagination = catchError(async (req: Request, res: Response) => {
    let payload = {
      page: req.query.page,
      limit: req.query.limit,
      order: req.query.order,
    };
    const coupon = await CouponService.getCouponWithPagination(payload);
    const resDoc = responseHandler(200, 'Coupons get successfully', coupon);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSingleCoupon = catchError(async (req: Request, res: Response) => {
    const id = req.params.id;
    const couponResult = await CouponService.getSingleCoupon(id);
    const resDoc = responseHandler(
      201,
      'Single Coupon successfully',
      couponResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateCoupon = catchError(async (req: Request, res: Response) => {
    const id = req.params.id;
    const payload = {
      code: req.body.code,
      discount: req.body.discount,
      useLimit: req.body.useLimit,
      used: req.body.used,
      startDate: req.body.startDate,
      expireDate: req.body.expireDate,
      discountType: req.body.discountType,
      categoryRef: req.body.categoryRef,
      subCategoryRef: req.body.subCategoryRef,
      brandRef: req.body.brandRef,
    };
    await CouponService.updateCoupon(id, payload);
    const resDoc = responseHandler(201, 'Coupon Update successfully');
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateCouponStatus = catchError(async (req: Request, res: Response) => {
    const id = req.params.id;
    const statusParam = req.query.status;
    const status =
      typeof statusParam === 'boolean'
        ? statusParam
        : statusParam === 'true';
    await CouponService.updateCouponStatus(id, status);
    const resDoc = responseHandler(201, 'Coupon Status Update successfully');
    res.status(resDoc.statusCode).json(resDoc);
  });

  deleteCoupon = catchError(async (req: Request, res: Response) => {
    const id = req.params.id;
    await CouponService.deleteCoupon(id);
    const resDoc = responseHandler(200, 'Coupon Deleted successfully');
    res.status(resDoc.statusCode).json(resDoc);
  });

  calculateCouponTotal = catchError(async (req: Request, res: Response) => {
    const payload = {
      userRef: req.body.userRef,
      couponRef: req.body.couponRef,
    };
    const couponResult = await CouponService.calculateCouponTotal(payload);
    const resDoc = responseHandler(
      201,
      'Coupon calculation successfully',
      couponResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });
}

export default new CouponController();
