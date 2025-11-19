import { Router } from "express";
import controller from "../../modules/category1688/category.1688.controller";
// import jwtAuth from "../../middleware/auth/jwtAuth";
import { upload } from "../../middleware/upload/upload";

const Category1688Router = Router();
// Category1688Router.use(jwtAuth());

// Category1688Router.get("/navbar", controller.getNavBar);
Category1688Router.route("/")
.post( controller.createCategory1688) //
.get(controller.getAllCategory1688); //

// Fetch raw 1688 API response for a given categoryId (no DB upsert)
Category1688Router.get('/category/:categoryId', controller.getCategoryIdBySubcategory);
Category1688Router.get('/rate', controller.getAllCategory1688ForRateCalculation);
Category1688Router.post('/:categoryId/rate-calculation', controller.addCategoryForRateCalculation);

// Category1688Router.get("/navbar", controller.getNavBar);
// Category1688Router.get("/pagination", controller.getCategory1688WithPagination);
// Category1688Router.route(":slug").get(controller.getSingleCategory1688WithSlug);

// Category1688Router.route("/:slug")
//   .get(controller.getSingleCategory1688)
//   .put(upload.any(), controller.updateCategory1688)
//   .delete(controller.deleteCategory1688);

// Category1688Router.put("/status/:id", controller.updateCategory1688Status);

export default Category1688Router;
