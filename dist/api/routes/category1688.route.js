"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_1688_controller_1 = __importDefault(require("../../modules/category1688/category.1688.controller"));
const Category1688Router = (0, express_1.Router)();
// Category1688Router.use(jwtAuth());
// Category1688Router.get("/navbar", controller.getNavBar);
Category1688Router.route("/")
    .post(category_1688_controller_1.default.createCategory1688) //
    .get(category_1688_controller_1.default.getAllCategory1688); //
Category1688Router.get("/agent", category_1688_controller_1.default.getAllCategory1688ForAgent); //
Category1688Router.get('/agent/category/:categoryId', category_1688_controller_1.default.getCategoryIdBySubcategoryForAgent);
// Fetch raw 1688 API response for a given categoryId (no DB upsert)
Category1688Router.get('/category/:categoryId', category_1688_controller_1.default.getCategoryIdBySubcategory);
Category1688Router.get('/rate', category_1688_controller_1.default.getAllCategory1688ForRateCalculation);
Category1688Router.post('/:categoryId/rate-calculation', category_1688_controller_1.default.addCategoryForRateCalculation);
Category1688Router.route("/hs-code/:id")
    .post(category_1688_controller_1.default.createHsCodeEntryByCategoryId)
    .get(category_1688_controller_1.default.getHsCodeEntryByCategoryId);
//   .patch( controller.updateHsCodeEntryByCountryCode)
//   .put( controller.getHsCodeEntryByCountryCode)
//   .delete(controller.getHsCodeEntryByCountryCode)
exports.default = Category1688Router;
