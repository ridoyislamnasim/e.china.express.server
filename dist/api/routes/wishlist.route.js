"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const wishlist_controller_1 = __importDefault(require("../../modules/wishlist/wishlist.controller"));
const WishlistRoute = (0, express_1.Router)();
// WishlistRoute.use(jwtAuth());
WishlistRoute.route("/")
    .post(wishlist_controller_1.default.createWishList)
    .get(wishlist_controller_1.default.getAllWishList);
WishlistRoute.get("/pagination", wishlist_controller_1.default.getWishListWithPagination);
WishlistRoute.route("/:id")
    .get(wishlist_controller_1.default.getSingleWishList)
    .delete(wishlist_controller_1.default.deleteWishList);
exports.default = WishlistRoute;
