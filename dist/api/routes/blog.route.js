"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blog_controller_1 = __importDefault(require("../../modules/blog/blog.controller"));
const upload_1 = require("../../middleware/upload/upload");
// import jwtAuth from "../../middleware/auth/jwtAuth";
const BlogRoute = (0, express_1.Router)();
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
// ==============================
// Blog Industrie CRUD
// ==============================
BlogRoute
    .route("/industrie")
    .post(blog_controller_1.default.createIndustries)
    .get(blog_controller_1.default.getAllIndustriess);
BlogRoute.get("/industries/pagination", blog_controller_1.default.getAllIndustriesByPagination);
BlogRoute
    .route("/industrie/:id")
    .get(blog_controller_1.default.getSingleIndustries)
    .patch(blog_controller_1.default.updateIndustries)
    .delete(blog_controller_1.default.deleteIndustries);
// ==============================
// Blog Tags
// ==============================
BlogRoute
    .route("/tag")
    .post(blog_controller_1.default.createBlogTag)
    .get(blog_controller_1.default.getAllBlogTags);
BlogRoute.get("/tags/pagination", blog_controller_1.default.getAllTagsByPagination);
BlogRoute
    .route("/tag/:id")
    .get(blog_controller_1.default.getSingleBlogTag)
    .patch(blog_controller_1.default.updateTag)
    .delete(blog_controller_1.default.deleteTag);
// ==============================
// Blogs
// ==============================
BlogRoute
    .route("/")
    .post(upload_1.upload, blog_controller_1.default.createBlog)
    .get(blog_controller_1.default.getAllBlogs);
BlogRoute.get("/pagination", blog_controller_1.default.getAllBlogsByPagination);
BlogRoute.get("/trending-content", blog_controller_1.default.getAllTrendingContent);
BlogRoute.get("/featured", blog_controller_1.default.getAllFeaturedContent);
BlogRoute
    .route("/:slug")
    .get(blog_controller_1.default.getSingleBlog)
    .patch(upload_1.upload, blog_controller_1.default.updateBlog)
    .delete(blog_controller_1.default.deleteBlogBySlug);
BlogRoute
    .route("/get-blog-by-tag")
    .post(blog_controller_1.default.getBlogsByTags);
exports.default = BlogRoute;
