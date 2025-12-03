"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatePorductRepository = void 0;
const prismadatabase_1 = __importDefault(require("../../config/prismadatabase"));
// import { AuthUserSignUpPayload } from '../../types/auth.types';
// import CountryPayload from '../../types/country.type';
class RatePorductRepository {
    constructor() {
        this.prisma = prismadatabase_1.default;
    }
    async createRateProduct(payload) {
        const { name, shCategoryCode } = payload;
        const newRateShippingMethod = await this.prisma.rateProduct.create({
            data: payload
        });
        return newRateShippingMethod;
    }
    // check exist category , subcategory , subheading
    async existCategory(payload) {
        const { name, shCategoryCode } = payload;
        const existCategory = await this.prisma.categorie.findFirst({
            where: {
                name,
                shCategoryCode
            }
        });
        return existCategory;
    }
    async existSubCategory(payload) {
        const { name, shSubCategoryCode } = payload;
        const existCategory = await this.prisma.subCategories.findFirst({
            where: {
                name,
                shSubCategoryCode
            }
        });
        return existCategory;
    }
    async existSubHeading(payload) {
        const { name, hsSubHeadingCode } = payload;
        const existCategory = await this.prisma.subHeadings.findFirst({
            where: {
                name,
                hsSubHeadingCode
            }
        });
        return existCategory;
    }
    // create category , subcategory , subheading
    async createCategory(payload) {
        const newCategory = await this.prisma.categorie.create({
            data: payload
        });
        return newCategory;
    }
    async createSubCategory(payload) {
        const newSubCategory = await this.prisma.subCategories.create({
            data: payload
        });
        return newSubCategory;
    }
    async createSubHeading(payload) {
        const newSubHeading = await this.prisma.subHeadings.create({
            data: payload
        });
        return newSubHeading;
    }
    async getAllRateProduct() {
        const rateProducts = await this.prisma.rateProduct.findMany({
            include: {
                categorie: true,
                subCategories: true,
                subHeadings: true,
            },
        });
        return rateProducts;
    }
}
exports.RatePorductRepository = RatePorductRepository;
// Export a singleton instance, similar to module.exports = new CountryRepository(UserSchema)
const ratePorductRepository = new RatePorductRepository();
exports.default = ratePorductRepository;
