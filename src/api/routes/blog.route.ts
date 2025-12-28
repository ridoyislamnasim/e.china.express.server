import { Router } from "express";
import controller from "../../modules/blog/blog.controller";
// import { upload } from "../../middleware/upload/upload";
// import jwtAuth from "../../middleware/auth/jwtAuth";

const BlogRoute = Router();
// BlogRoute.use(jwtAuth());

//done
BlogRoute.route("/").post( controller.createBlog);
BlogRoute.route("/create-tag").post(controller.createBlogTag);
BlogRoute.route("/").get(controller.getAllBlogs);
BlogRoute.route("/blog-tags").post(controller.getAllBlogTags);
BlogRoute.get("/:slug", controller.getSingleBlog);
BlogRoute.patch("/:slug", controller.updateBlogBySlug);
BlogRoute.patch("/blog-tags/:slug", controller.updateBlogTagBySlug);
BlogRoute.delete("/:slug", controller.deleteBlogBySlug);
BlogRoute.delete("/blog-tags/:slug", controller.deleteBlogTagBySlug);

//todo
BlogRoute.get("/pagination", controller.getBlogWithPagination);
BlogRoute.route("/:slug").put( controller.updateBlog);
BlogRoute.delete("/:slug", controller.deleteBlog);

export default BlogRoute;
