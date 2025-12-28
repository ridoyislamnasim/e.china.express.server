import { Router } from "express";
import guideController from "../../modules/guide/guide.controller";

const guideRoute = Router();

guideRoute
  .get("/", guideController.getAllGuides)
  .get("/pagination", guideController.getAllGuideWithPagination)
//   .get("/:slug", guideController.getGuideBySlug)
  .post("/", guideController.createGuide)
  //   .put("/:id", guideController.updateGuide)
  .get("/:id",guideController.getGuideVideosById)
  .delete("/:id", guideController.deleteGuide)
  .put("/:id",guideController.updateGuide)


  .put("/video/:id",upload.any(), guideController.updateGuideVideo)
  .post("/video",upload.any(),guideController.createGuideVideo)


  .delete("/video/:id", guideController.deleteGuideVideo);



export default guideRoute;
