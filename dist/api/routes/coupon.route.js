"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const coupon_controller_1 = __importDefault(require("../../modules/coupon/coupon.controller"));
// import jwtAuth from "../../middleware/auth/jwtAuth";
const upload_1 = require("../../middleware/upload/upload");
const CouponRoute = (0, express_1.Router)();
// CouponRoute.use(jwtAuth());
CouponRoute.route("/")
    .post(upload_1.upload.any(), coupon_controller_1.default.createCoupon)
    .get(coupon_controller_1.default.getAllCoupon);
CouponRoute.route("/calculate").post(upload_1.upload.any(), coupon_controller_1.default.calculateCouponTotal);
CouponRoute.get("/pagination", coupon_controller_1.default.getCouponWithPagination);
CouponRoute.route(":id")
    .get(coupon_controller_1.default.getSingleCoupon)
    .put(upload_1.upload.any(), coupon_controller_1.default.updateCoupon)
    .delete(coupon_controller_1.default.deleteCoupon);
CouponRoute.put("/status/:id", coupon_controller_1.default.updateCouponStatus);
exports.default = CouponRoute;
