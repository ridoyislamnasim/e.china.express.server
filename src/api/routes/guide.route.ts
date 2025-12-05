import { Router } from "express";
import guideController from "../../modules/guide/guide.controller";

const guideRoute = Router();

guideRoute.get("/", guideController.getAllGuides);

guideRoute.get("/:slug", guideController.getGuideBySlug);

guideRoute.post("/", guideController.createGuide);

guideRoute.put("/:id", guideController.updateGuide);

guideRoute.delete("/:id", guideController.deleteGuide);

guideRoute.delete("/video/:id", guideController.deleteGuideVideo);

guideRoute.put("/video/:id", guideController.updateGuideVideo);

export default guideRoute;
