"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const banner_controller_1 = __importDefault(require("../../modules/banner/banner.controller"));
const upload_1 = require("../../middleware/upload/upload");
// import jwtAuth from "../../middleware/auth/jwtAuth";
const BannerRoute = (0, express_1.Router)();
// BannerRoute.use(jwtAuth());
BannerRoute.route("/")
    .post(upload_1.upload.any(), banner_controller_1.default.createBanner)
    .get(banner_controller_1.default.getAllBanner);
BannerRoute.get("/pagination", banner_controller_1.default.getBannerWithPagination);
BannerRoute.route("/:id")
    .get(banner_controller_1.default.getSingleBanner)
    .put(upload_1.upload.any(), banner_controller_1.default.updateBanner)
    .delete(banner_controller_1.default.deleteBanner);
exports.default = BannerRoute;
