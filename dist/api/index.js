"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const example_route_1 = __importDefault(require("./routes/example.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const category_route_1 = __importDefault(require("./routes/category.route"));
const subCategory_route_1 = __importDefault(require("./routes/subCategory.route"));
const product_route_1 = __importDefault(require("./routes/product.route"));
const banner_route_1 = __importDefault(require("./routes/banner.route"));
const blog_route_1 = __importDefault(require("./routes/blog.route"));
const cart_route_1 = __importDefault(require("./routes/cart.route"));
const coupon_route_1 = __importDefault(require("./routes/coupon.route"));
const order_route_1 = __importDefault(require("./routes/order.route"));
const wishlist_route_1 = __importDefault(require("./routes/wishlist.route"));
const country_route_1 = __importDefault(require("./routes/country.route"));
const rateShippingMethod_route_1 = __importDefault(require("./routes/rateShippingMethod.route"));
const rateWaightCategories_route_1 = __importDefault(require("./routes/rateWaightCategories.route"));
const rateProduct_route_1 = __importDefault(require("./routes/rateProduct.route"));
const rate_route_1 = __importDefault(require("./routes/rate.route"));
const category1688_route_1 = __importDefault(require("./routes/category1688.route"));
const warehouse_route_1 = __importDefault(require("./routes/warehouse.route"));
const policies_route_1 = __importDefault(require("./routes/policies.route"));
const guide_route_1 = __importDefault(require("./routes/guide.route"));
// import other routers here
const rootRouter = (0, express_1.Router)();
rootRouter.use("/example", example_route_1.default);
rootRouter.use("/auth", auth_route_1.default);
rootRouter.use('/warehouses', warehouse_route_1.default);
rootRouter.use("/1688/category", category1688_route_1.default);
rootRouter.use("/category", category_route_1.default);
rootRouter.use("/banner", banner_route_1.default);
rootRouter.use("/subcategory", subCategory_route_1.default);
rootRouter.use("/product", product_route_1.default);
// rootRouter.use("/blog", BlogRouter);
rootRouter.use("/coupon", coupon_route_1.default);
rootRouter.use("/order", order_route_1.default);
rootRouter.use("/wishlist", wishlist_route_1.default);
rootRouter.use("/cart", cart_route_1.default); // cart routes
rootRouter.use('/country', country_route_1.default);
rootRouter.use('/rate/shippingmethod', rateShippingMethod_route_1.default);
rootRouter.use('/rate/weightcategories', rateWaightCategories_route_1.default);
rootRouter.use('/rate/product', rateProduct_route_1.default);
rootRouter.use('/rate', rate_route_1.default);
// refi 
//done by rafi
rootRouter.use("/policies", policies_route_1.default); // policies routes
rootRouter.use("/blog", blog_route_1.default);
rootRouter.use("/guide", guide_route_1.default);
exports.default = rootRouter;
