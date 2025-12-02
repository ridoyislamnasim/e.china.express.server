import { Router } from "express";
import guideService from "../../modules/guide/guide.service";

const guideRoute = Router();


guideRoute.get("/", guideService.getGuideData);



guideRoute.get("/:slug", guideService.getGuideById);



guideRoute.post("/", guideService.createGuideData);



guideRoute.put("/:slug", guideService.updateGuideData);



guideRoute.delete("/:slug", (req, res) => {
  const slug = req.params.slug;
  res.send(`Guide Route DELETE works with slug: ${slug}`);
});






export default guideRoute;