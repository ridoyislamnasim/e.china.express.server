"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category1688Repository = void 0;
// Category1688Repository (TypeScript version)
const prismadatabase_1 = __importDefault(require("../../config/prismadatabase"));
class Category1688Repository {
    async createCategory1688(payload, tx) {
        return await prismadatabase_1.default.category1688.create({ data: payload });
    }
    async getAllCategory1688() {
        // return await prisma.category1688.findMany();
        const categories = await prismadatabase_1.default.category1688.findMany({
            orderBy: [{ level: "asc" }, { translatedName: "asc" }]
        });
        return this.buildCategoryTree(categories);
    }
    // Helper: Build parent-child nested tree
    buildCategoryTree(categories) {
        const map = {};
        const roots = [];
        // Prepare map
        categories.forEach(cat => {
            map[cat.categoryId] = { ...cat, children: [] };
        });
        // Connect parent-child
        categories.forEach(cat => {
            if (cat.parentCateId && map[cat.parentCateId]) {
                map[cat.parentCateId].children.push(map[cat.categoryId]);
            }
            else {
                roots.push(map[cat.categoryId]); // top-level category
            }
        });
        return roots;
    }
    async createOrUpdateCategory1688From1688Data(result) {
        const { categoryId, translatedName, leaf, level, parentCateId } = result;
        const finalParentId = (!parentCateId || Number(parentCateId) === 0)
            ? null
            : Number(parentCateId);
        return await prismadatabase_1.default.category1688.upsert({
            where: { categoryId },
            update: {
                translatedName,
                leaf,
                level: Number(level),
                parentCateId: finalParentId,
            },
            create: {
                categoryId,
                translatedName,
                leaf,
                level: Number(level),
                parentCateId: finalParentId,
            },
        });
    }
    async getCategoryIdBySubcategory(categoryId) {
        return await prismadatabase_1.default.category1688.findMany({
            where: { parentCateId: categoryId },
        });
    }
    async getCategoryByCategoryId(categoryId) {
        return await prismadatabase_1.default.category1688.findUnique({
            where: { categoryId },
        });
    }
    async getCategoryById(id) {
        return await prismadatabase_1.default.category1688.findUnique({
            where: { id },
        });
    }
    async updateCategoryRateFlagToggle(categoryId, isRateCategory) {
        console.log('Updating categoryId:', categoryId, 'to isRateCategory:', isRateCategory);
        return await prismadatabase_1.default.category1688.update({
            where: { categoryId },
            data: { isRateCategory: Boolean(isRateCategory) },
        });
    }
    async getCategoriesForRateCalculation() {
        //  find lavel 1 categories than this catgeory make tree  isRateCategory is true
        // level: 1 or isRateCategory: true
        const categories = await prismadatabase_1.default.category1688.findMany({
            where: {
                OR: [
                    { level: 1 },
                    { isRateCategory: true }
                ]
            },
            // Order first by level (so top-level categories come first), then
            // alphabetically by translatedName so lists appear in human-friendly order.
            orderBy: [{ level: "asc" }, { translatedName: "asc" }]
        });
        return this.buildCategoryTree(categories);
    }
    // HS Code Entry Repositories
    async getHsCodeConfigByCategoryId(categoryId) {
        return await prismadatabase_1.default.hsCodeConfig.findUnique({
            where: { categoryId },
        });
    }
    async createHsCodeEntry(id, globalHsCodes, chinaHsCodes, globalMaterialComment) {
        // Use upsert: create if not exists, otherwise update existing entry
        return await prismadatabase_1.default.hsCodeConfig.upsert({
            where: { categoryId: id },
            update: {
                globalHsCodes: globalHsCodes,
                chinaHsCodes: chinaHsCodes,
                globalMaterialComment: globalMaterialComment,
            },
            create: {
                categoryId: id,
                globalHsCodes: globalHsCodes,
                chinaHsCodes: chinaHsCodes,
                globalMaterialComment: globalMaterialComment,
            },
        });
    }
    async createCountryHsCodeEntry(id, countryId, hsCodes) {
        // Attempt to find existing record for this category1688 + country
        const existing = await prismadatabase_1.default.countryHsCode.findFirst({ where: { category1688Id: id, countryId } });
        if (existing) {
            return await prismadatabase_1.default.countryHsCode.update({ where: { id: existing.id }, data: { hsCodes } });
        }
        return await prismadatabase_1.default.countryHsCode.create({
            data: {
                category1688Id: id,
                countryId,
                hsCodes,
            },
        });
    }
    async getHsCodeEntryByCategoryId(id) {
        const hsCodeConfig = await prismadatabase_1.default.hsCodeConfig.findUnique({
            where: { categoryId: id },
        });
        // Fetch associated country HS codes
        const countryHsCodes = await prismadatabase_1.default.countryHsCode.findMany({
            where: { category1688Id: id },
        });
        return {
            ...hsCodeConfig,
            countryHsCodes: countryHsCodes,
        };
    }
    async geSubCategoryIdExit(subCategory1688Id) {
        return await prismadatabase_1.default.category1688.findUnique({
            where: { categoryId: subCategory1688Id, isRateCategory: true },
        });
    }
}
exports.Category1688Repository = Category1688Repository;
const category1688Repository = new Category1688Repository();
exports.default = category1688Repository;
