import { Router } from "express";
// import controller from "../../modules/order/order.controller";
import controller from "../../modules/rateFreight/rate.freight.controller";

import jwtAuth from "../../middleware/auth/jwtAuth";
// import { upload } from "../../middleware/upload/upload";
import countryRoute from "./country.route";

const rateFreightRouter = Router();
// OrderRoute.use(jwtAuth());

rateFreightRouter.route("/")
    .post(controller.createRateFreight)
    .get(controller.getAllRateFreight);

rateFreightRouter.route("/find").get(controller.findRateFreightByCriteria);
rateFreightRouter.route("/find/booking-shipping-rateFreight").post(controller.findBookingShippingRateFreight);
rateFreightRouter.route("/method-wise-rateFreight").get(controller.countryMethodWiseRateFreight);

// rateFreight/bulk-adjust
rateFreightRouter.route("/bulk-adjust").post(controller.bulkAdjustRateFreight);
rateFreightRouter.route("/find/shipping-rateFreight").post(jwtAuth(), controller.findShippingRateFreightForProduct);
// rateFreightRoute.route("/:rateFreightId")
//     .put(controller.updateRateFreight);

export default rateFreightRouter;
