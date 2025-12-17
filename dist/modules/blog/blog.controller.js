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
        // ==============================
        //  Blog
        // ==============================
        // getAllBlogsByPagination = catchError(async (req: Request, res: Response, next: NextFunction) => {
        //   let payload = {
        //     page: req.query.page,
        //     limit: req.query.limit,
        //     order: req.query.order,
        //   };
        //   const blog = await BlogService.getAllBlogsByPagination(payload);
        //   const resDoc = responseHandler(200, "Blogs get successfully", blog);
        //   res.status(resDoc.statusCode).json(resDoc);
        // });
        this.createBlog = (0, withTransaction_1.default)(async (req, res, next, tx) => {
            var _a, _b, _c, _d;
            const user = (_d = (_c = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_info_encrypted) === null || _b === void 0 ? void 0 : _b.id) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : null;
            const payloadFiles = {
                files: req.files,
            };
            const { title, details, tagIds, industryId, topicId, status } = req.body;
            const payload = {
                user,
                title,
                details,
                tagIds,
                industryId,
                topicId,
                status
            };
            const blogResult = await blog_service_1.default.createBlog(payloadFiles, payload, tx);
            const resDoc = (0, responseHandler_1.responseHandler)(201, "Blog Created successfully", blogResult);
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
        this.getSingleBlogWithSlug = (0, catchError_1.default)(async (req, res, next) => {
            const slug = req.params.slug;
            const blogResult = await blog_service_1.default.getSingleBlogWithSlug(slug);
            const resDoc = (0, responseHandler_1.responseHandler)(201, "Single Blog successfully", blogResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getAllBlogsByPagination = (0, catchError_1.default)(async (req, res, next) => {
            let payload = {
                page: req.query.page,
                limit: req.query.limit,
                order: req.query.order,
            };
            const blog = await blog_service_1.default.getAllBlogsByPagination(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(200, "Blogs get successfully", blog);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.deleteBlogBySlug = (0, catchError_1.default)(async (req, res) => {
            const slugStr = req.params.slug;
            const result = await blog_service_1.default.deleteBlogBySlug(slugStr);
            const resDoc = (0, responseHandler_1.responseHandler)(200, "Blog deleted successfully", result);
            res.status(resDoc.statusCode).json(resDoc);
        });
        // ==============================
        //  Tag
        // ==============================
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
        this.getSingleBlogTag = (0, catchError_1.default)(async (req, res, next) => {
            const tagId = Number(req.params.id);
            const blogResult = await blog_service_1.default.getSingleBlogTag(tagId);
            const resDoc = (0, responseHandler_1.responseHandler)(201, "single tag successfully", blogResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.updateTag = (0, catchError_1.default)(async (req, res, next) => {
            const id = Number(req.params.id);
            const { title } = req.body;
            const payload = { title };
            const blogResult = await blog_service_1.default.updateBlogTag(id, payload);
            const resDoc = (0, responseHandler_1.responseHandler)(201, "Blog Status Update successfully", blogResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.deleteTag = (0, catchError_1.default)(async (req, res) => {
            const slugStr = req.params.slug;
            const result = await blog_service_1.default.deleteTag(slugStr);
            const resDoc = (0, responseHandler_1.responseHandler)(200, "Blog tag deleted successfully", result);
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
        this.getAllTagsByPagination = (0, withTransaction_1.default)(async (req, res, next, tx) => {
            let payload = {
                page: req.query.page,
                limit: req.query.limit,
                order: req.query.order,
            };
            const blog = await blog_service_1.default.getAllTagsByPagination(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(200, "Tags get successfully", blog);
            res.status(resDoc.statusCode).json(resDoc);
        });
        // ==============================
        //  Topic
        // ==============================
        this.createTopic = (0, withTransaction_1.default)(async (req, res, next, tx) => {
            const { title } = req.body;
            const payload = {
                title,
            };
            const result = await blog_service_1.default.createTopic(payload, tx);
            const resDoc = (0, responseHandler_1.responseHandler)(201, "Topic created successfully", result);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getAllTopics = (0, catchError_1.default)(async (req, res, next) => {
            const result = await blog_service_1.default.getAllTopics();
            const resDoc = (0, responseHandler_1.responseHandler)(200, "Topics fetched successfully", result);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getSingleTopic = (0, catchError_1.default)(async (req, res, next) => {
            const topicId = Number(req.params.id);
            const result = await blog_service_1.default.getSingleTopic(topicId);
            const resDoc = (0, responseHandler_1.responseHandler)(200, "Topic fetched successfully", result);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.updateTopic = (0, catchError_1.default)(async (req, res, next) => {
            const topicId = Number(req.params.id);
            const { title } = req.body;
            const payload = {
                title
            };
            const result = await blog_service_1.default.updateTopic(topicId, payload);
            const resDoc = (0, responseHandler_1.responseHandler)(200, "Topic updated successfully", result);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.deleteTopic = (0, catchError_1.default)(async (req, res, next) => {
            const topicId = Number(req.params.id);
            const result = await blog_service_1.default.deleteTopic(topicId);
            const resDoc = (0, responseHandler_1.responseHandler)(200, "Topic deleted successfully", result);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getAllTopicByPagination = (0, catchError_1.default)(async (req, res, next) => {
            const payload = {
                page: req.query.page || 1,
                limit: req.query.limit || 10,
                order: req.query.order || "asc",
            };
            console.log("🚀 ~ blog.controller.ts:272 ~ BlogController ~ payload:", payload);
            const result = await blog_service_1.default.getAllTopicByPagination(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(200, "Topics fetched successfully", result);
            res.status(resDoc.statusCode).json(resDoc);
        });
        // ==============================
        //  Industries
        // ==============================
        this.createIndustries = (0, withTransaction_1.default)(async (req, res, next, tx) => {
            const { title } = req.body;
            const payload = {
                title,
            };
            const result = await blog_service_1.default.createIndustries(payload, tx);
            const resDoc = (0, responseHandler_1.responseHandler)(201, "Industries created successfully", result);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getAllIndustriess = (0, catchError_1.default)(async (req, res, next) => {
            const result = await blog_service_1.default.getAllIndustriess();
            const resDoc = (0, responseHandler_1.responseHandler)(200, "Industriess fetched successfully", result);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getSingleIndustries = (0, catchError_1.default)(async (req, res, next) => {
            const topicId = Number(req.params.id);
            const result = await blog_service_1.default.getSingleIndustries(topicId);
            const resDoc = (0, responseHandler_1.responseHandler)(200, "Industries fetched successfully", result);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.updateIndustries = (0, catchError_1.default)(async (req, res, next) => {
            const topicId = Number(req.params.id);
            const { title } = req.body;
            const payload = {
                title
            };
            const result = await blog_service_1.default.updateIndustries(topicId, payload);
            const resDoc = (0, responseHandler_1.responseHandler)(200, "Industries updated successfully", result);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.deleteIndustries = (0, catchError_1.default)(async (req, res, next) => {
            const topicId = Number(req.params.id);
            const result = await blog_service_1.default.deleteIndustries(topicId);
            const resDoc = (0, responseHandler_1.responseHandler)(200, "Industries deleted successfully", result);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getAllIndustriesByPagination = (0, catchError_1.default)(async (req, res, next) => {
            const payload = {
                page: req.query.page || 1,
                limit: req.query.limit || 10,
                order: req.query.order || "asc",
            };
            console.log("🚀 ~ blog.controller.ts:272 ~ BlogController ~ payload:", payload);
            const result = await blog_service_1.default.getAllIndustriesByPagination(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(200, "Industriess fetched successfully", result);
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
        const resDoc = await blog_service_1.default.getAllBlogTags();
        const result = (0, responseHandler_1.responseHandler)(200, "Blog tags fetched successfully", resDoc);
        res.status(result.statusCode).json(result);
    }
}
exports.BlogController = BlogController;
exports.default = new BlogController();
