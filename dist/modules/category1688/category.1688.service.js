"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category1688Service = void 0;
const errors_1 = require("../../utils/errors");
// import { BaseService } from '../base/base.service';
const category_1688_repository_1 = __importDefault(require("./category.1688.repository"));
const ImgUploder_1 = __importDefault(require("../../middleware/upload/ImgUploder"));
const e1688Category_1 = __importDefault(require("../../utils/e1688Category"));
const config_1 = __importDefault(require("../../config/config"));
// import { removeUploadFile } from '../../middleware/upload/removeUploadFile';
class Category1688Service {
    constructor(repository) {
        this.repository = repository;
    }
    async createCategory1688() {
        var _a, _b, _c, _d, _e, _f;
        const cid = Number(0);
        const appSecret = config_1.default.e1688AppSecret || 'U1IH8T6UoQxf';
        const access_token = config_1.default.e1688AccessToken || '793b6857-359d-494b-bc2b-e3b37bc87c12';
        const apiBaseUrl = config_1.default.e1688ApiBaseUrl || 'https://gw.open.1688.com/openapi/';
        const uriPath = 'param2/1/com.alibaba.fenxiao.crossborder/category.translation.getById/9077165';
        // Use the category-specific helper to prepare and call the API
        const responseData = await e1688Category_1.default.callCategoryById(apiBaseUrl, uriPath, cid, access_token, appSecret);
        // Response shape varies; try common locations
        const results = (_b = (_a = responseData === null || responseData === void 0 ? void 0 : responseData.result) === null || _a === void 0 ? void 0 : _a.result) === null || _b === void 0 ? void 0 : _b.children;
        for (const result of results) {
            const categoryIdChild = result === null || result === void 0 ? void 0 : result.categoryId;
            await this.repository.createOrUpdateCategory1688From1688Data(result);
            const responseData = await e1688Category_1.default.callCategoryById(apiBaseUrl, uriPath, categoryIdChild, access_token, appSecret);
            const resultsChild = (_d = (_c = responseData === null || responseData === void 0 ? void 0 : responseData.result) === null || _c === void 0 ? void 0 : _c.result) === null || _d === void 0 ? void 0 : _d.children;
            // af first check is array  resultsChild
            if (Array.isArray(resultsChild)) {
                for (const resultChild of resultsChild) {
                    const categoryIdSubChild = resultChild === null || resultChild === void 0 ? void 0 : resultChild.categoryId;
                    // console.log('Processing child categoryId:', categoryIdChild);
                    await this.repository.createOrUpdateCategory1688From1688Data(resultChild);
                    const responseDataSubChild = await e1688Category_1.default.callCategoryById(apiBaseUrl, uriPath, categoryIdSubChild, access_token, appSecret);
                    const resultsSubChild = (_f = (_e = responseDataSubChild === null || responseDataSubChild === void 0 ? void 0 : responseDataSubChild.result) === null || _e === void 0 ? void 0 : _e.result) === null || _f === void 0 ? void 0 : _f.children;
                    // check aarray  resultsSubChild
                    if (Array.isArray(resultsSubChild)) {
                        for (const resultSubChild of resultsSubChild) {
                            await this.repository.createOrUpdateCategory1688From1688Data(resultSubChild);
                        }
                    }
                }
            }
        }
        return results;
    }
    async getAllCategory1688() {
        return await this.repository.getAllCategory1688();
    }
    async getAllCategory1688ForAgent() {
        return await this.repository.getAllCategory1688();
    }
    async getCategoryIdBySubcategoryForAgent(payload) {
        const { categoryId } = payload;
        const subcategories = await this.repository.getCategoryIdBySubcategory(categoryId);
        if (!subcategories) {
            throw new errors_1.NotFoundError(`No subcategories found for categoryId ${categoryId}`);
        }
        return subcategories;
    }
    async getCategoryIdBySubcategory(payload) {
        const { categoryId } = payload;
        const subcategories = await this.repository.getCategoryIdBySubcategory(categoryId);
        if (!subcategories) {
            throw new errors_1.NotFoundError(`No subcategories found for categoryId ${categoryId}`);
        }
        return subcategories;
    }
    async addCategoryForRateCalculation(payload) {
        const { categoryId } = payload;
        const category = await this.repository.getCategoryByCategoryId(categoryId);
        if (!category) {
            throw new errors_1.NotFoundError(`Category with categoryId ${categoryId} not found`);
        }
        // Update the isRateCategory flag to true
        const updatedCategory = await this.repository.updateCategoryRateFlagToggle(categoryId, !category.isRateCategory);
        return updatedCategory;
    }
    async getAllCategory1688ForRateCalculation() {
        return await this.repository.getCategoriesForRateCalculation();
    }
    async findCategory1688(payload) {
        const { query } = payload;
        return await this.repository.findCategory1688(query);
    }
    // HS Code Entry Services
    async createHsCodeEntryByCategoryId(payload) {
        const { id, globalHsCodes, chinaHsCodes, globalMaterialComment, countryHsCode } = payload;
        const category = await this.repository.getCategoryById(id);
        console.log('Fetched category:', category);
        if (!category) {
            throw new errors_1.NotFoundError(`Category with categoryId ${id} not found`);
        }
        // Create HS Code Entry
        const hsCodeEntry = await this.repository.createHsCodeEntry(id, globalHsCodes, chinaHsCodes, globalMaterialComment);
        console.log('Created HS Code Entry:', countryHsCode);
        for (const countryCode of countryHsCode) {
            await this.repository.createCountryHsCodeEntry(id, countryCode.countryId, countryCode.hsCodes);
        }
        return hsCodeEntry;
    }
    async getHsCodeEntryByCategoryId(payload) {
        const { id } = payload;
        const hsCodeEntry = await this.repository.getHsCodeEntryByCategoryId(id);
        if (!hsCodeEntry) {
            throw new errors_1.NotFoundError(`HS Code Entry for Category ID ${id} not found`);
        }
        return hsCodeEntry;
    }
    async uploadCategoryImage(id, payloadFiles) {
        const { files } = payloadFiles;
        if (!files)
            throw new Error('image is required');
        // console.log('Creating blog with files:', files);
        console.log('Creating blog with payload:', payloadFiles);
        const images = await (0, ImgUploder_1.default)(files);
        let image = '';
        for (const key in images) {
            image = images[key];
        }
        const category = await this.repository.getCategoryById(id);
        if (!category) {
            throw new errors_1.NotFoundError(`Category with id ${id} not found`);
        }
        return await this.repository.updateCategoryImage(id, image);
    }
}
exports.Category1688Service = Category1688Service;
exports.default = new Category1688Service(category_1688_repository_1.default);
