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
import ShoppingOrderRouter from "./routes/shoppingOrder.route";
import WishlistRouter from "./routes/wishlist.route";
import countryRouter from "./routes/country.route";
import rateShippingMethodRoute from "./routes/rateShippingMethod.route";
import rateWeightCategoriesRoute from "./routes/rateWaightCategories.route";
import rateProductRoute from "./routes/rateProduct.route";
import rateRoute from "./routes/rate.route";
import Category1688Router from "./routes/category1688.route";
import warehouseRoute from "./routes/warehouse.route";
import policiesRoute from "./routes/policies.route";
import guideRoute from "./routes/guide.route";
import warehouseSpaceRoute from "./routes/warehouseSpace.route";
import PackageRoute from "./routes/package.route";
import AirBookingRouter from "./routes/air.booking.route";
import BandingRoute from "./routes/banding.route";
import contactUsRoute from "./routes/companyContact.route";
import teamManagementRoute from "./routes/teamManagement.route";
import servicesRoute from "./routes/services.route";
import RoleRoute from "./routes/role.route";
import SeaBookingRouter from "./routes/sea.booking.route";
import BookingRouter from "./routes/booking.route";
import countryZoneRouter from "./routes/countryZone.route";
import rateExpressRouter from "./routes/rateExpress.route";
import containerRouter from "./routes/container.route";
import shipScheduleRouter from "./routes/ship.schedule.route";
import shipRouteRouter from "./routes/ship.route.route";
import rateFreightRouter from "./routes/rateFreight.route";

import carrierCompanyRouter from "./routes/carrierCompany.route";
import WalletRoute from "./routes/wallet.route";
import ExpressBookingRouter from "./routes/express.booking.route";
import TransactionRoute from "./routes/transaction.routes";
import AddressRouter from "./routes/address.route";

// import other routers here

const rootRouter = Router();

rootRouter.use("/example", exampleRouter);
rootRouter.use("/auth", authRouter);
rootRouter.use("/role", RoleRoute);

rootRouter.use("/1688/category", Category1688Router);

rootRouter.use("/category", CategoryRouter);
rootRouter.use("/banner", BannerRouter);
rootRouter.use("/subcategory", SubCategoryRouter);
rootRouter.use("/product", ProductRouter);
// rootRouter.use("/blog", BlogRouter);
rootRouter.use("/coupon", CouponRouter);
rootRouter.use("/order", ShoppingOrderRouter);

rootRouter.use("/cart", CartRouter); // cart routes
rootRouter.use("/country", countryRouter);
rootRouter.use("/country/zone", countryZoneRouter);
rootRouter.use("/rate/shippingmethod", rateShippingMethodRoute);
rootRouter.use("/rate/weightcategories", rateWeightCategoriesRoute);
rootRouter.use("/rate/product", rateProductRoute);
// Container
rootRouter.use("/rate/container", containerRouter);
rootRouter.use("/rate/ship/schedule", shipScheduleRouter);
rootRouter.use("/rate/ship/route", shipRouteRouter);
rootRouter.use("/rate/carrier-company", carrierCompanyRouter);
rootRouter.use("/rate", rateRoute);
rootRouter.use("/rate/express", rateExpressRouter);
rootRouter.use("/rate/freight", rateFreightRouter);

// booking
rootRouter.use("/country", countryRouter);
rootRouter.use("/rate/shippingmethod", rateShippingMethodRoute);
rootRouter.use("/rate/weightcategories", rateWeightCategoriesRoute);
rootRouter.use("/rate/product", rateProductRoute);
rootRouter.use("/rate", rateRoute);

// booking
rootRouter.use("/booking", BookingRouter);
rootRouter.use("/booking/air", AirBookingRouter);
rootRouter.use("/booking/sea", SeaBookingRouter);
rootRouter.use("/booking/express", ExpressBookingRouter);
rootRouter.use("/booking/inventory", WishlistRouter);

// shopping order
rootRouter.use("/shopping-order", ShoppingOrderRouter);

// WarehouseSpace masud
rootRouter.use("/warehouses", warehouseRoute);
rootRouter.use("/warehouse-spaces", warehouseSpaceRoute);

rootRouter.use("/packages", PackageRoute);
rootRouter.use("/banding", BandingRoute);

rootRouter.use("/wallets", WalletRoute);
rootRouter.use("/transactions", TransactionRoute);

//done by rafi
rootRouter.use("/policies", policiesRoute);
rootRouter.use("/services", servicesRoute);
rootRouter.use("/blog", BlogRouter);
rootRouter.use("/guide", guideRoute);
rootRouter.use("/contact-us", contactUsRoute);
rootRouter.use("/team-management", teamManagementRoute);

//Address Route done by Sourabh
rootRouter.use("/address", AddressRouter);

export default rootRouter;
