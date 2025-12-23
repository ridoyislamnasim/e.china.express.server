"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const guide_controller_1 = __importDefault(require("../../modules/guide/guide.controller"));
const upload_1 = require("../../middleware/upload/upload");
const guideRoute = (0, express_1.Router)();
guideRoute
    .get("/", guide_controller_1.default.getAllGuides)
    .get("/pagination", guide_controller_1.default.getAllGuideWithPagination)
    //   .get("/:slug", guideController.getGuideBySlug)
    .post("/", guide_controller_1.default.createGuide)
    //   .put("/:id", guideController.updateGuide)
    .get("/:id", guide_controller_1.default.getGuideVideosById)
    .delete("/:id", guide_controller_1.default.deleteGuide)
    .put("/:id", guide_controller_1.default.updateGuide)
    .put("/video/:id", upload_1.upload.single("imgSrc"), guide_controller_1.default.updateGuideVideo)
    .post("/video", upload_1.upload.single("imgSrc"), guide_controller_1.default.createGuideVideo)
    .delete("/video/:id", guide_controller_1.default.deleteGuideVideo);
exports.default = guideRoute;
