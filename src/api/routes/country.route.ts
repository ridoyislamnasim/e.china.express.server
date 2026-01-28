import { Router } from "express";
// import controller from "../../modules/order/order.controller";
import controller from "../../modules/country/country.controller";

// import jwtAuth from "../../middleware/auth/jwtAuth";
// import { upload } from "../../middleware/upload/upload";

const countryRoute = Router();
// OrderRoute.use(jwtAuth());

countryRoute.route("/")
    .post(controller.createCountry)
    .get(controller.getAllCountry);

countryRoute.route("/shipping").get(controller.getCountryForShipping);
countryRoute.route("/export").get(controller.exportCountryData);
countryRoute.route("/port").get(controller.getAllPorts);
// countryRoute.route("/track").get(controller.orderTracking);

countryRoute.get("/pagination", controller.getCountryWithPagination);
// countryRoute.get("/incomplete/pagination", controller.getIncompleteOrderWithPagination);

countryRoute.route("/:id")
    // .get(controller.getSingleOrder)
    .patch( controller.updateCountry)
    .delete(controller.deleteCountry);

// countryRoute.put("/status/:id", controller.updateOrderStatus);
// countryRoute.put("/couriersend/:id", controller.isCourierSending);

export default countryRoute;
