"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = __importDefault(require("../../modules/order/order.controller"));
// import jwtAuth from "../../middleware/auth/jwtAuth";
const upload_1 = require("../../middleware/upload/upload");
const OrderRoute = (0, express_1.Router)();
// OrderRoute.use(jwtAuth());
OrderRoute.route("/")
    .post(order_controller_1.default.createOrder)
    .get(order_controller_1.default.getAllOrder);
OrderRoute.route("/order-product").get(order_controller_1.default.getOrderProducts);
OrderRoute.route("/admin").post(order_controller_1.default.createAdminOrder);
OrderRoute.route("/user/:id").get(order_controller_1.default.getUserAllOrder);
OrderRoute.route("/track").get(order_controller_1.default.orderTracking);
OrderRoute.get("/pagination", order_controller_1.default.getOrderWithPagination);
OrderRoute.route(":id")
    .get(order_controller_1.default.getSingleOrder)
    .put(upload_1.upload.any(), order_controller_1.default.updateOrder)
    .delete(order_controller_1.default.deleteOrder);
OrderRoute.put("/status/:id", order_controller_1.default.updateOrderStatus);
OrderRoute.put("/couriersend/:id", order_controller_1.default.isCourierSending);
exports.default = OrderRoute;
