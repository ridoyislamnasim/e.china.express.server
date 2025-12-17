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
        const { title, details, slug, industryId, topicId, status, image, tagsArray } = payload;
        const client = tx || this.prisma;
        console.log('Creating blog with tagsArray:', tagsArray);
        // Blog create with tags
        const blog = await client.blog.create({
            data: {
                title,
                details,
                slug,
                industryId: Number(industryId),
                topicId: Number(topicId),
                status,
                image,
                tags: {
                    create: (tagsArray === null || tagsArray === void 0 ? void 0 : tagsArray.map((tagId) => ({
                        tag: { connect: { id: tagId } } // connect existing tag
                    }))) || [],
                },
            },
        });
        return blog;
    }
    async addTagsToBlog(blogId, tagIds, tx) {
        const client = tx || this.prisma;
        console.log('Adding tags to blog:', blogId, tagIds);
        for (const tagId of tagIds) {
            console.log(`Processing tagId: ${tagId}, blogId: ${blogId}`);
            // already exists?
            const existing = await client.blogTagOnBlog.findFirst({
                where: {
                    blogId: blogId,
                    tagId: tagId,
                },
            });
            if (existing) {
                continue; // skip if already exists
            }
            await client.blogTagOnBlog.create({
                data: {
                    blogId: blogId,
                    tagId: tagId,
                },
            });
        }
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
    async getAllTagsByPagination(payload) {
        return await (0, pagination_1.pagination)(payload, async (limit, offset, sortOrder) => {
            const [doc, totalDoc] = await Promise.all([
                this.prisma.blogTag.findMany({
                    skip: offset,
                    take: limit,
                    // orderBy: sortOrder,
                }),
                this.prisma.blogTag.count(),
            ]);
            return { doc, totalDoc };
        });
    }
    async findBlogTag(id) {
        const result = await this.prisma.blogTag.findFirst({
            where: {
                id: id,
            },
        });
        return result;
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
    async getBlogBySlug(slug) {
        return await this.prisma.blog.findFirst({
            where: { slug },
        });
    }
    async updateBlog(slug, payload) {
        return;
        // await this.prisma.blog.update({
        //   where: { slug: slug },
        //   data: payload,
        // });
    }
    async deleteBlogById(id) {
        return await this.prisma.blog.delete({
            where: { id },
        });
    }
    async deleteBlog(slug) {
        return await this.prisma.blog.delete({
            where: { slug },
        });
    }
    async getAllBlogsByPagination(payload) {
        return await (0, pagination_1.pagination)(payload, async (limit, offset, sortOrder) => {
            const [doc, totalDoc] = await Promise.all([
                this.prisma.blog.findMany({
                    skip: offset,
                    take: limit,
                    // orderBy: sortOrder,
                    include: {
                        tags: {
                            select: {
                                tag: true
                            }
                        },
                        industry: true,
                        topic: true,
                    },
                }),
                this.prisma.blog.count(),
            ]);
            return { doc, totalDoc };
        });
    }
    //! ==============================
    // Tag
    // ==============================
    async createBlogTag(payload) {
        return await this.prisma.blogTag.create({ data: payload });
    }
    async findAllBlogTags() {
        return await this.prisma.blogTag.findMany();
    }
    async findBlogTagBySlug(slug) {
        return this.prisma.blogTag.findFirst({ where: { slug } });
    }
    async getTagById(tagId) {
        return await this.prisma.blogTag.findFirst({
            where: { id: tagId },
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
    //! ==============================
    // Create Topic
    // ==============================
    async createTopic(payload, tx) {
        const client = tx || prisma;
        return await client.topic.create({
            data: payload,
        });
    }
    async findTopicById(id) {
        return await this.prisma.topic.findFirst({
            where: { id },
        });
    }
    async findTopicBySlug(slug) {
        return await this.prisma.topic.findFirst({
            where: { slug },
        });
    }
    async getAllTopics() {
        return this.prisma.topic.findMany({
            orderBy: { createdAt: "desc" },
        });
    }
    async updateTopic(id, payload) {
        return await this.prisma.topic.update({
            where: { id },
            data: payload,
        });
    }
    async deleteTopicById(id) {
        return await this.prisma.topic.delete({
            where: { id },
        });
    }
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
    //! ==============================
    // Create Industries
    // ==============================
    async createIndustries(payload, tx) {
        const client = tx || prisma;
        return await client.industry.create({
            data: payload,
        });
    }
    async findIndustriesById(id) {
        return await this.prisma.industry.findFirst({
            where: { id },
        });
    }
    async findIndustriesBySlug(slug) {
        return await this.prisma.industry.findFirst({
            where: { slug },
        });
    }
    async getAllIndustriess() {
        return this.prisma.industry.findMany({
            orderBy: { createdAt: "desc" },
        });
    }
    async updateIndustries(id, payload) {
        return await this.prisma.industry.update({
            where: { id },
            data: payload,
        });
    }
    async deleteIndustriesById(id) {
        return await this.prisma.industry.delete({
            where: { id },
        });
    }
    async getAllIndustriesByPagination(payload) {
        return await (0, pagination_1.pagination)(payload, async (limit, offset, sortOrder) => {
            const [doc, totalDoc] = await Promise.all([
                this.prisma.industry.findMany({
                    skip: offset,
                    take: limit,
                }),
                this.prisma.industry.count(),
            ]);
            return { doc, totalDoc };
        });
    }
}
exports.BlogRepository = BlogRepository;
const prisma = new client_1.PrismaClient();
const blogRepository = new BlogRepository(prisma);
exports.default = blogRepository;
