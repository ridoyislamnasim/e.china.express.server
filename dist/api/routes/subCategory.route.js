"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sub_category_controller_1 = __importDefault(require("../../modules/subCategory/sub.category.controller"));
// import jwtAuth from "../../middleware/auth/jwtAuth";
// import { upload } from "../../middleware/upload/upload";
const SubCategoryRoute = (0, express_1.Router)();
// SubCategoryRoute.use(jwtAuth());
SubCategoryRoute.route("/")
    .post(sub_category_controller_1.default.createSubCategory)
    .get(sub_category_controller_1.default.getAllSubCategory);
SubCategoryRoute.get("/pagination", sub_category_controller_1.default.getSubCategoryWithPagination);
SubCategoryRoute.route("/:slug")
    .get(sub_category_controller_1.default.getSingleSubCategory)
    .put(sub_category_controller_1.default.updateSubCategory)
    .delete(sub_category_controller_1.default.deleteSubCategory);
exports.default = SubCategoryRoute;
