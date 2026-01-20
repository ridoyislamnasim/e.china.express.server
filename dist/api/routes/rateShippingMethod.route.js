"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import controller from "../../modules/order/order.controller";
const shippingMethod_controller_1 = __importDefault(require("../../modules/rateShippingMethod/shippingMethod.controller"));
// import jwtAuth from "../../middleware/auth/jwtAuth";
// import { upload } from "../../middleware/upload/upload";
const rateShippingMethodRoute = (0, express_1.Router)();
// OrderRoute.use(jwtAuth());
// rateShippingMethodRoute.post('/',controller.createShippingMethod)
rateShippingMethodRoute.route("/")
    .post(shippingMethod_controller_1.default.createShippingMethod)
    .get(shippingMethod_controller_1.default.getShippingMethod);
// countryRoute.route("/order-product").get(controller.getOrderProducts);
// countryRoute.route("/admin").post(controller.createAdminOrder);
// countryRoute.route("/user/:id").get(controller.getUserAllOrder);
// countryRoute.route("/track").get(controller.orderTracking);
rateShippingMethodRoute.get("/pagination", shippingMethod_controller_1.default.getShippingMethodWithPagination);
// countryRoute.get("/incomplete/pagination", controller.getIncompleteOrderWithPagination);
rateShippingMethodRoute.route("/:id")
    .get(shippingMethod_controller_1.default.getSingleShippingMethod)
    .put(shippingMethod_controller_1.default.updateShippingMethod)
    .delete(shippingMethod_controller_1.default.deleteShippingMethod);
// countryRoute.put("/status/:id", controller.updateOrderStatus);
// countryRoute.put("/couriersend/:id", controller.isCourierSending);
exports.default = rateShippingMethodRoute;
