// import { Router } from "express";
// import controller from "../../modules/childCategory/child.category.controller";
// // import jwtAuth from "../../middleware/auth/jwtAuth";
// import { upload } from "../../middleware/upload/upload";

// const ChildCategoryRoute = Router();
// // ChildCategoryRoute.use(jwtAuth());

// ChildCategoryRoute.route("/")
//   .post(upload.any(), controller.createChildCategory)
//   .get(controller.getAllChildCategory);

// ChildCategoryRoute.get("/pagination", controller.getChildCategoryWithPagination);
// ChildCategoryRoute.route(":slug").get(controller.getSingleChildCategoryWithSlug);

// ChildCategoryRoute.route(":id")
//   .get(controller.getSingleChildCategory)
//   .put(upload.any(), controller.updateChildCategory)
//   .delete(controller.deleteChildCategory);

// ChildCategoryRoute.put("/status/:id", controller.updateChildCategoryStatus);

// export default ChildCategoryRoute;
