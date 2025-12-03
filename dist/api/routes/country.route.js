"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import controller from "../../modules/order/order.controller";
const country_controller_1 = __importDefault(require("../../modules/country/country.controller"));
// import jwtAuth from "../../middleware/auth/jwtAuth";
const upload_1 = require("../../middleware/upload/upload");
const countryRoute = (0, express_1.Router)();
// OrderRoute.use(jwtAuth());
countryRoute.route("/")
    .post(country_controller_1.default.createCountry)
    .get(country_controller_1.default.getAllCountry);
countryRoute.route("/shipping").get(country_controller_1.default.getCountryForShipping);
// countryRoute.route("/admin").post(controller.createAdminOrder);
// countryRoute.route("/user/:id").get(controller.getUserAllOrder);
// countryRoute.route("/track").get(controller.orderTracking);
countryRoute.get("/pagination", country_controller_1.default.getCountryWithPagination);
// countryRoute.get("/incomplete/pagination", controller.getIncompleteOrderWithPagination);
countryRoute.route("/:id")
    // .get(controller.getSingleOrder)
    .patch(upload_1.upload.any(), country_controller_1.default.updateCountry)
    .delete(country_controller_1.default.deleteCountry);
// countryRoute.put("/status/:id", controller.updateOrderStatus);
// countryRoute.put("/couriersend/:id", controller.isCourierSending);
exports.default = countryRoute;
