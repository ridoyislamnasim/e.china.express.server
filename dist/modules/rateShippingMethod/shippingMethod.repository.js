"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingMethodRepository = void 0;
const prismadatabase_1 = __importDefault(require("../../config/prismadatabase"));
const pagination_1 = require("../../utils/pagination");
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
    async getShippingMethodWithPagination(payload) {
        return await (0, pagination_1.pagination)(payload, async (limit, offset) => {
            const [doc, totalDoc] = await Promise.all([
                await prismadatabase_1.default.rateShippingMethod.findMany({
                    skip: offset,
                    take: limit,
                    orderBy: { createdAt: payload.sortOrder },
                }),
                await prismadatabase_1.default.rateShippingMethod.count(),
            ]);
            return { doc, totalDoc };
        });
    }
    // get single shipping method by id
    async getSingleShippingMethod(id) {
        const shippingMethod = await this.prisma.rateShippingMethod.findUnique({
            where: { id: Number(id) },
        });
        return shippingMethod;
    }
    async updateShippingMethod(id, payload) {
        // Implement update logic here
        const updatedShippingMethod = await this.prisma.rateShippingMethod.update({
            where: { id: Number(id) },
            data: payload,
        });
        return updatedShippingMethod;
    }
    async deleteShippingMethod(id) {
        // Implement delete logic here
        const deletedShippingMethod = await this.prisma.rateShippingMethod.delete({
            where: { id: Number(id) },
        });
        return deletedShippingMethod;
    }
}
exports.ShippingMethodRepository = ShippingMethodRepository;
// Export a singleton instance, similar to module.exports = new CountryRepository(UserSchema)
const shippingMethodRepository = new ShippingMethodRepository();
exports.default = shippingMethodRepository;
