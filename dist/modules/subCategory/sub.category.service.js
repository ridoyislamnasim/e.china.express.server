"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubCategoryService = void 0;
const sub_category_repository_1 = __importDefault(require("./sub.category.repository"));
// import { removeUploadFile } from '../../middleware/upload/removeUploadFile';
const ImgUploder_1 = __importDefault(require("../../middleware/upload/ImgUploder"));
const slugGenerate_1 = require("../../utils/slugGenerate");
class SubCategoryService {
    constructor(repository) {
        this.repository = repository;
    }
    async createSubCategory(payloadFiles, payload, tx) {
        const { files } = payloadFiles;
        // file is required for subCategory creation
        if (!files || !files.length) {
            const error = new Error('Files are required for subCategory creation');
            error.statusCode = 400;
            throw error;
        }
        // name and categoryRef are required
        if (!payload.name || !payload.categoryRef) {
            const error = new Error('Name and categoryRef are required');
            error.statusCode = 400;
            throw error;
        }
        if (files === null || files === void 0 ? void 0 : files.length) {
            const images = await (0, ImgUploder_1.default)(files);
            for (const key in images) {
                payload[key] = images[key];
            }
        }
        payload.slug = (0, slugGenerate_1.slugGenerate)(payload.name);
        const subCategoryData = await this.repository.createSubCategory(payload, tx);
        return subCategoryData;
    }
    async getAllSubCategory() {
        return await this.repository.getAllSubCategory();
    }
    async getSubCategoryWithPagination(payload) {
        const subCategory = await this.repository.getSubCategoryWithPagination(payload);
        return subCategory;
    }
    async getSingleSubCategory(slug) {
        const subCategoryData = await this.repository.getSingleSubCategory(slug, { categoryRef: true });
        if (!subCategoryData) {
            const error = new Error('SubCategory Not Find');
            error.statusCode = 404;
            throw error;
        }
        return subCategoryData;
    }
    //   async getSingleSubCategoryWithSlug(slug: string) {
    //     const subCategoryData = await this.repository.findOne({ slug: slug }, ['categoryRef']);
    //     if (!subCategoryData) throw new NotFoundError('SubCategory Not Find');
    //     return subCategoryData;
    //   }
    async updateSubCategory(slug, payloadFiles, payload, tx) {
        const { files } = payloadFiles;
        if (files === null || files === void 0 ? void 0 : files.length) {
            const images = await (0, ImgUploder_1.default)(files);
            for (const key in images) {
                payload[key] = images[key];
            }
        }
        // Update the database with the new data
        if (payload.name) {
            payload.slug = (0, slugGenerate_1.slugGenerate)(payload.name);
        }
        const subCategoryData = await this.repository.updateSubCategory(slug, payload, tx);
        // Remove old files if they’re being replaced
        if ((files === null || files === void 0 ? void 0 : files.length) && subCategoryData) {
            // console.log('run thoids upload reload', subCategoryData?.image);
            //   await removeUploadFile(subCategoryData?.image);
        }
        return subCategoryData;
    }
    //   async updateSubCategoryStatus(slug: string, status: any) {
    //     if (!status) throw new NotFoundError('Status is required');
    //     const boolStatus = status === true || status === 'true';
    //     const subCategory = await this.repository.updateSubCategoryStatus(slug, { status: boolStatus });
    //     console.log('subCategory', subCategory);
    //     if (!subCategory) throw new NotFoundError('SubCategory not found');
    //     return subCategory;
    //   }
    async deleteSubCategory(slug) {
        const deletedSubCategory = await this.repository.deleteSubCategory(slug);
        if (deletedSubCategory) {
            //   await removeUploadFile(subCategory?.image);
        }
        return deletedSubCategory;
    }
}
exports.SubCategoryService = SubCategoryService;
exports.default = new SubCategoryService(sub_category_repository_1.default);
