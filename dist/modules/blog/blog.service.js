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
    //done
    async getAllBlogs(page = 1, limit = 10) {
        if (page <= 0 || limit <= 0) {
            const error = new Error("Oops! Page number and items per page should be at least 1.");
            error.statusCode = 400;
            throw error;
        }
        const offset = (page - 1) * limit;
        return await blog_repository_1.default.findAllBlogs(offset, limit);
    }
    async getAllBlogTags(page = 1, limit = 10) {
        if (page <= 0 || limit <= 0) {
            const error = new Error("Oops! Page number and items per page should be at least 1.");
            error.statusCode = 400;
            throw error;
        }
        const offset = (page - 1) * limit;
        return await blog_repository_1.default.findAllBlogTags(offset, limit);
    }
    async createBlog(payloadFiles, payload, tx) {
        const { image, title, slug, author, details, tags, status, createdAt, updatedAt } = payload;
        // both  are required
        if (!title || !details)
            throw new errors_1.NotFoundError("Title and Details are required.");
        const { files } = payloadFiles || {};
        if (files === null || files === void 0 ? void 0 : files.length) {
            const images = await (0, ImgUploder_1.default)(files);
            // console.log('Images uploaded is images ater upload:', images);
            for (const key in images) {
                payload[key] = images[key];
            }
        }
        payload.slug = (0, slugGenerate_1.slugGenerate)(payload.title);
        //? Optional: Ensures the slug is unique. If the generated slug already exists in the DB,
        //? appends a counter (e.g., "-1", "-2") until a unique slug is found. Can be removed if uniqueness is not a concern.
        // let isAvailableSlug = await this.repository.findSlug(payload.slug)
        // let counter = 0;
        // while (isAvailableSlug !== null){
        //   counter++
        //   payload.slug =`${slugGenerate(payload.title)}-${counter}`;
        //   isAvailableSlug = await this.repository.findSlug(payload.slug)
        // }
        return await this.repository.createBlog(payload, tx);
    }
    async createBlogTag(title) {
        if (!title) {
            const error = new Error("Missing required field: title");
            error.statusCode = 400;
            throw error;
        }
        try {
            let slug = (0, slugGenerate_1.slugGenerate)(title);
            const existingSlug = await this.repository.findBlogSlugTag(slug);
            if (existingSlug) {
                const error = new Error(`Blog tag with title "${title}" already exists.`);
                error.statusCode = 400;
                throw error;
            }
            const payload = { slug, title };
            const newTag = await this.repository.createBlogTag(payload);
            return newTag;
        }
        catch (error) {
            console.error("Error creating blog tag:", error);
            throw error;
        }
    }
    async getSingleBlog(slug) {
        const blogData = await this.repository.getBlogBySlug(slug);
        if (!blogData)
            throw new errors_1.NotFoundError("Blog Not Found");
        return blogData;
    }
    async updateBlog(slug, payload) {
        if (!payload.title || !payload.details) {
            const error = new Error(`Blog with title "${payload.title}" are required.`);
            error.statusCode = 400;
            throw error;
        }
        payload.slug = (0, slugGenerate_1.slugGenerate)(payload.title);
        const existingBlog = await this.repository.findSlug(slug);
        if (!existingBlog) {
            const error = new Error(`Blog with title "${payload.title}" does not exists.`);
            error.statusCode = 400;
            throw error;
        }
        else {
            const doesNewTItleExist = await this.repository.findSlug(payload.slug);
            if (doesNewTItleExist) {
                const error = new Error(`Blog with title "${payload.title}" already exists.`);
                error.statusCode = 400;
                throw error;
            }
        }
        const updatedBlog = await this.repository.updateBlog(slug, payload);
        if (!updatedBlog) {
            const error = new Error(`Blog with title "${payload.title}" is unable to update.`);
            error.statusCode = 400;
            throw error;
        }
        return updatedBlog;
    }
    async updateBlogTag(slug, payload) {
        const existing = await this.repository.findBlogSlugTag(slug);
        if (!existing) {
            const error = new Error(`Blog tag "${payload.title}" does not exists.`);
            error.statusCode = 400;
            throw error;
        }
        const { id } = existing;
        const updatedTag = await this.repository.updateBlogTag(id, payload);
        return updatedTag;
    }
    async deleteBlogBySlug(slug) {
        const existing = await this.repository.findSlug(slug);
        if (!existing) {
            const error = new Error(`Blog "${slug}" not found.`);
            error.statusCode = 404;
            throw error;
        }
        const deleted = await this.repository.deleteBlogById(existing.id);
        return deleted;
    }
    async deleteBlogTagBySlug(slug) {
        const existing = await this.repository.findBlogSlugTag(slug);
        if (!existing) {
            const error = new Error(`Blog tag "${slug}" not found.`);
            error.statusCode = 404;
            throw error;
        }
        const deleted = await this.repository.deleteBlogTagById(existing.id);
        return deleted;
    }
    async getBlogsByTags(tags, tx) {
        const blogs = await blog_repository_1.default.getBlogsByTags(tags, tx);
        return blogs;
    }
    //todo
    async getBlogWithPagination(payload) {
        return await this.repository.getBlogWithPagination(payload);
    }
    async getSingleBlogWithSlug(slug) {
        const blogData = await this.repository.getBlogBySlug(slug);
        if (!blogData)
            throw new errors_1.NotFoundError("Blog Not Found");
        return blogData;
    }
    async getNavBar() {
        console.log("Fetching Navbar Data...");
        const navbarData = await this.repository.getNavBar();
        console.log("Navbar Data:", navbarData);
        if (!navbarData)
            throw new errors_1.NotFoundError("Navbar Not Found");
        return navbarData;
    }
    // async updateBlog(slug: string, payloadFiles: any, payload: any) {
    //   const { files } = payloadFiles || {};
    //   let oldBlog = null;
    //   oldBlog = await this.repository.getBlogBySlug(slug);
    // // Check if the title has changed, and update the slug if necessary
    // if (oldBlog && payload.title && payload.title !== oldBlog.title) {
    //   payload.slug = slugGenerate(payload.title);
    // }
    //   if (files?.length) {
    //     const images = await ImgUploader(files);
    //     for (const key in images) {
    //       payload[key] = images[key];
    //     }
    //   }
    //   const blogData = await this.repository.updateBlog(slug, payload);
    //   // Remove old files if replaced
    //   if (files?.length && oldBlog?.image) {
    //     // await removeUploadFile(oldBlog.image);
    //   }
    //   return blogData;
    // }
    async deleteBlog(slug) {
        // TODO: Remove files if needed
        return await this.repository.deleteBlog(slug); // Or use a delete method
    }
    // ==============================
    // Create Topic
    // ==============================
    async createTopic(payload, tx) {
        const { title, } = payload;
        if (!title) {
            const error = new Error("Missing required field: title ");
            error.statusCode = 400;
            throw error;
        }
        let slug = (0, slugGenerate_1.slugGenerate)(title);
        const existing = await this.repository.findTopicBySlug(slug);
        if (existing) {
            const error = new Error(`Topic with title "${title}" already exists.`);
            error.statusCode = 400;
            throw error;
        }
        const data = {
            title,
            slug,
        };
        const topic = await this.repository.createTopic(data, tx);
        return topic;
    }
    // ==============================
    // Get All Topics
    // ==============================
    async getAllTopics() {
        return await this.repository.getAllTopics();
    }
    // ==============================
    // Get Single Topic
    // ==============================
    async getSingleTopic(id) {
        const existing = await this.repository.findTopicById(id);
        if (!existing) {
            const error = new Error(`Topic with id "${id}" not found.`);
            error.statusCode = 404;
            throw error;
        }
        return existing;
    }
    // ==============================
    // Update Topic
    // ==============================
    async updateTopic(id, payload) {
        const existing = await this.repository.findTopicById(id);
        if (!existing) {
            const error = new Error(`Topic does not exist.`);
            error.statusCode = 400;
            throw error;
        }
        if (payload.title) {
            const slug = (0, slugGenerate_1.slugGenerate)(payload.title);
            const ifSlugExist = await this.repository.findTopicBySlug(slug);
            if (ifSlugExist) {
                const error = new Error(`Topic already exist.`);
                error.statusCode = 400;
                throw error;
            }
            payload.slug = slug;
        }
        const updated = await this.repository.updateTopic(id, payload);
        return updated;
    }
    // ==============================
    // Delete Topic
    // ==============================
    async deleteTopic(id) {
        const existing = await this.repository.findTopicById(id);
        if (!existing) {
            const error = new Error(`Topic not found.`);
            error.statusCode = 404;
            throw error;
        }
        return await this.repository.deleteTopicById(id);
    }
    // ==============================
    // Pagination
    // ==============================
    async getAllTopicByPagination(payload) {
        return await this.repository.getAllTopicByPagination(payload);
    }
}
exports.BlogService = BlogService;
exports.default = new BlogService(blog_repository_1.default);
