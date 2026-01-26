import { Router } from "express";
// import controller from "../../modules/order/order.controller";
import controller from "../../modules/rateExpress/rate.express.controller";

import jwtAuth from "../../middleware/auth/jwtAuth";
// import { upload } from "../../middleware/upload/upload";
import countryRoute from "./country.route";

const rateExpressRouter = Router();
// OrderRoute.use(jwtAuth());

rateExpressRouter.route("/")
    .post(controller.createRateExpress)
    .get(controller.getAllRateExpress);

rateExpressRouter.route("/find").get(controller.findRateExpressByCriteria);
rateExpressRouter.route("/find/booking-shipping-rateExpress").post(controller.findBookingShippingRateExpress);
rateExpressRouter.route("/method-wise-rateExpress").get(controller.countryMethodWiseRateExpress);
// rateExpress/bulk-adjust
rateExpressRouter.route("/bulk-adjust").post(controller.bulkAdjustRateExpress);
rateExpressRouter.route("/find/shipping-rateExpress").post(jwtAuth(), controller.findShippingRateExpressForProduct);
// rateExpressRoute.route("/:rateExpressId")
//     .put(controller.updateRateExpress);

export default rateExpressRouter;
