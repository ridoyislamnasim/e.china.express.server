"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubCategoryRepository = void 0;
const prismadatabase_1 = __importDefault(require("../../config/prismadatabase"));
const pagination_1 = require("../../utils/pagination");
class SubCategoryRepository {
    async createSubCategory(payload, tx) {
        return await prismadatabase_1.default.subCategory.create({
            data: {
                ...payload,
                categoryRef: { connect: { id: Number(payload.categoryRef) } },
            },
        });
    }
    async getAllSubCategory() {
        return await prismadatabase_1.default.subCategory.findMany({
            include: { categoryRef: true },
        });
    }
    async getSingleSubCategory(slug, includeRelations) {
        return await prismadatabase_1.default.subCategory.findUnique({
            where: { slug },
            include: includeRelations,
        });
    }
    async updateSubCategory(slug, payload, tx) {
        return await prismadatabase_1.default.subCategory.update({
            where: { slug },
            data: {
                ...payload,
                categoryRef: { connect: { id: Number(payload.categoryRef) } },
            },
        });
    }
    async getSubCategoryWithPagination(payload) {
        return await (0, pagination_1.pagination)(payload, async (limit, offset, sortOrder) => {
            const [doc, totalDoc] = await Promise.all([
                prismadatabase_1.default.subCategory.findMany({
                    skip: offset,
                    take: limit,
                    orderBy: { createdAt: sortOrder === 1 ? 'asc' : 'desc' },
                    include: { categoryRef: true },
                }),
                prismadatabase_1.default.subCategory.count(),
            ]);
            return { doc, totalDoc };
        });
    }
    async deleteSubCategory(slug) {
        return await prismadatabase_1.default.subCategory.delete({
            where: { slug },
        });
    }
}
exports.SubCategoryRepository = SubCategoryRepository;
const subCategoryRepository = new SubCategoryRepository();
exports.default = subCategoryRepository;
