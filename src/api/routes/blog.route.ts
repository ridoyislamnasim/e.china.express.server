import { Router } from "express";
import controller from "../../modules/blog/blog.controller";
import { upload } from "../../middleware/upload/upload";
// import jwtAuth from "../../middleware/auth/jwtAuth";

const BlogRoute = Router();
// BlogRoute.use(jwtAuth());

BlogRoute.route("/")
  .post(upload.any(), controller.createBlog)
  .get(controller.getAllBlog);

BlogRoute.get("/pagination", controller.getBlogWithPagination);
BlogRoute.get("/single/:slug", controller.getSingleBlog);

BlogRoute.route("/:slug")
  .put(upload.any(), controller.updateBlog)
  .delete(controller.deleteBlog);

export default BlogRoute;
