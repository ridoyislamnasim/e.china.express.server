"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_controller_1 = __importDefault(require("../../modules/cart/cart.controller"));
const jwtAuth_1 = __importDefault(require("../../middleware/auth/jwtAuth"));
const CartRoute = (0, express_1.Router)();
CartRoute.use((0, jwtAuth_1.default)());
// cart
CartRoute.route("/")
    .post(cart_controller_1.default.createCartItem);
//   .get(controller.getAllCartByUser);
CartRoute.get("/user-cart/product/:id", (0, jwtAuth_1.default)(), cart_controller_1.default.getUserCartByProductId);
CartRoute.get("/user-cart", (0, jwtAuth_1.default)(), cart_controller_1.default.getUserAllCart);
// /cart/product/:productId
CartRoute.delete("/product/:productTId", (0, jwtAuth_1.default)(), cart_controller_1.default.delteCartProductTId);
CartRoute.delete("/variant/:variantTId", (0, jwtAuth_1.default)(), cart_controller_1.default.delteCartProductVariantByTId);
exports.default = CartRoute;
