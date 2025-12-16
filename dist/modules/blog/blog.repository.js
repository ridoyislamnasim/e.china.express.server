"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRepository = void 0;
const pagination_1 = require("../../utils/pagination");
const client_1 = require("@prisma/client");
const base_repository_1 = require("../base/base.repository");
class BlogRepository extends base_repository_1.BaseRepository {
    constructor(prisma) {
        super(prisma.blog);
        this.prisma = prisma;
    }
    async createBlog(payload, tx) {
        return await this.prisma.blog.create({ data: payload });
    }
    async createBlogTag(payload) {
        return await this.prisma.blogTag.create({ data: payload });
    }
    async findSlug(slug) {
        const result = await this.prisma.blog.findFirst({
            where: {
                slug: slug,
            },
        });
        return result;
    }
    // Get all tags (with optional pagination)
    async findAllBlogs(offset = 0, limit = 10) {
        const [blogs, total] = await Promise.all([
            this.prisma.blog.findMany({
                skip: offset,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            this.prisma.blog.count(),
        ]);
        return { blogs, total };
    }
    async findAllBlogTags(offset = 0, limit = 10) {
        var _a, _b;
        const [blogTags, totalResult] = await Promise.all([
            this.prisma.blogTag.findMany({
                skip: offset,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            this.prisma.$queryRaw `SELECT COUNT(*)::int AS count FROM "BlogTag"`,
        ]);
        const total = (_b = (_a = totalResult[0]) === null || _a === void 0 ? void 0 : _a.count) !== null && _b !== void 0 ? _b : 0;
        return { blogTags, total };
    }
    async findBlogSlugTag(slug) {
        const result = await this.prisma.blogTag.findFirst({
            where: {
                slug: slug,
            },
        });
        return result;
    }
    async getAllBlog() {
        return await this.prisma.blog.findMany({ orderBy: { createdAt: "desc" } });
    }
    async getNavBar() {
        return await this.prisma.blog.findMany({
            orderBy: { createdAt: "desc" },
        });
    }
    async getBlogBySlug(slug) {
        return await this.prisma.blog.findFirst({
            where: { slug },
        });
    }
    async updateBlog(slug, payload) {
        return await this.prisma.blog.update({
            where: { slug: slug },
            data: payload,
        });
    }
    async deleteBlogById(id) {
        return await this.prisma.blog.delete({
            where: { id },
        });
    }
    async deleteBlogTagById(id) {
        return await this.prisma.blogTag.delete({
            where: { id },
        });
    }
    async updateBlogTag(id, payload) {
        return await this.prisma.blogTag.update({
            where: { id: id },
            data: payload,
        });
    }
    async findBlogTagBySlug(slug) {
        return this.prisma.blogTag.findFirst({ where: { slug } });
    }
    async deleteBlog(slug) {
        return await this.prisma.blog.delete({
            where: { slug },
        });
    }
    async getBlogsByTags(tags, tx) {
        const client = tx || prisma;
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
                this.prisma.blog.findMany({
                    skip: offset,
                    take: limit,
                    orderBy: sortOrder,
                }),
                this.prisma.blog.count(),
            ]);
            return { doc, totalDoc };
        });
    }
    //! ==============================
    // Create Topic
    // ==============================
    async createTopic(payload, tx) {
        const client = tx || prisma;
        return await client.topic.create({
            data: payload,
        });
    }
    // ==============================
    // Find Topic by ID
    // ==============================
    async findTopicById(id) {
        return await this.prisma.topic.findFirst({
            where: { id },
        });
    }
    // ==============================
    // Find Topic by Slug
    // ==============================
    async findTopicBySlug(slug) {
        return await this.prisma.topic.findFirst({
            where: { slug },
        });
    }
    // ==============================
    // Get All Topics (with pagination)
    // ==============================
    async getAllTopics() {
        return this.prisma.topic.findMany({
            orderBy: { createdAt: "desc" },
        });
    }
    // ==============================
    // Update Topic
    // ==============================
    async updateTopic(id, payload) {
        return await this.prisma.topic.update({
            where: { id },
            data: payload,
        });
    }
    // ==============================
    // Delete Topic
    // ==============================
    async deleteTopicById(id) {
        return await this.prisma.topic.delete({
            where: { id },
        });
    }
    // ==============================
    // Pagination Helper
    // ==============================
    async getAllTopicByPagination(payload) {
        return await (0, pagination_1.pagination)(payload, async (limit, offset, sortOrder) => {
            const [doc, totalDoc] = await Promise.all([
                this.prisma.topic.findMany({
                    skip: offset,
                    take: limit,
                }),
                this.prisma.topic.count(),
            ]);
            return { doc, totalDoc };
        });
    }
}
exports.BlogRepository = BlogRepository;
const prisma = new client_1.PrismaClient();
const blogRepository = new BlogRepository(prisma);
exports.default = blogRepository;
