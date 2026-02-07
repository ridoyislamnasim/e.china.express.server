"use strict";
// AuthService (TypeScript version)
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingMethodService = void 0;
const shippingMethod_repository_1 = __importDefault(require("./shippingMethod.repository"));
class ShippingMethodService {
    // private roleRepository: RoleRepository;
    constructor(repository = shippingMethod_repository_1.default) {
        this.repository = repository;
    }
    async createShippingMethod(payload) {
        var _a;
        const { name, description } = payload;
        // Validate required fields
        if (!name) {
            const error = new Error('name required');
            error.statusCode = 400;
            throw error;
        }
        // Ensure description is optional
        const shippingMethodPayload = {
            name,
            description: description !== null && description !== void 0 ? description : null,
            boxSize: (_a = payload.boxSize) !== null && _a !== void 0 ? _a : null,
            cbmToKgRatio: payload.cbmToKgRatio !== undefined ? parseFloat(payload.cbmToKgRatio) : undefined,
        };
        const shippingMethod = await this.repository.createShippingMethod(shippingMethodPayload);
        return shippingMethod;
    }
    async getShippingMethod() {
        const shippingMethods = await this.repository.getShippingMethod();
        return shippingMethods;
    }
    async getShippingMethodWithPagination(payload) {
        const allShippingMethods = await this.repository.getShippingMethodWithPagination(payload);
        return allShippingMethods;
    }
    async getSingleShippingMethod(id) {
        const shippingMethod = await this.repository.getSingleShippingMethod(id);
        if (!shippingMethod) {
            const error = new Error('Shipping Method Not Found');
            error.statusCode = 404;
            throw error;
        }
        return shippingMethod;
    }
    async updateShippingMethod(id, payload) {
        var _a, _b, _c;
        //  GET GY ID THAN CHECK IF EXISTS
        const existingShippingMethod = await this.repository.getSingleShippingMethod(id);
        if (!existingShippingMethod) {
            const error = new Error('Shipping Method Not Found');
            error.statusCode = 404;
            throw error;
        }
        const payloadData = {
            name: (_a = payload.name) !== null && _a !== void 0 ? _a : existingShippingMethod.name,
            description: (_b = payload.description) !== null && _b !== void 0 ? _b : existingShippingMethod.description,
            boxSize: (_c = payload.boxSize) !== null && _c !== void 0 ? _c : existingShippingMethod.boxSize,
            cbmToKgRatio: payload.cbmToKgRatio !== undefined ? parseFloat(payload.cbmToKgRatio) : existingShippingMethod.cbmToKgRatio,
        };
        const updatedShippingMethod = await this.repository.updateShippingMethod(id, payloadData);
        return updatedShippingMethod;
    }
    async deleteShippingMethod(id) {
        //  GET BY ID THAN CHECK IF EXISTS
        const existingShippingMethod = await this.repository.getSingleShippingMethod(id);
        if (!existingShippingMethod) {
            const error = new Error('Shipping Method Not Found');
            error.statusCode = 404;
            throw error;
        }
        const deletedShippingMethod = await this.repository.deleteShippingMethod(id);
        return deletedShippingMethod;
    }
}
exports.ShippingMethodService = ShippingMethodService;
