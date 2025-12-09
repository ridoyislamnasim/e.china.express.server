"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = __importDefault(require("../../modules/product/product.controller"));
const ProductRoute = (0, express_1.Router)();
// ProductRoute.use(jwtAuth());
// 1688 API Routes
// getCategoryTranslation
ProductRoute.post("/1688/category-translation", product_controller_1.default.getCategoryTranslation);
ProductRoute.get("/agent/1688/product/filter", product_controller_1.default.get1688ProductFilterForAgent); //for production agent
ProductRoute.get("/1688/product/filter", product_controller_1.default.get1688ProductFilter); //for production use
ProductRoute.get("/agent/1688/details/:productId", product_controller_1.default.get1688ProductDetailsForAgent); // for production use
ProductRoute.get("/1688/details/:productId", product_controller_1.default.get1688ProductDetails); // for production agent
ProductRoute.get("/1688/details/test/:productId", product_controller_1.default.get1688ProductDetailsTest);
ProductRoute.get("/1688/search", product_controller_1.default.get1688Products); // for production use
// ProductRoute.route("/")
//   // .post(upload.any(), controller.createProduct)
//   .get(controller.getAllProduct);
// ProductRoute.get("/search", controller.getSearchProduct);
// ProductRoute.get("/shop/option", controller.getShopOption);
// ProductRoute.get("/related-product/:slug", controller.getRelatedProduct);
// ProductRoute.get("/view-type", controller.getAllProductForHomePage);
// ProductRoute.get("/pagination", controller.getProductWithPagination);
// ProductRoute.get("/pagination/admin", controller.getProductWithPaginationForAdmin);
// ProductRoute.post("/view-product-count/:slug", controller.getProductViewCount);
// // Trending Now
// ProductRoute.get("/best-sell", controller.getAllBestSellProduct);
// ProductRoute.get("/discounted-product", controller.getAllDiscountedProduct);
// ProductRoute.get("/coming-soon", controller.getComingSoonProductWithPagination);
// ProductRoute.get("/new-arrivals", controller.getNewArrivalsProductWithPagination);
// ProductRoute.get("/trending", controller.getTrendingProductsWithPagination);
// ProductRoute.route("/:slug")
//   .get(controller.getSingleProduct)
//   .put(upload.any(), controller.updateProduct)
//   .delete(controller.deleteProduct);
exports.default = ProductRoute;
