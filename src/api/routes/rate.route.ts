import { Router } from "express";
// import controller from "../../modules/order/order.controller";
import controller from "../../modules/rate/rate.controller";

import jwtAuth from "../../middleware/auth/jwtAuth";
// import { upload } from "../../middleware/upload/upload";
import countryRoute from "./country.route";

const rateRoute = Router();
// OrderRoute.use(jwtAuth());

rateRoute.route("/")
    .post(controller.createRate)
    .get(controller.getAllRate);

rateRoute.route("/find").get(controller.findRateByCriteria);
rateRoute.route("/method-wise-rate").get(controller.countryMethodWiseRate);
// rate/bulk-adjust
rateRoute.route("/bulk-adjust").post(controller.bulkAdjustRate);
rateRoute.route("/find/shipping-rate").post(jwtAuth(), controller.findShippingRateForProduct);

// rateRoute.route("/:rateId")
//     .put(controller.updateRate);

export default rateRoute;
