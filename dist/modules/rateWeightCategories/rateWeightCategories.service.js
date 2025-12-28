"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateWeightCategoriesService = void 0;
const rateWeightCategories_repository_1 = __importDefault(require("./rateWeightCategories.repository"));
class RateWeightCategoriesService {
    // private roleRepository: RoleRepository;
    constructor(repository = rateWeightCategories_repository_1.default) {
        this.getAllRateWeightCategories = async () => {
            const rateWeightCategories = await this.repository.getAllRateWeightCategories();
            return rateWeightCategories;
        };
        this.deleteRateWeightCategories = async (id) => {
            const deletedCategory = await this.repository.deleteRateWeightCategories(id);
            return deletedCategory;
        };
        this.repository = repository;
    }
    async createRateWeightCategories(payload) {
        const { label, min_weight, max_weight } = payload;
        console.log("payload service", payload);
        // Validate required fields.
        // Allow min_weight = 0 (so test for undefined/null rather than falsy)
        if (!label || min_weight === undefined || min_weight === null || max_weight === undefined || max_weight === null) {
            const error = new Error('label, min_weight and max_weight are required');
            error.statusCode = 400;
            throw error;
        }
        // Coerce weights to numbers and validate
        const min = Number(min_weight);
        const max = Number(max_weight);
        if (Number.isNaN(min) || Number.isNaN(max)) {
            const error = new Error('min_weight and max_weight must be numbers');
            error.statusCode = 400;
            throw error;
        }
        if (min > max) {
            const error = new Error('min_weight cannot be greater than max_weight');
            error.statusCode = 400;
            throw error;
        }
        // Ensure description is optional
        const weightCategoriesPayload = {
            label,
            min_weight: min,
            max_weight: max,
        };
        const shippingMethod = await this.repository.createRateWeightCategories(weightCategoriesPayload);
        return shippingMethod;
    }
    async updateRateWeightCategories(id, payload) {
        const { label, min_weight, max_weight } = payload;
        // Validate required fields
        if (!label || min_weight === undefined || min_weight === null || max_weight === undefined || max_weight === null) {
            const error = new Error('label, min_weight and max_weight are required');
            error.statusCode = 400;
            throw error;
        }
        // Coerce weights to numbers and validate
        const min = Number(min_weight);
        const max = Number(max_weight);
        if (Number.isNaN(min) || Number.isNaN(max)) {
            const error = new Error('min_weight and max_weight must be numbers');
            error.statusCode = 400;
            throw error;
        }
        if (min > max) {
            const error = new Error('min_weight cannot be greater than max_weight');
            error.statusCode = 400;
            throw error;
        }
        // Get all categories to check adjacent boundaries
        const allCategories = await this.repository.getAllRateWeightCategories();
        // Sort categories by min_weight
        const sortedCategories = allCategories.sort((a, b) => a.min_weight - b.min_weight);
        // Find the current category index
        const currentIndex = sortedCategories.findIndex((cat) => String(cat.id) === String(id));
        if (currentIndex === -1) {
            const error = new Error('Category not found');
            error.statusCode = 404;
            throw error;
        }
        // Check previous category (if exists)
        if (currentIndex > 0) {
            const previousCategory = sortedCategories[currentIndex - 1];
            if (min < previousCategory.max_weight) {
                const error = new Error(`min_weight (${min}) cannot be less than previous category's max_weight (${previousCategory.max_weight})`);
                error.statusCode = 400;
                throw error;
            }
        }
        // Check next category (if exists)
        if (currentIndex < sortedCategories.length - 1) {
            const nextCategory = sortedCategories[currentIndex + 1];
            if (max > nextCategory.min_weight) {
                const error = new Error(`max_weight (${max}) cannot be greater than next category's min_weight (${nextCategory.min_weight})`);
                error.statusCode = 400;
                throw error;
            }
        }
        const updatedPayload = {
            label,
            min_weight: min,
            max_weight: max
        };
        const updatedCategory = await this.repository.updateRateWeightCategories(id, updatedPayload);
        return updatedCategory;
    }
}
exports.RateWeightCategoriesService = RateWeightCategoriesService;
