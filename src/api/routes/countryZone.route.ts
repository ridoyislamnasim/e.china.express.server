import { Router } from "express";
// import controller from "../../modules/order/order.controller";
import controller from "../../modules/countryZone/country.zone.controller";

// import jwtAuth from "../../middleware/auth/jwtAuth";
// import { upload } from "../../middleware/upload/upload";

const countryZoneRouter = Router();
// OrderRoute.use(jwtAuth());

countryZoneRouter.route("/")
    .post(controller.createCountryZone)
    .get(controller.getAllCountryZone);

countryZoneRouter.route("/shipping").get(controller.getCountryZoneForShipping);
countryZoneRouter.route("/export").get(controller.exportCountryZoneData);

countryZoneRouter.get("/pagination", controller.getCountryZoneWithPagination);

countryZoneRouter.route("/:id")
    .patch( controller.updateCountryZone)
    .get(controller.getSingleZone)
    .delete(controller.deleteCountryZone);

export default countryZoneRouter;
