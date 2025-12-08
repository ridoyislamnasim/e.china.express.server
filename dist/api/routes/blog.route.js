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
// BlogRoute.use(jwtAuth());
//done
BlogRoute.route("/").post(upload_1.upload.any(), blog_controller_1.default.createBlog);
BlogRoute.route("/create-tag").post(blog_controller_1.default.createBlogTag);
BlogRoute.route("/").get(blog_controller_1.default.getAllBlogs);
BlogRoute.route("/blog-tags").post(blog_controller_1.default.getAllBlogTags);
BlogRoute.get("/:slug", blog_controller_1.default.getSingleBlog);
BlogRoute.patch("/:slug", blog_controller_1.default.updateBlogBySlug);
BlogRoute.patch("/blog-tags/:slug", blog_controller_1.default.updateBlogTagBySlug);
BlogRoute.delete("/:slug", blog_controller_1.default.deleteBlogBySlug);
BlogRoute.delete("/blog-tags/:slug", blog_controller_1.default.deleteBlogTagBySlug);
//todo
BlogRoute.get("/pagination", blog_controller_1.default.getBlogWithPagination);
BlogRoute.route("/:slug").put(upload_1.upload.any(), blog_controller_1.default.updateBlog);
BlogRoute.delete("/:slug", blog_controller_1.default.deleteBlog);
exports.default = BlogRoute;
