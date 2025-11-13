import { Router } from "express";
import exampleRouter from "./routes/example.route";
import authRouter from "./routes/auth.route";
import CategoryRouter from "./routes/category.route";
import SubCategoryRouter from "./routes/subCategory.route";
import ProductRouter from "./routes/product.route";
import BannerRouter from "./routes/banner.route";
import BlogRouter from "./routes/blog.route";
import CartRouter from "./routes/cart.route";
import CouponRouter from "./routes/coupon.route";
import OrderRouter from "./routes/order.route";
import WishlistRouter from "./routes/wishlist.route";
import countryRouter from "./routes/country.route";
import rateShippingMethodRoute from "./routes/rateShippingMethod.route";
import rateWeightCategoriesRoute from "./routes/rateWaightCategories.route";
import rateProductRoute from "./routes/rateProduct.route";
import rateRoute from "./routes/rate.route";
import WarehouseRoute from "./routes/warehouse.route";
// import other routers here

const rootRouter = Router();

rootRouter.use("/example", exampleRouter);
rootRouter.use("/auth", authRouter);
rootRouter.use("/warehouse", WarehouseRoute);


rootRouter.use("/category", CategoryRouter);
rootRouter.use("/banner", BannerRouter);
rootRouter.use("/subcategory", SubCategoryRouter);
rootRouter.use("/product", ProductRouter);
rootRouter.use("/blog", BlogRouter);
rootRouter.use("/cart", CartRouter);
rootRouter.use("/coupon", CouponRouter);
rootRouter.use("/order", OrderRouter);
rootRouter.use("/wishlist", WishlistRouter);


rootRouter.use('/country', countryRouter);
rootRouter.use('/rate/shippingmethod', rateShippingMethodRoute);
rootRouter.use('/rate/weightcategories', rateWeightCategoriesRoute);
rootRouter.use('/rate/product', rateProductRoute);
rootRouter.use('/rate', rateRoute);


export default rootRouter;
