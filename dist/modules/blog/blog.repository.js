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
        console.log('Creating blog with payload:', payload);
        return await prismadatabase_1.default.blog.create({ data: payload });
    }
    async getAllBlog() {
        return await prismadatabase_1.default.blog.findMany({ orderBy: { createdAt: 'desc' } });
    }
    async getNavBar() {
        return await prismadatabase_1.default.blog.findMany({
            orderBy: { createdAt: 'desc' },
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
    async deleteBlog(slug) {
        return await prismadatabase_1.default.blog.delete({
            where: { slug },
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
