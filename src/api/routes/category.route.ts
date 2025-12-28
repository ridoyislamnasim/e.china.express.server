import { Router } from "express";
import controller from "../../modules/category/category.controller";
// import jwtAuth from "../../middleware/auth/jwtAuth";
// import { upload } from "../../middleware/upload/upload";

const CategoryRoute = Router();
// CategoryRoute.use(jwtAuth());

// CategoryRoute.get("/navbar", controller.getNavBar);
CategoryRoute.route("/")
.post( controller.createCategory)
.get(controller.getAllCategory);

CategoryRoute.get("/navbar", controller.getNavBar);
CategoryRoute.get("/pagination", controller.getCategoryWithPagination);
// CategoryRoute.route(":slug").get(controller.getSingleCategoryWithSlug);

CategoryRoute.route("/:slug")
  .get(controller.getSingleCategory)
  .put( controller.updateCategory)
  .delete(controller.deleteCategory);

// CategoryRoute.put("/status/:id", controller.updateCategoryStatus);

export default CategoryRoute;
