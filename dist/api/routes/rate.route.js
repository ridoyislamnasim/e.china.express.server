"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import controller from "../../modules/order/order.controller";
const rate_controller_1 = __importDefault(require("../../modules/rate/rate.controller"));
const rateRoute = (0, express_1.Router)();
// OrderRoute.use(jwtAuth());
rateRoute.route("/")
    .post(rate_controller_1.default.createRate)
    .get(rate_controller_1.default.getAllRate);
rateRoute.route("/find").get(rate_controller_1.default.findRateByCriteria);
rateRoute.route("/method-wise-rate").get(rate_controller_1.default.countryMethodWiseRate);
// rate/bulk-adjust
rateRoute.route("/bulk-adjust").post(rate_controller_1.default.bulkAdjustRate);
rateRoute.route("/find/shipping-rate").get(rate_controller_1.default.findShippingRateForProduct);
// rateRoute.route("/:rateId")
//     .put(controller.updateRate);
exports.default = rateRoute;
