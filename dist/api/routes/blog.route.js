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
BlogRoute.route("/")
    .post(upload_1.upload.any(), blog_controller_1.default.createBlog)
    .get(blog_controller_1.default.getAllBlog);
BlogRoute.get("/pagination", blog_controller_1.default.getBlogWithPagination);
BlogRoute.get("/single/:slug", blog_controller_1.default.getSingleBlog);
BlogRoute.route("/:slug")
    .put(upload_1.upload.any(), blog_controller_1.default.updateBlog)
    .delete(blog_controller_1.default.deleteBlog);
exports.default = BlogRoute;
