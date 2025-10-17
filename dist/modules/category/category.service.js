"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const errors_1 = require("../../utils/errors");
// import { BaseService } from '../base/base.service';
const category_repository_1 = __importDefault(require("./category.repository"));
const ImgUploder_1 = __importDefault(require("../../middleware/upload/ImgUploder"));
const slugGenerate_1 = require("../../utils/slugGenerate");
// import { removeUploadFile } from '../../middleware/upload/removeUploadFile';
class CategoryService {
    constructor(repository) {
        this.repository = repository;
    }
    async createCategory(payloadFiles, payload, tx) {
        const { files } = payloadFiles || {};
        if (files === null || files === void 0 ? void 0 : files.length) {
            const images = await (0, ImgUploder_1.default)(files);
            // console.log('Images uploaded is images ater upload:', images);
            for (const key in images) {
                payload[key] = images[key];
            }
        }
        payload.slug = (0, slugGenerate_1.slugGenerate)(payload.name);
        return await this.repository.createCategory(payload, tx);
    }
    async getAllCategory() {
        return await this.repository.getAllCategory();
    }
    async getCategoryWithPagination(payload) {
        return await this.repository.getCategoryWithPagination(payload);
    }
    async getSingleCategory(slug) {
        const categoryData = await this.repository.getCategoryById(slug);
        if (!categoryData)
            throw new errors_1.NotFoundError('Category Not Found');
        return categoryData;
    }
    async getSingleCategoryWithSlug(slug) {
        const categoryData = await this.repository.getCategoryBySlug(slug);
        if (!categoryData)
            throw new errors_1.NotFoundError('Category Not Found');
        return categoryData;
    }
    async getNavBar() {
        console.log('Fetching Navbar Data...');
        const navbarData = await this.repository.getNavBar();
        console.log('Navbar Data:', navbarData);
        if (!navbarData)
            throw new errors_1.NotFoundError('Navbar Not Found');
        return navbarData;
    }
    async updateCategory(slug, payloadFiles, payload) {
        const { files } = payloadFiles || {};
        let oldCategory = null;
        if (files === null || files === void 0 ? void 0 : files.length) {
            oldCategory = await this.repository.getCategoryById(slug);
            const images = await (0, ImgUploder_1.default)(files);
            for (const key in images) {
                payload[key] = images[key];
            }
        }
        const categoryData = await this.repository.updateCategory(slug, payload);
        // Remove old files if replaced
        if ((files === null || files === void 0 ? void 0 : files.length) && (oldCategory === null || oldCategory === void 0 ? void 0 : oldCategory.image)) {
            // await removeUploadFile(oldCategory.image);
        }
        return categoryData;
    }
    async updateCategoryStatus(slug, status) {
        if (!status)
            throw new errors_1.NotFoundError('Status is required');
        // status = status === 'true';
        return await this.repository.updateCategory(slug, { status });
    }
    async deleteCategory(slug) {
        // TODO: Remove files if needed
        return await this.repository.deleteCategory(slug); // Or use a delete method
    }
}
exports.CategoryService = CategoryService;
exports.default = new CategoryService(category_repository_1.default);
