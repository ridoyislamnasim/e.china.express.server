"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateWeightCategoriesRepository = void 0;
const prismadatabase_1 = __importDefault(require("../../config/prismadatabase"));
// import { AuthUserSignUpPayload } from '../../types/auth.types';
// import CountryPayload from '../../types/country.type';
class RateWeightCategoriesRepository {
    constructor() {
        this.prisma = prismadatabase_1.default;
    }
    async createRateWeightCategories(payload) {
        const newRateShippingMethod = await this.prisma.rateWeightCategorie.create({
            data: payload
        });
        return newRateShippingMethod;
    }
    async updateRateWeightCategories(id, payload) {
        const updatedCategory = await this.prisma.rateWeightCategorie.update({
            where: { id: Number(id) },
            data: payload
        });
        return updatedCategory;
    }
    async getAllRateWeightCategories() {
        const rateWeightCategories = await this.prisma.rateWeightCategorie.findMany({
            orderBy: {
                min_weight: 'asc'
            }
        });
        return rateWeightCategories;
    }
    async getRateWeightCategoriesWithPagination(payload) {
        // only get with limit and offset
        return await this.prisma.rateWeightCategorie.findMany({
            skip: payload.offset,
            take: payload.limit,
            // orderBy: { createdAt: payload.sortOrder },
        });
    }
    async countRateWeightCategories() {
        const count = await this.prisma.rateWeightCategorie.count();
        return count;
    }
    async deleteRateWeightCategories(id) {
        const deletedCategory = await this.prisma.rateWeightCategorie.delete({
            where: { id: Number(id) }
        });
        return deletedCategory;
    }
}
exports.RateWeightCategoriesRepository = RateWeightCategoriesRepository;
// Export a singleton instance, similar to module.exports = new CountryRepository(UserSchema)
const rateWeightCategoriesRepository = new RateWeightCategoriesRepository();
exports.default = rateWeightCategoriesRepository;
