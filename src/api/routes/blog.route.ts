import { Router } from "express";
import controller from "../../modules/blog/blog.controller";
// import { upload } from "../../middleware/upload/upload";
// import jwtAuth from "../../middleware/auth/jwtAuth";

const BlogRoute = Router();
// BlogRoute.use(jwtAuth());

// ==============================
// Blog CRUD
// ==============================
// BlogRoute
//   .route("/")
//   .post(upload.any(), controller.createBlog)
//   .get(controller.getAllBlogs);








// ==============================
// topic  CRUD
// ==============================
BlogRoute
.route("/topics")
.post(controller.createTopic)
.get(controller.getAllTopics);

BlogRoute.get("/topics/pagination", controller.getAllTopicByPagination);

BlogRoute
  .route("/topics/:id")
  .get(controller.getSingleTopic)
  .patch(controller.updateTopic)
  .delete(controller.deleteTopic);
















BlogRoute
  .route("/:slug")
  .get(controller.getSingleBlog)
  .patch(controller.updateBlogBySlug)
  .put(upload.any(), controller.updateBlog)
  .delete(controller.deleteBlogBySlug);

// ==============================
// Blog Tags
// ==============================
BlogRoute
  .route("/blog-tags")
  .get(controller.getAllBlogTags);

BlogRoute
  .route("/blog-tags/:slug")
  .patch(controller.updateBlogTagBySlug)
  .delete(controller.deleteBlogTagBySlug);

BlogRoute
  .route("/create-tag")
  .post(controller.createBlogTag);

// ==============================
// Filters & Queries
// ==============================
BlogRoute
  .route("/get-blog-by-tag")
  .post(controller.getBlogsByTags);

BlogRoute
  .route("/pagination")
  .get(controller.getBlogWithPagination);


export default BlogRoute;
