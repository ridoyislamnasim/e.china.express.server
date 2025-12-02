import { Router } from "express";
import guideController from "../../modules/guide/guide.controller";

const guideRoute = Router();

guideRoute.get("/", guideController.getAllGuides);

guideRoute.get("/:slug", guideController.getGuideBySlug);

guideRoute.post("/", guideController.createGuide);

guideRoute.put("/:slug", guideController.updateGuide);

guideRoute.delete("/:slug", guideController.deleteGuide);

export default guideRoute;
