"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingMethodRepository = void 0;
const prismadatabase_1 = __importDefault(require("../../config/prismadatabase"));
class ShippingMethodRepository {
    constructor() {
        this.prisma = prismadatabase_1.default;
    }
    async createShippingMethod(payload) {
        const newRateShippingMethod = await this.prisma.rateShippingMethod.create({
            data: payload
        });
        return newRateShippingMethod;
    }
    async getShippingMethod() {
        const shippingMethods = await this.prisma.rateShippingMethod.findMany();
        return shippingMethods;
    }
}
exports.ShippingMethodRepository = ShippingMethodRepository;
// Export a singleton instance, similar to module.exports = new CountryRepository(UserSchema)
const shippingMethodRepository = new ShippingMethodRepository();
exports.default = shippingMethodRepository;
