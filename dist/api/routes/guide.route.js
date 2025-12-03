"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const guide_controller_1 = __importDefault(require("../../modules/guide/guide.controller"));
const guideRoute = (0, express_1.Router)();
guideRoute.get("/", guide_controller_1.default.getAllGuides);
guideRoute.get("/:slug", guide_controller_1.default.getGuideBySlug);
guideRoute.post("/", guide_controller_1.default.createGuide);
guideRoute.put("/:slug", guide_controller_1.default.updateGuide);
guideRoute.delete("/:slug", guide_controller_1.default.deleteGuide);
exports.default = guideRoute;
