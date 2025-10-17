import { Router } from "express";
import controller from "../../modules/banner/banner.controller";
import { upload } from "../../middleware/upload/upload";
// import jwtAuth from "../../middleware/auth/jwtAuth";

const BannerRoute = Router();
// BannerRoute.use(jwtAuth());

BannerRoute.route("/")
  .post(upload.any(), controller.createBanner)
  .get(controller.getAllBanner);

BannerRoute.get("/pagination", controller.getBannerWithPagination);

BannerRoute.route("/:id")
  .get(controller.getSingleBanner)
  .put(upload.any(), controller.updateBanner)
  .delete(controller.deleteBanner);

export default BannerRoute;
