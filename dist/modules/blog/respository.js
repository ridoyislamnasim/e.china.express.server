"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
exports.default = new (class BlogRepository {
    constructor() {
        this.prisma = client_1.Prisma;
    }
    async getAllBlogs(page, limit) {
        const skip = (page - 1) * limit;
        const [blogs, total] = await Promise.all([
            this.prisma.blog.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            this.prisma.blog.count(),
        ]);
        return { blogs, total };
    }
    async getBlogById(id) {
        return await this.prisma.blog.findUnique({ where: { id } });
    }
    async createBlog(data) {
        return await this.prisma.blog.create({ data });
    }
    async updateBlog(id, data) {
        return await this.prisma.blog.update({
            where: { id },
            data,
        });
    }
    async deleteBlog(id) {
        return await this.prisma.blog.delete({ where: { id } });
    }
})();
