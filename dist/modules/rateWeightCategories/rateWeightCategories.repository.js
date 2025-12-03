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
    async getAllRateWeightCategories() {
        const rateWeightCategories = await this.prisma.rateWeightCategorie.findMany({
            orderBy: {
                min_weight: 'asc'
            }
        });
        return rateWeightCategories;
    }
}
exports.RateWeightCategoriesRepository = RateWeightCategoriesRepository;
// Export a singleton instance, similar to module.exports = new CountryRepository(UserSchema)
const rateWeightCategoriesRepository = new RateWeightCategoriesRepository();
exports.default = rateWeightCategoriesRepository;
