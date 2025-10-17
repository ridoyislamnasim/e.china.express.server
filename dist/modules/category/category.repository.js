"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRepository = void 0;
// CategoryRepository (TypeScript version)
const prismadatabase_1 = __importDefault(require("../../config/prismadatabase"));
const pagination_1 = require("../../utils/pagination");
class CategoryRepository {
    async createCategory(payload, tx) {
        return await prismadatabase_1.default.category.create({ data: payload });
    }
    async getAllCategory() {
        return await prismadatabase_1.default.category.findMany({ orderBy: { createdAt: 'desc' } });
    }
    async getNavBar() {
        return await prismadatabase_1.default.category.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                subCategories: {
                    include: {
                        childCategories: {
                            include: {
                                subChildCategories: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async getCategoryById(categorySlug) {
        return await prismadatabase_1.default.category.findUnique({
            where: { slug: categorySlug },
            include: {
                subCategories: true,
            },
        });
    }
    async getCategoryBySlug(slug) {
        return await prismadatabase_1.default.category.findFirst({
            where: { slug },
            include: {
                subCategories: true,
            },
        });
    }
    async updateCategory(slug, payload) {
        return await prismadatabase_1.default.category.update({
            where: { slug: slug },
            data: payload,
        });
    }
    async deleteCategory(slug) {
        return await prismadatabase_1.default.category.delete({
            where: { slug },
        });
    }
    async getCategoryWithPagination(payload) {
        return await (0, pagination_1.pagination)(payload, async (limit, offset, sortOrder) => {
            const [doc, totalDoc] = await Promise.all([
                prismadatabase_1.default.category.findMany({
                    skip: offset,
                    take: limit,
                    orderBy: { createdAt: sortOrder === 1 ? 'asc' : 'desc' },
                }),
                prismadatabase_1.default.category.count(),
            ]);
            return { doc, totalDoc };
        });
    }
}
exports.CategoryRepository = CategoryRepository;
const categoryRepository = new CategoryRepository();
exports.default = categoryRepository;
