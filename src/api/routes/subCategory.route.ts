import { Router } from "express";
import controller from "../../modules/subCategory/sub.category.controller";
// import jwtAuth from "../../middleware/auth/jwtAuth";
// import { upload } from "../../middleware/upload/upload";

const SubCategoryRoute = Router();
// SubCategoryRoute.use(jwtAuth());

SubCategoryRoute.route("/")
  .post( controller.createSubCategory)
  .get(controller.getAllSubCategory);

SubCategoryRoute.get("/pagination", controller.getSubCategoryWithPagination);

SubCategoryRoute.route("/:slug")
  .get(controller.getSingleSubCategory)
  .put( controller.updateSubCategory)
  .delete(controller.deleteSubCategory);


export default SubCategoryRoute;
