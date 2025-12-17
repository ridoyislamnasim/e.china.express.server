import { Router } from "express";
import guideController from "../../modules/guide/guide.controller";

const guideRoute = Router();

guideRoute
  .get("/", guideController.getAllGuides)
  .get("/pagination", guideController.getAllGuideWithPagination)
//   .get("/:slug", guideController.getGuideBySlug)
  .post("/", guideController.createGuide)
//   .put("/:id", guideController.updateGuide)
//   .delete("/:id", guideController.deleteGuide)
//   .put("/video/:id", guideController.updateGuideVideo)
//   .delete("/video/:id", guideController.deleteGuideVideo);



export default guideRoute;
