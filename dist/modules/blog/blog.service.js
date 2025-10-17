"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const errors_1 = require("../../utils/errors");
// import { BaseService } from '../base/base.service';
const blog_repository_1 = __importDefault(require("./blog.repository"));
const ImgUploder_1 = __importDefault(require("../../middleware/upload/ImgUploder"));
const slugGenerate_1 = require("../../utils/slugGenerate");
// import { removeUploadFile } from '../../middleware/upload/removeUploadFile';
class BlogService {
    constructor(repository) {
        this.repository = repository;
    }
    async createBlog(payloadFiles, payload, tx) {
        const { title, details } = payload;
        // both  are required
        if (!title || !details)
            throw new errors_1.NotFoundError('Title and Details are required');
        const { files } = payloadFiles || {};
        if (files === null || files === void 0 ? void 0 : files.length) {
            const images = await (0, ImgUploder_1.default)(files);
            // console.log('Images uploaded is images ater upload:', images);
            for (const key in images) {
                payload[key] = images[key];
            }
        }
        payload.slug = (0, slugGenerate_1.slugGenerate)(payload.title);
        return await this.repository.createBlog(payload, tx);
    }
    async getAllBlog() {
        return await this.repository.getAllBlog();
    }
    async getBlogWithPagination(payload) {
        return await this.repository.getBlogWithPagination(payload);
    }
    async getSingleBlog(slug) {
        const blogData = await this.repository.getBlogBySlug(slug);
        if (!blogData)
            throw new errors_1.NotFoundError('Blog Not Found');
        return blogData;
    }
    async getSingleBlogWithSlug(slug) {
        const blogData = await this.repository.getBlogBySlug(slug);
        if (!blogData)
            throw new errors_1.NotFoundError('Blog Not Found');
        return blogData;
    }
    async getNavBar() {
        console.log('Fetching Navbar Data...');
        const navbarData = await this.repository.getNavBar();
        console.log('Navbar Data:', navbarData);
        if (!navbarData)
            throw new errors_1.NotFoundError('Navbar Not Found');
        return navbarData;
    }
    async updateBlog(slug, payloadFiles, payload) {
        const { files } = payloadFiles || {};
        let oldBlog = null;
        oldBlog = await this.repository.getBlogBySlug(slug);
        // Check if the title has changed, and update the slug if necessary
        if (oldBlog && payload.title && payload.title !== oldBlog.title) {
            payload.slug = (0, slugGenerate_1.slugGenerate)(payload.title);
        }
        if (files === null || files === void 0 ? void 0 : files.length) {
            const images = await (0, ImgUploder_1.default)(files);
            for (const key in images) {
                payload[key] = images[key];
            }
        }
        const blogData = await this.repository.updateBlog(slug, payload);
        // Remove old files if replaced
        if ((files === null || files === void 0 ? void 0 : files.length) && (oldBlog === null || oldBlog === void 0 ? void 0 : oldBlog.image)) {
            // await removeUploadFile(oldBlog.image);
        }
        return blogData;
    }
    async updateBlogStatus(slug, status) {
        if (!status)
            throw new errors_1.NotFoundError('Status is required');
        // status = status === 'true';
        return await this.repository.updateBlog(slug, { status });
    }
    async deleteBlog(slug) {
        // TODO: Remove files if needed
        return await this.repository.deleteBlog(slug); // Or use a delete method
    }
}
exports.BlogService = BlogService;
exports.default = new BlogService(blog_repository_1.default);
