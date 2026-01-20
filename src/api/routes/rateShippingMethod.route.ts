import { Router } from "express";
// import controller from "../../modules/order/order.controller";
import controller from "../../modules/rateShippingMethod/shippingMethod.controller";

// import jwtAuth from "../../middleware/auth/jwtAuth";
// import { upload } from "../../middleware/upload/upload";

const rateShippingMethodRoute = Router();
// OrderRoute.use(jwtAuth());

// rateShippingMethodRoute.post('/',controller.createShippingMethod)
rateShippingMethodRoute.route("/")
    .post(controller.createShippingMethod)
    .get(controller.getShippingMethod);

// countryRoute.route("/order-product").get(controller.getOrderProducts);
// countryRoute.route("/admin").post(controller.createAdminOrder);
// countryRoute.route("/user/:id").get(controller.getUserAllOrder);
// countryRoute.route("/track").get(controller.orderTracking);

rateShippingMethodRoute.get("/pagination", controller.getShippingMethodWithPagination);
// countryRoute.get("/incomplete/pagination", controller.getIncompleteOrderWithPagination);

rateShippingMethodRoute.route("/:id")
    .get(controller.getSingleShippingMethod)
    .put( controller.updateShippingMethod)
    .delete(controller.deleteShippingMethod);

// countryRoute.put("/status/:id", controller.updateOrderStatus);
// countryRoute.put("/couriersend/:id", controller.isCourierSending);

export default rateShippingMethodRoute;
