"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_controller_1 = __importDefault(require("../../modules/cart/cart.controller"));
const CartRoute = (0, express_1.Router)();
// CartRoute.use(jwtAuth());
// cart
CartRoute.route("/")
    .post(cart_controller_1.default.createCart)
    .get(cart_controller_1.default.getAllCartByUser);
CartRoute.route("/buy-now")
    .post(cart_controller_1.default.createBuyNowCart)
    .get(cart_controller_1.default.getAllBuyNowCartByUser);
CartRoute.route("/buy-now/:id")
    .put(cart_controller_1.default.updateBuyNowCartQuantity);
CartRoute.get("/user-all-cart/:id", cart_controller_1.default.getUserAllCartById);
CartRoute.get("/pagination", cart_controller_1.default.getCartWithPagination);
CartRoute.route("/:id")
    .get(cart_controller_1.default.getSingleCart)
    .put(cart_controller_1.default.updateCartQuantity)
    .delete(cart_controller_1.default.deleteCart);
exports.default = CartRoute;
