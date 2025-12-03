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
//   CartRoute.route("/buy-now")
//   .post(controller.createBuyNowCart)
//   .get(controller.getAllBuyNowCartByUser);
//   CartRoute.route("/buy-now/:id")
//   .put( controller.updateBuyNowCartQuantity)
// CartRoute.get("/user-all-cart/:id", controller.getUserAllCartById);
// CartRoute.get("/pagination", controller.getCartWithPagination);
// CartRoute.route("/:id")
//   .get(controller.getSingleCart)
//   .put( controller.updateCartQuantity)
//   .delete(controller.deleteCart);
exports.default = CartRoute;
