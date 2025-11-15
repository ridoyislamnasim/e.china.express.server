import { Router } from "express";
// import controller from "../../modules/order/order.controller";
import controller from "../../modules/rateWeightCategories/rateWeightCategories.controller";

// import jwtAuth from "../../middleware/auth/jwtAuth";
import { upload } from "../../middleware/upload/upload";

const rateWeightCategoriesRoute = Router();
// OrderRoute.use(jwtAuth());

// rateWeightCategoriesRoute.post('/',controller.createRateWeightCategories)
rateWeightCategoriesRoute.route("/")
    .post(controller.createRateWeightCategories)
    .get(controller.getAllRateWeightCategories);

// countryRoute.route("/order-product").get(controller.getOrderProducts);
// countryRoute.route("/admin").post(controller.createAdminOrder);
// countryRoute.route("/user/:id").get(controller.getUserAllOrder);
// countryRoute.route("/track").get(controller.orderTracking);

// countryRoute.get("/pagination", controller.getOrderWithPagination);
// countryRoute.get("/incomplete/pagination", controller.getIncompleteOrderWithPagination);

// countryRoute.route(":id")
//     .get(controller.getSingleOrder)
//     .put(upload.any(), controller.updateOrder)
//     .delete(controller.deleteOrder);

// countryRoute.put("/status/:id", controller.updateOrderStatus);
// countryRoute.put("/couriersend/:id", controller.isCourierSending);

export default rateWeightCategoriesRoute;
