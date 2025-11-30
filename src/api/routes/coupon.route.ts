import { Router } from "express";
import controller from "../../modules/coupon/coupon.controller";
// import jwtAuth from "../../middleware/auth/jwtAuth";
import { upload } from "../../middleware/upload/upload";

const CouponRoute = Router();
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

export default CouponRoute;
