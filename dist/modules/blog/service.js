"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const blog_repository_1 = __importDefault(require("./blog.repository"));
const errors_1 = require("../../utils/errors");
exports.default = new (class BlogService {
    async getAllBlogs(payload) {
        const page = Number(payload.page) || 1;
        const limit = Number(payload.limit) || 10;
        if (page <= 0 || limit <= 0) {
            const err = new Error("Please provide valid page & limit values.");
            err.statusCode = 400;
            throw err;
        }
        return await blog_repository_1.default.getAllBlogs(page, limit);
    }
    async getBlogById(id) {
        const blogId = Number(id);
        if (isNaN(blogId)) {
            const err = new Error("Invalid blog ID.");
            err.statusCode = 400;
            throw err;
        }
        const blog = await blog_repository_1.default.getBlogById(blogId);
        if (!blog)
            throw new errors_1.NotFoundError(`Blog with ID ${blogId} not found.`);
        return blog;
    }
    async createBlog(data) {
        return await blog_repository_1.default.createBlog(data);
    }
    async updateBlog(id, data) {
        const blogId = Number(id);
        const exists = await blog_repository_1.default.getBlogById(blogId);
        if (!exists)
            throw new errors_1.NotFoundError(`Blog with ID ${blogId} not found.`);
        return await blog_repository_1.default.updateBlog(blogId, data);
    }
    async deleteBlog(id) {
        const blogId = Number(id);
        const exists = await blog_repository_1.default.getBlogById(blogId);
        if (!exists)
            throw new errors_1.NotFoundError(`Blog with ID ${blogId} not found.`);
        const deleted = await blog_repository_1.default.deleteBlog(blogId);
        return {
            message: `Blog with ID ${blogId} deleted successfully.`,
            data: deleted,
        };
    }
})();
