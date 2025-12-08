"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchError_1 = __importDefault(require("../../middleware/errors/catchError"));
const blog_service_1 = __importDefault(require("./blog.service"));
const responseHandler_1 = require("../../utils/responseHandler");
exports.default = new (class BlogController {
    constructor() {
        this.getAllBlog = (0, catchError_1.default)(async (req, res) => {
            const data = await blog_service_1.default.getAllBlogs(req.query);
            const resDoc = (0, responseHandler_1.responseHandler)(200, "Blogs retrieved successfully", data);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getBlogById = (0, catchError_1.default)(async (req, res) => {
            const blog = await blog_service_1.default.getBlogById(req.params.id);
            const resDoc = (0, responseHandler_1.responseHandler)(200, "Blog retrieved successfully", blog);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.createBlog = (0, catchError_1.default)(async (req, res) => {
            const blog = await blog_service_1.default.createBlog(req.body);
            const resDoc = (0, responseHandler_1.responseHandler)(201, "Blog created successfully", blog);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.updateBlog = (0, catchError_1.default)(async (req, res) => {
            const blog = await blog_service_1.default.updateBlog(req.params.id, req.body);
            const resDoc = (0, responseHandler_1.responseHandler)(200, "Blog updated successfully", blog);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.deleteBlog = (0, catchError_1.default)(async (req, res) => {
            const result = await blog_service_1.default.deleteBlog(req.params.id);
            const resDoc = (0, responseHandler_1.responseHandler)(200, result.message, result.data);
            res.status(resDoc.statusCode).json(resDoc);
        });
    }
})();
