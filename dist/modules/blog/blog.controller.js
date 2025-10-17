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
        this.createBlog = (0, withTransaction_1.default)(async (req, res, next, tx) => {
            const payloadFiles = {
                files: req.files,
            };
            const payload = {
                title: req.body.title,
                details: req.body.details,
            };
            console.log("blog playload", payload);
            const blogResult = await blog_service_1.default.createBlog(payloadFiles, payload, tx);
            const resDoc = (0, responseHandler_1.responseHandler)(201, 'Blog Created successfully', blogResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getAllBlog = (0, catchError_1.default)(async (req, res, next) => {
            const blogResult = await blog_service_1.default.getAllBlog();
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Get All Blogs', blogResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getBlogWithPagination = (0, catchError_1.default)(async (req, res, next) => {
            let payload = {
                page: req.query.page,
                limit: req.query.limit,
                order: req.query.order,
            };
            const blog = await blog_service_1.default.getBlogWithPagination(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Blogs get successfully', blog);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getSingleBlog = (0, catchError_1.default)(async (req, res, next) => {
            const slug = req.params.slug;
            const blogResult = await blog_service_1.default.getSingleBlog(slug);
            const resDoc = (0, responseHandler_1.responseHandler)(201, 'Single Blog successfully', blogResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getSingleBlogWithSlug = (0, catchError_1.default)(async (req, res, next) => {
            const slug = req.params.slug;
            const blogResult = await blog_service_1.default.getSingleBlogWithSlug(slug);
            const resDoc = (0, responseHandler_1.responseHandler)(201, 'Single Blog successfully', blogResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getNavBar = (0, catchError_1.default)(async (req, res, next) => {
            console.log('Fetching Navbar Data...');
            const navBarResult = await blog_service_1.default.getNavBar();
            const resDoc = (0, responseHandler_1.responseHandler)(201, 'Navbar successfully', navBarResult);
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
            const blogResult = await blog_service_1.default.updateBlog(slug, payloadFiles, payload);
            const resDoc = (0, responseHandler_1.responseHandler)(201, 'Blog Update successfully');
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.updateBlogStatus = (0, catchError_1.default)(async (req, res, next) => {
            const slug = req.params.slug;
            const status = req.query.status;
            const blogResult = await blog_service_1.default.updateBlogStatus(slug, status);
            const resDoc = (0, responseHandler_1.responseHandler)(201, 'Blog Status Update successfully');
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.deleteBlog = (0, catchError_1.default)(async (req, res, next) => {
            const slug = req.params.slug;
            const blogResult = await blog_service_1.default.deleteBlog(slug);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Blog Deleted successfully');
            res.status(resDoc.statusCode).json(resDoc);
        });
    }
}
exports.BlogController = BlogController;
exports.default = new BlogController();
