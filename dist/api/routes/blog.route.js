"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blog_controller_1 = __importDefault(require("../../modules/blog/blog.controller"));
// import { upload } from "../../middleware/upload/upload";
// import jwtAuth from "../../middleware/auth/jwtAuth";
const BlogRoute = (0, express_1.Router)();
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
    .post(blog_controller_1.default.createTopic)
    .get(blog_controller_1.default.getAllTopics);
BlogRoute.get("/topics/pagination", blog_controller_1.default.getAllTopicByPagination);
BlogRoute
    .route("/topics/:id")
    .get(blog_controller_1.default.getSingleTopic)
    .patch(blog_controller_1.default.updateTopic)
    .delete(blog_controller_1.default.deleteTopic);
BlogRoute
    .route("/:slug")
    .get(blog_controller_1.default.getSingleBlog)
    .patch(blog_controller_1.default.updateBlogBySlug)
    .put(upload.any(), blog_controller_1.default.updateBlog)
    .delete(blog_controller_1.default.deleteBlogBySlug);
// ==============================
// Blog Tags
// ==============================
BlogRoute
    .route("/blog-tags")
    .get(blog_controller_1.default.getAllBlogTags);
BlogRoute
    .route("/blog-tags/:slug")
    .patch(blog_controller_1.default.updateBlogTagBySlug)
    .delete(blog_controller_1.default.deleteBlogTagBySlug);
BlogRoute
    .route("/create-tag")
    .post(blog_controller_1.default.createBlogTag);
// ==============================
// Filters & Queries
// ==============================
BlogRoute
    .route("/get-blog-by-tag")
    .post(blog_controller_1.default.getBlogsByTags);
BlogRoute
    .route("/pagination")
    .get(blog_controller_1.default.getBlogWithPagination);
exports.default = BlogRoute;
