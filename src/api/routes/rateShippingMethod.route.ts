import { Router } from "express";
// import controller from "../../modules/order/order.controller";
import controller from "../../modules/rateShippingMethod/shippingMethod.controller";

// import jwtAuth from "../../middleware/auth/jwtAuth";
// import { upload } from "../../middleware/upload/upload";

const rateShippingMethodRoute = Router();

rateShippingMethodRoute.route("/")
    .post(controller.createShippingMethod)
    .get(controller.getShippingMethod);

rateShippingMethodRoute.get("/pagination", controller.getShippingMethodWithPagination);

rateShippingMethodRoute.route("/:id")
    .get(controller.getSingleShippingMethod)
    .put( controller.updateShippingMethod)
    .delete(controller.deleteShippingMethod);


export default rateShippingMethodRoute;
