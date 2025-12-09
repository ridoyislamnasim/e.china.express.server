"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRepository = void 0;
// BlogRepository (TypeScript version)
const prismadatabase_1 = __importDefault(require("../../config/prismadatabase"));
const pagination_1 = require("../../utils/pagination");
class BlogRepository {
    async createBlog(payload, tx) {
        return await prismadatabase_1.default.blog.create({ data: payload });
    }
    async createBlogTag(payload) {
        return await prismadatabase_1.default.blogTag.create({ data: payload });
    }
    async findSlug(slug) {
        const result = await prismadatabase_1.default.blog.findFirst({
            where: {
                slug: slug,
            },
        });
        return result;
    }
    // Get all tags (with optional pagination)
    async findAllBlogs(offset = 0, limit = 10) {
        const [blogs, total] = await Promise.all([
            prismadatabase_1.default.blog.findMany({
                skip: offset,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prismadatabase_1.default.blog.count(),
        ]);
        return { blogs, total };
    }
    async findAllBlogTags(offset = 0, limit = 10) {
        const [blogTags, total] = await Promise.all([
            prismadatabase_1.default.blogTag.findMany({
                skip: offset,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prismadatabase_1.default.blogTag.count(),
        ]);
        return { blogTags, total };
    }
    async findBlogSlugTag(slug) {
        const result = await prismadatabase_1.default.blogTag.findFirst({
            where: {
                slug: slug,
            },
        });
        return result;
    }
    async getAllBlog() {
        return await prismadatabase_1.default.blog.findMany({ orderBy: { createdAt: "desc" } });
    }
    async getNavBar() {
        return await prismadatabase_1.default.blog.findMany({
            orderBy: { createdAt: "desc" },
        });
    }
    async getBlogBySlug(slug) {
        return await prismadatabase_1.default.blog.findFirst({
            where: { slug },
        });
    }
    async updateBlog(slug, payload) {
        return await prismadatabase_1.default.blog.update({
            where: { slug: slug },
            data: payload,
        });
    }
    async deleteBlogById(id) {
        return await prismadatabase_1.default.blog.delete({
            where: { id },
        });
    }
    async deleteBlogTagById(id) {
        return await prismadatabase_1.default.blogTag.delete({
            where: { id },
        });
    }
    async updateBlogTag(id, payload) {
        return await prismadatabase_1.default.blogTag.update({
            where: { id: id },
            data: payload,
        });
    }
    async findBlogTagBySlug(slug) {
        return prismadatabase_1.default.blogTag.findFirst({ where: { slug } });
    }
    async deleteBlog(slug) {
        return await prismadatabase_1.default.blog.delete({
            where: { slug },
        });
    }
    async getBlogsByTags(tags, tx) {
        const client = tx || prismadatabase_1.default;
        return client.blog.findMany({
            where: {
                tags: {
                    hasSome: tags,
                },
                status: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async getBlogWithPagination(payload) {
        return await (0, pagination_1.pagination)(payload, async (limit, offset, sortOrder) => {
            const [doc, totalDoc] = await Promise.all([
                prismadatabase_1.default.blog.findMany({
                    skip: offset,
                    take: limit,
                    orderBy: sortOrder,
                }),
                prismadatabase_1.default.blog.count(),
            ]);
            return { doc, totalDoc };
        });
    }
}
exports.BlogRepository = BlogRepository;
const blogRepository = new BlogRepository();
exports.default = blogRepository;
