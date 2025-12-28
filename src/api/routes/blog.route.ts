import { Router } from "express";
import controller from "../../modules/blog/blog.controller";
import { upload } from "../../middleware/upload/upload";
import jwtAuth from "../../middleware/auth/jwtAuth";
// import jwtAuth from "../../middleware/auth/jwtAuth";

const BlogRoute = Router();

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


// ==============================
// Blog Industrie CRUD
// ==============================
BlogRoute
  .route("/industrie")
  .post(controller.createIndustries)
  .get(controller.getAllIndustriess);

BlogRoute.get("/industries/pagination", controller.getAllIndustriesByPagination);


BlogRoute
  .route("/industrie/:id")
  .get(controller.getSingleIndustries)
  .patch(controller.updateIndustries)
  .delete(controller.deleteIndustries);


  // ==============================
// Blog Tags
// ==============================
BlogRoute
  .route("/tag")
  .post(controller.createBlogTag)
  .get(controller.getAllBlogTags);

BlogRoute.get("/tags/pagination", controller.getAllTagsByPagination);


BlogRoute
  .route("/tag/:id")
  .get(controller.getSingleBlogTag)
  .patch(controller.updateTag)
  .delete(controller.deleteTag);

  

// ==============================
// Blogs
// ==============================


BlogRoute
  .route("/")
  .post( upload.any(), controller.createBlog)
  .get(controller.getAllBlogs);


BlogRoute.get("/pagination", controller.getAllBlogsByPagination);
BlogRoute.get("/trending-content", controller.getAllTrendingContent);
BlogRoute.get("/featured", controller.getAllFeaturedContent);

BlogRoute
  .route("/:slug")
  .get(controller.getSingleBlog)
  .patch(upload.any(), controller.updateBlog)
  .delete(controller.deleteBlogBySlug);

BlogRoute
  .route("/get-blog-by-tag")
  .post(controller.getBlogsByTags);



export default BlogRoute;
