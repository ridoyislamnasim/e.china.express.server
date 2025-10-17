"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const errors_1 = require("../../utils/errors");
const base_service_1 = require("../base/base.service");
const cart_repository_1 = __importDefault(require("./cart.repository"));
class CartService extends base_service_1.BaseService {
    constructor(repository) {
        super(repository);
        this.repository = repository;
    }
    async createCart(payload, tx) {
        const { quantity, userRef, productRef, inventoryRef } = payload;
        if (!productRef && !inventoryRef) {
            throw new Error('Product ID & Inventory ID is required');
        }
        const query = {};
        console.log('Creating cart with query 2:', payload);
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
            .test((payload === null || payload === void 0 ? void 0 : payload.userRef) || '');
        console.log('Creating cart with query 3:', isUUID);
        if (!isUUID) {
            console.log('Creating cart with query 4:', isUUID);
            query.userRef = Number(userRef);
            query.productRef = productRef;
            query.inventoryRef = inventoryRef;
        }
        else {
            console.log('Creating cart with query 5:', isUUID);
            query.correlationId = userRef;
            query.productRef = productRef;
            query.inventoryRef = inventoryRef;
        }
        console.log('Creating cart with query:', query);
        const existingCart = await this.repository.findCartByUserAndProduct(query);
        console.log('Existing cart found:', existingCart);
        let cartData;
        if (existingCart) {
            // Update the existing cart's quantity
            const updatedQuantity = Number(existingCart.quantity) + Number(quantity);
            cartData = await this.repository.updateCartQuantity(existingCart.id, updatedQuantity);
        }
        else {
            // Create a new cart document
            cartData = await this.repository.createCart(payload);
        }
        return cartData;
    }
    async getUserAllCartById(userId) {
        return await this.repository.getUserAllCartById(userId);
    }
    async getAllCartByUser(payload) {
        return await this.repository.getAllCartByUser(payload);
    }
    async getCartWithPagination(payload) {
        const cart = await this.repository.getCartWithPagination(payload);
        return cart;
    }
    async getSingleCart(id) {
        const cartData = await this.repository.findById(id);
        if (!cartData)
            throw new errors_1.NotFoundError('Cart Not Find');
        return cartData;
    }
    async updateCart(id, payload) {
        const cartData = await this.repository.updateCart(id, payload);
        return cartData;
    }
    async updateCartQuantity(cartId, newQuantity) {
        const updatedCart = await this.repository.updateCartQuantity(cartId, newQuantity);
        if (!updatedCart) {
            throw new Error('Cart not found');
        }
        // Optionally, calculate totals and return them here
        return updatedCart;
    }
    async deleteCart(id) {
        const deletedCart = await this.repository.deleteCart(id);
        return deletedCart;
    }
    // Buy now Cart ==========================================
    async createBuyNowCart(payload, tx) {
        const { quantity, userRef, productRef, inventoryRef } = payload;
        if (!productRef && !inventoryRef) {
            throw new Error('Product ID & Inventory ID is required');
        }
        const query = {};
        console.log('Creating cart with query 2:', payload);
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
            .test((payload === null || payload === void 0 ? void 0 : payload.userRef) || '');
        console.log('Creating cart with query 3:', isUUID);
        if (!isUUID) {
            console.log('Creating cart with query 4:', isUUID);
            query.userRef = Number(userRef);
            // query.productRef = productRef;
            // query.inventoryRef = inventoryRef;
        }
        else {
            console.log('Creating cart with query 5:', isUUID);
            query.correlationId = userRef;
            // query.productRef = productRef;
            // query.inventoryRef = inventoryRef;
        }
        console.log('Creating cart with query:', query);
        const existingCart = await this.repository.findBuyNowCartByUserAndProduct(query);
        console.log('Existing cart found:', existingCart);
        let cartData;
        if (existingCart) {
            // Update the existing cart's quantity
            await this.repository.deleteCart(String(existingCart.id));
            // const updatedQuantity = Number(existingCart.quantity) + Number(quantity);
            // cartData = await this.repository.updateCartQuantity(
            //   existingCart.id,
            //   updatedQuantity
            // );
        }
        // Create a new cart document
        cartData = await this.repository.createBuyNowCart(payload);
        return cartData;
    }
    async getAllBuyNowCartByUser(payload) {
        return await this.repository.getAllBuyNowCartByUser(payload);
    }
}
exports.CartService = CartService;
exports.default = new CartService(cart_repository_1.default);
