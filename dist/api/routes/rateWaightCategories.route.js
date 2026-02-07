"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import controller from "../../modules/order/order.controller";
const rateWeightCategories_controller_1 = __importDefault(require("../../modules/rateWeightCategories/rateWeightCategories.controller"));
// import jwtAuth from "../../middleware/auth/jwtAuth";
// import { upload } from "../../middleware/upload/upload";
const rateWeightCategoriesRoute = (0, express_1.Router)();
// OrderRoute.use(jwtAuth());
rateWeightCategoriesRoute.route("/")
    .post(rateWeightCategories_controller_1.default.createRateWeightCategories)
    .get(rateWeightCategories_controller_1.default.getAllRateWeightCategories);
rateWeightCategoriesRoute.get("/pagination", rateWeightCategories_controller_1.default.getRateWeightCategoriesWithPagination);
rateWeightCategoriesRoute.route("/:id")
    // .get(controller.getSingleOrder)
    .put(rateWeightCategories_controller_1.default.updateRateWeightCategories)
    .delete(rateWeightCategories_controller_1.default.deleteRateWeightCategories);
exports.default = rateWeightCategoriesRoute;
