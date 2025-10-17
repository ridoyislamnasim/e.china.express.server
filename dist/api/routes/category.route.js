"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = __importDefault(require("../../modules/category/category.controller"));
// import jwtAuth from "../../middleware/auth/jwtAuth";
const upload_1 = require("../../middleware/upload/upload");
const CategoryRoute = (0, express_1.Router)();
// CategoryRoute.use(jwtAuth());
// CategoryRoute.get("/navbar", controller.getNavBar);
CategoryRoute.route("/")
    .post(upload_1.upload.any(), category_controller_1.default.createCategory)
    .get(category_controller_1.default.getAllCategory);
CategoryRoute.get("/navbar", category_controller_1.default.getNavBar);
CategoryRoute.get("/pagination", category_controller_1.default.getCategoryWithPagination);
// CategoryRoute.route(":slug").get(controller.getSingleCategoryWithSlug);
CategoryRoute.route("/:slug")
    .get(category_controller_1.default.getSingleCategory)
    .put(upload_1.upload.any(), category_controller_1.default.updateCategory)
    .delete(category_controller_1.default.deleteCategory);
// CategoryRoute.put("/status/:id", controller.updateCategoryStatus);
exports.default = CategoryRoute;
