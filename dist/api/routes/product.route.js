"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = __importDefault(require("../../modules/product/product.controller"));
// import jwtAuth from "../../middleware/auth/jwtAuth";
const upload_1 = require("../../middleware/upload/upload");
const ProductRoute = (0, express_1.Router)();
// ProductRoute.use(jwtAuth());
ProductRoute.route("/")
    .post(upload_1.upload.any(), product_controller_1.default.createProduct)
    .get(product_controller_1.default.getAllProduct);
// ProductRoute.get("/search", controller.getSearchProduct);
ProductRoute.get("/shop/option", product_controller_1.default.getShopOption);
ProductRoute.get("/related-product/:slug", product_controller_1.default.getRelatedProduct);
// ProductRoute.get("/view-type", controller.getAllProductForHomePage);
ProductRoute.get("/pagination", product_controller_1.default.getProductWithPagination);
ProductRoute.get("/pagination/admin", product_controller_1.default.getProductWithPaginationForAdmin);
ProductRoute.post("/view-product-count/:slug", product_controller_1.default.getProductViewCount);
// Trending Now
ProductRoute.get("/best-sell", product_controller_1.default.getAllBestSellProduct);
ProductRoute.get("/discounted-product", product_controller_1.default.getAllDiscountedProduct);
ProductRoute.get("/coming-soon", product_controller_1.default.getComingSoonProductWithPagination);
ProductRoute.get("/new-arrivals", product_controller_1.default.getNewArrivalsProductWithPagination);
ProductRoute.get("/trending", product_controller_1.default.getTrendingProductsWithPagination);
ProductRoute.route("/:slug")
    .get(product_controller_1.default.getSingleProduct)
    .put(upload_1.upload.any(), product_controller_1.default.updateProduct)
    .delete(product_controller_1.default.deleteProduct);
exports.default = ProductRoute;
