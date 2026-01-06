import { Router } from "express";
import jwtAuth from "../../middleware/auth/jwtAuth";
import bandingController from "../../modules/banding/banding.controller";

const BandingRoute = Router();
// BandingRoute.use(jwtAuth()); // Uncomment for auth

BandingRoute.route("/")
  .post(bandingController.createBanding)
  .get(bandingController.getAllBandings);

BandingRoute.get("/pagination", bandingController.getBandingsWithPagination);
BandingRoute.get("/by-type/:type", bandingController.getBandingsByType);
BandingRoute.get("/by-category/:category", bandingController.getBandingsByCategory);
BandingRoute.get("/by-status/:status", bandingController.getBandingsByStatus);
BandingRoute.get("/search", bandingController.searchBandings);

BandingRoute.route("/:id")
  .get(bandingController.getSingleBanding)
  .put(bandingController.updateBanding)
  .patch(bandingController.partialUpdateBanding)
  .delete(bandingController.deleteBanding);

BandingRoute.put("/:id/status", bandingController.updateBandingStatus);
BandingRoute.put("/:id/price", bandingController.updateBandingPrice);
BandingRoute.get("/slug/:slug", bandingController.getBandingBySlug);

export default BandingRoute;