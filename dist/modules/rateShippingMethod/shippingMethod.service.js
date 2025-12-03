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
            description: description !== null && description !== void 0 ? description : null
        };
        const shippingMethod = await this.repository.createShippingMethod(shippingMethodPayload);
        return shippingMethod;
    }
    async getShippingMethod() {
        const shippingMethods = await this.repository.getShippingMethod();
        return shippingMethods;
    }
}
exports.ShippingMethodService = ShippingMethodService;
