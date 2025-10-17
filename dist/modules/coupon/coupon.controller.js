"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchError_1 = __importDefault(require("../../middleware/errors/catchError"));
const responseHandler_1 = require("../../utils/responseHandler");
const withTransaction_1 = __importDefault(require("../../middleware/transactions/withTransaction"));
const coupon_service_1 = __importDefault(require("./coupon.service"));
class CouponController {
    constructor() {
        this.createCoupon = (0, withTransaction_1.default)(async (req, res, next, tx) => {
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
            const couponResult = await coupon_service_1.default.createCoupon(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(201, 'Coupon Created successfully', couponResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getAllCoupon = (0, catchError_1.default)(async (req, res) => {
            const couponResult = await coupon_service_1.default.getAllCoupon();
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Get All Coupons', couponResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getCouponWithPagination = (0, catchError_1.default)(async (req, res) => {
            let payload = {
                page: req.query.page,
                limit: req.query.limit,
                order: req.query.order,
            };
            const coupon = await coupon_service_1.default.getCouponWithPagination(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Coupons get successfully', coupon);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getSingleCoupon = (0, catchError_1.default)(async (req, res) => {
            const id = req.params.id;
            const couponResult = await coupon_service_1.default.getSingleCoupon(id);
            const resDoc = (0, responseHandler_1.responseHandler)(201, 'Single Coupon successfully', couponResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.updateCoupon = (0, catchError_1.default)(async (req, res) => {
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
            await coupon_service_1.default.updateCoupon(id, payload);
            const resDoc = (0, responseHandler_1.responseHandler)(201, 'Coupon Update successfully');
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.updateCouponStatus = (0, catchError_1.default)(async (req, res) => {
            const id = req.params.id;
            const statusParam = req.query.status;
            const status = typeof statusParam === 'boolean'
                ? statusParam
                : statusParam === 'true';
            await coupon_service_1.default.updateCouponStatus(id, status);
            const resDoc = (0, responseHandler_1.responseHandler)(201, 'Coupon Status Update successfully');
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.deleteCoupon = (0, catchError_1.default)(async (req, res) => {
            const id = req.params.id;
            await coupon_service_1.default.deleteCoupon(id);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Coupon Deleted successfully');
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.calculateCouponTotal = (0, catchError_1.default)(async (req, res) => {
            const payload = {
                userRef: req.body.userRef,
                couponRef: req.body.couponRef,
            };
            const couponResult = await coupon_service_1.default.calculateCouponTotal(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(201, 'Coupon calculation successfully', couponResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
    }
}
exports.default = new CouponController();
