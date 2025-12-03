"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CouponRoute = (0, express_1.Router)();
// CouponRoute.use(jwtAuth());
// CouponRoute.route("/")
//   .post(upload.any(), controller.createCoupon)
//   .get(controller.getAllCoupon);
// CouponRoute.route("/calculate").post(
//   upload.any(),
//   controller.calculateCouponTotal
// );
// CouponRoute.get("/pagination", controller.getCouponWithPagination);
// CouponRoute.route(":id")
//   .get(controller.getSingleCoupon)
//   .put(upload.any(), controller.updateCoupon)
//   .delete(controller.deleteCoupon);
// CouponRoute.put("/status/:id", controller.updateCouponStatus);
exports.default = CouponRoute;
