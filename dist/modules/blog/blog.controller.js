"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogController = void 0;
const catchError_1 = __importDefault(require("../../middleware/errors/catchError"));
const responseHandler_1 = require("../../utils/responseHandler");
const withTransaction_1 = __importDefault(require("../../middleware/transactions/withTransaction"));
const blog_service_1 = __importDefault(require("./blog.service"));
class BlogController {
    constructor() {
        //done
        this.createBlog = (0, withTransaction_1.default)(async (req, res, next, tx) => {
            const payloadFiles = {
                files: req.files,
            };
            const { image, title, slug, author, details, tags, status, createdAt, updatedAt, files } = req.body;
            const payload = {
                image,
                title,
                slug,
                author,
                details,
                tags,
                status,
                createdAt,
                updatedAt,
                files,
            };
            console.log("blog playload", payload);
            const blogResult = await blog_service_1.default.createBlog(payloadFiles, payload, tx);
            const resDoc = (0, responseHandler_1.responseHandler)(201, "Blog Created successfully", blogResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.createBlogTag = (0, catchError_1.default)(async (req, res, next) => {
            const title = req.body.title;
            const result = await blog_service_1.default.createBlogTag(title);
            const resDoc = (0, responseHandler_1.responseHandler)(201, "Blog Created successfully", result);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getSingleBlog = (0, catchError_1.default)(async (req, res, next) => {
            const slug = req.params.slug;
            const blogResult = await blog_service_1.default.getSingleBlog(slug);
            const resDoc = (0, responseHandler_1.responseHandler)(201, "Single Blog successfully", blogResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.updateBlogBySlug = (0, catchError_1.default)(async (req, res, next) => {
            const slugStr = req.params.slug;
            const { image, title, slug, author, details, tags, status, files } = req.body;
            const payload = { image, title, slug, author, details, tags, status, files };
            const blogResult = await blog_service_1.default.updateBlog(slugStr, payload);
            const resDoc = (0, responseHandler_1.responseHandler)(201, "Blog Status Update successfully", blogResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.updateBlogTagBySlug = (0, catchError_1.default)(async (req, res, next) => {
            const slugStr = req.params.slug;
            const { title, slug } = req.body;
            const payload = { title, slug };
            const blogResult = await blog_service_1.default.updateBlogTag(slugStr, payload);
            const resDoc = (0, responseHandler_1.responseHandler)(201, "Blog Status Update successfully", blogResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.deleteBlogTagBySlug = (0, catchError_1.default)(async (req, res) => {
            const slugStr = req.params.slug;
            const result = await blog_service_1.default.deleteBlogTagBySlug(slugStr);
            const resDoc = (0, responseHandler_1.responseHandler)(200, "Blog tag deleted successfully", result);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.deleteBlogBySlug = (0, catchError_1.default)(async (req, res) => {
            const slugStr = req.params.slug;
            const result = await blog_service_1.default.deleteBlogBySlug(slugStr);
            const resDoc = (0, responseHandler_1.responseHandler)(200, "Blog deleted successfully", result);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getBlogsByTags = (0, withTransaction_1.default)(async (req, res, next, tx) => {
            const { tags } = req.body; // expect array of strings from checkboxes
            if (!tags || !Array.isArray(tags) || tags.length === 0) {
                return res.status(400).json((0, responseHandler_1.responseHandler)(400, "Tags array is required"));
            }
            console.log("Filtering blogs by tags:", tags);
            // call service with tx (optional, in case you want transaction for complex logic)
            const blogs = await blog_service_1.default.getBlogsByTags(tags, tx);
            const resDoc = (0, responseHandler_1.responseHandler)(200, "Blogs fetched successfully", blogs);
            res.status(resDoc.statusCode).json(resDoc);
        });
        //todo
        this.getSingleBlogWithSlug = (0, catchError_1.default)(async (req, res, next) => {
            const slug = req.params.slug;
            const blogResult = await blog_service_1.default.getSingleBlogWithSlug(slug);
            const resDoc = (0, responseHandler_1.responseHandler)(201, "Single Blog successfully", blogResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getBlogWithPagination = (0, catchError_1.default)(async (req, res, next) => {
            let payload = {
                page: req.query.page,
                limit: req.query.limit,
                order: req.query.order,
            };
            const blog = await blog_service_1.default.getBlogWithPagination(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(200, "Blogs get successfully", blog);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getNavBar = (0, catchError_1.default)(async (req, res, next) => {
            console.log("Fetching Navbar Data...");
            const navBarResult = await blog_service_1.default.getNavBar();
            const resDoc = (0, responseHandler_1.responseHandler)(201, "Navbar successfully", navBarResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.updateBlog = (0, catchError_1.default)(async (req, res, next) => {
            const slug = req.params.slug;
            const payloadFiles = {
                files: req.files,
            };
            const payload = {
                title: req.body.title,
                details: req.body.details,
            };
            const blogResult = await blog_service_1.default.updateBlog(slug, payload);
            const resDoc = (0, responseHandler_1.responseHandler)(201, "Blog Update successfully", blogResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.deleteBlog = (0, catchError_1.default)(async (req, res, next) => {
            const slug = req.params.slug;
            const blogResult = await blog_service_1.default.deleteBlog(slug);
            const resDoc = (0, responseHandler_1.responseHandler)(200, "Blog Deleted successfully");
            res.status(resDoc.statusCode).json(resDoc);
        });
    }
    async getAllBlogs(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const resDoc = await blog_service_1.default.getAllBlogs(page, limit);
            const result = (0, responseHandler_1.responseHandler)(200, "Blogs fetched successfully", resDoc);
            res.status(result.statusCode).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async getAllBlogTags(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const resDoc = await blog_service_1.default.getAllBlogTags(page, limit);
            const result = (0, responseHandler_1.responseHandler)(200, "Blog tags fetched successfully", resDoc);
            res.status(result.statusCode).json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.BlogController = BlogController;
exports.default = new BlogController();
