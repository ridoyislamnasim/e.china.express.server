"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchError_1 = __importDefault(require("../../middleware/errors/catchError"));
const responseHandler_1 = require("../../utils/responseHandler");
const withTransaction_1 = __importDefault(require("../../middleware/transactions/withTransaction"));
const cart_service_1 = __importDefault(require("./cart.service"));
class CartController {
    constructor() {
        // Create a cart item
        this.createCart = (0, withTransaction_1.default)(async (req, res, next, tx) => {
            const payload = {
                quantity: Number(req.body.quantity) || 1,
                userRef: req.body.userRef,
                productRef: req.body.productRef,
                inventoryRef: Number(req.body.inventoryRef),
            };
            const cartResult = await cart_service_1.default.createCart(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(201, 'Cart Created successfully', cartResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getUserAllCartById = (0, catchError_1.default)(async (req, res) => {
            const userId = req.params.id;
            const cartResult = await cart_service_1.default.getUserAllCartById(userId);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Get All Carts', cartResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        // Get all cart items by user with calculation
        this.getAllCartByUser = (0, catchError_1.default)(async (req, res) => {
            console.log('Fetching all carts for user...', req.params);
            console.log('Fetching all carts for user...', req.query);
            const { userRef, coupon, productRef, inventoryRef } = req.query;
            const payload = { userRef, productRef, inventoryRef };
            if (coupon) {
                payload.coupon = coupon;
            }
            const cartResult = await cart_service_1.default.getAllCartByUser(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(200, ` ${cartResult === null || cartResult === void 0 ? void 0 : cartResult.message} `, cartResult === null || cartResult === void 0 ? void 0 : cartResult.data);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getCartWithPagination = (0, catchError_1.default)(async (req, res) => {
            const userId = req.query.userId;
            const payload = {
                userId,
                page: Number(req.query.page),
                limit: Number(req.query.limit),
                order: req.query.order,
            };
            const cart = await cart_service_1.default.getCartWithPagination(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Carts get successfully', cart);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getSingleCart = (0, catchError_1.default)(async (req, res) => {
            const id = Number(req.params.id);
            const cartResult = await cart_service_1.default.getSingleCart(id);
            const resDoc = (0, responseHandler_1.responseHandler)(201, 'Single Cart successfully', cartResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.updateCart = (0, catchError_1.default)(async (req, res) => {
            const id = Number(req.params.id);
            const payload = {
                quantity: req.body.quantity,
                userRef: req.body.userRef,
                productRef: req.body.productRef,
                inventoryRef: req.body.inventoryRef,
            };
            await cart_service_1.default.updateCart(id, payload);
            const resDoc = (0, responseHandler_1.responseHandler)(201, 'Cart Update successfully');
            res.status(resDoc.statusCode).json(resDoc);
        });
        // Update cart quanity with calculation
        this.updateCartQuantity = (0, catchError_1.default)(async (req, res) => {
            console.log("Updating cart quantity...", req.params, req.query, req.body);
            try {
                const cartId = Number(req.params.id);
                const { increment, decrement, update } = req.query;
                let newQuantity;
                // Fetch the current cart item
                const currentCart = await cart_service_1.default.getSingleCart(cartId);
                console.log("Current cart item:", currentCart);
                if (!currentCart) {
                    return res.status(404).json({
                        success: false,
                        message: 'Cart not found',
                    });
                }
                if (increment === 'true') {
                    // Increment quantity
                    newQuantity = currentCart.quantity + 1;
                }
                else if (decrement === 'true') {
                    // Decrement quantity, ensuring it doesn't drop below 1
                    newQuantity = Math.max(1, currentCart.quantity - 1);
                }
                else if (update === 'true') {
                    // Update with a specific value from body
                    const { quantity } = req.body;
                    if (!quantity || quantity < 1) {
                        return res.status(400).json({
                            success: false,
                            message: 'Invalid quantity provided',
                        });
                    }
                    newQuantity = Number(quantity);
                }
                else {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid operation, specify increment, decrement, or update',
                    });
                }
                // Update the cart quantity in the database
                const updatedCart = await cart_service_1.default.updateCartQuantity(Number(cartId), newQuantity);
                return res.status(200).json({
                    success: true,
                    data: updatedCart,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message,
                });
            }
        });
        // Delete a cart item
        this.deleteCart = (0, catchError_1.default)(async (req, res) => {
            const id = req.params.id;
            await cart_service_1.default.deleteCart(id);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Cart Deleted successfully');
            res.status(resDoc.statusCode).json(resDoc);
        });
        // Buy Now Cart
        this.createBuyNowCart = (0, withTransaction_1.default)(async (req, res, next, tx) => {
            const payload = {
                quantity: Number(req.body.quantity) || 1,
                userRef: req.body.userRef,
                productRef: req.body.productRef,
                inventoryRef: Number(req.body.inventoryRef),
            };
            const cartResult = await cart_service_1.default.createBuyNowCart(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(201, 'Cart Created successfully', cartResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getAllBuyNowCartByUser = (0, catchError_1.default)(async (req, res) => {
            console.log('Fetching all carts for user...', req.params);
            console.log('Fetching all carts for user...', req.query);
            const { userRef, coupon, productRef, inventoryRef } = req.query;
            const payload = { userRef, productRef, inventoryRef };
            if (coupon) {
                payload.coupon = coupon;
            }
            const cartResult = await cart_service_1.default.getAllBuyNowCartByUser(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(200, ` ${cartResult === null || cartResult === void 0 ? void 0 : cartResult.message} `, cartResult === null || cartResult === void 0 ? void 0 : cartResult.data);
            res.status(resDoc.statusCode).json(resDoc);
        });
        // Update cart quanity with calculation
        this.updateBuyNowCartQuantity = (0, catchError_1.default)(async (req, res) => {
            var _a, _b;
            console.log("Updating cart quantity...", req.params, req.query, req.body);
            try {
                const cartId = Number(req.params.id);
                const { increment, decrement, update } = req.query;
                let newQuantity = 0;
                // Fetch the current cart item
                const currentCart = await cart_service_1.default.getSingleBuyNowCart(cartId);
                console.log("Current cart item:", currentCart);
                if (!currentCart) {
                    return res.status(404).json({
                        success: false,
                        message: 'Cart not found',
                    });
                }
                if (increment === 'true') {
                    // Increment quantity
                    newQuantity = ((_a = currentCart.quantity) !== null && _a !== void 0 ? _a : 0) + 1;
                }
                else if (decrement === 'true') {
                    // Decrement quantity, ensuring it doesn't drop below 1
                    newQuantity = Math.max(1, ((_b = currentCart.quantity) !== null && _b !== void 0 ? _b : 0) - 1);
                }
                else if (update === 'true') {
                    // Update with a specific value from body
                    const { quantity } = req.body;
                    if (!quantity || quantity < 1) {
                        return res.status(400).json({
                            success: false,
                            message: 'Invalid quantity provided',
                        });
                    }
                    newQuantity = Number(quantity);
                }
                else {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid operation, specify increment, decrement, or update',
                    });
                }
                // Update the cart quantity in the database
                const updatedCart = await cart_service_1.default.updateBuyNowCartQuantity(Number(cartId), newQuantity);
                return res.status(200).json({
                    success: true,
                    data: updatedCart,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message,
                });
            }
        });
    }
}
exports.default = new CartController();
