"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatePorductService = void 0;
const rateProduct_repository_1 = __importDefault(require("./rateProduct.repository"));
class RatePorductService {
    // private roleRepository: RoleRepository;
    constructor(repository = rateProduct_repository_1.default) {
        this.repository = repository;
    }
    async createRateProduct(payload) {
        var _a, _b, _c;
        const { categoryName, categoryShCode, categoryDescription, subCategoryName, subCategoryShCode, subCategoryDescription, subHeadingName, subHeadingShCode, subHeadingDescription, productName, status } = payload;
        console.log("payload service", payload);
        const productShCode = categoryShCode + subCategoryShCode + subHeadingShCode;
        // Validate required fields
        if (!productName || !productShCode || !categoryName || !categoryShCode || !subCategoryName || !subCategoryShCode || !subHeadingName || !subHeadingShCode) {
            const error = new Error("Missing required fields: productName, productShCode, categoryName, categoryShCode, subCategoryName, subCategoryShCode, subHeadingName, or subHeadingShCode.");
            error.statusCode = 400;
            throw error;
        }
        // define payloads for existence checks
        const categoryPayload = {
            name: categoryName,
            shCategoryCode: categoryShCode,
            description: categoryDescription !== null && categoryDescription !== void 0 ? categoryDescription : null
        };
        const subCategoryPayload = {
            name: subCategoryName,
            shSubCategoryCode: subCategoryShCode,
            description: subCategoryDescription !== null && subCategoryDescription !== void 0 ? subCategoryDescription : null
        };
        const subHeadingPayload = {
            name: subHeadingName,
            hsSubHeadingCode: subHeadingShCode,
            description: subHeadingDescription !== null && subHeadingDescription !== void 0 ? subHeadingDescription : null
        };
        //exist category ,subcategory , subheading
        const existCategory = await this.repository.existCategory(categoryPayload);
        const existSubCategory = await this.repository.existSubCategory(subCategoryPayload);
        const existSubHeading = await this.repository.existSubHeading(subHeadingPayload);
        // create category, subcategory , subheading if not exist
        const newCategory = !existCategory ? await this.repository.createCategory(categoryPayload) : null;
        const newSubCategory = !existSubCategory ? await this.repository.createSubCategory(subCategoryPayload) : null;
        const newSubHeading = !existSubHeading ? await this.repository.createSubHeading(subHeadingPayload) : null;
        const categoryId = (_a = existCategory === null || existCategory === void 0 ? void 0 : existCategory.id) !== null && _a !== void 0 ? _a : newCategory === null || newCategory === void 0 ? void 0 : newCategory.id;
        const subcategoryId = (_b = existSubCategory === null || existSubCategory === void 0 ? void 0 : existSubCategory.id) !== null && _b !== void 0 ? _b : newSubCategory === null || newSubCategory === void 0 ? void 0 : newSubCategory.id;
        const subheadingId = (_c = existSubHeading === null || existSubHeading === void 0 ? void 0 : existSubHeading.id) !== null && _c !== void 0 ? _c : newSubHeading === null || newSubHeading === void 0 ? void 0 : newSubHeading.id;
        if (!categoryId || !subcategoryId || !subheadingId) {
            const error = new Error("Failed to create or find required category, subcategory, or subheading. Please check the provided data.");
            error.statusCode = 500;
            throw error;
        }
        const rateProductPayload = {
            categoryId, subcategoryId, subheadingId, name: productName, shCode: productShCode
        };
        if (status) {
            rateProductPayload.status = status;
        }
        console.log("rateProductPayload service", rateProductPayload);
        const shippingMethod = await this.repository.createRateProduct(rateProductPayload);
        return shippingMethod;
    }
    async getAllRateProduct() {
        const rateProducts = await this.repository.getAllRateProduct();
        return rateProducts;
    }
}
exports.RatePorductService = RatePorductService;
