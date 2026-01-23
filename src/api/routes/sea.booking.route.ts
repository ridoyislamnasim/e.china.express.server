import { Router } from "express";
import controller from "../../modules/seaBooking/sea.booking.controller";
import { upload } from "../../middleware/upload/upload";
import jwtAuth from "../../middleware/auth/jwtAuth";

const SeaBookingRouter = Router();
// SeaBookingRouter.use(jwtAuth());

SeaBookingRouter.route("/")
  .post(upload, jwtAuth(), controller.createSeaBooking)
  // .get(jwtAuth(), controller.getAllSeaBookingByFilterWithPagination);

SeaBookingRouter.get("/pagination", jwtAuth(), controller.getAllSeaBookingByFilterWithPagination);

SeaBookingRouter.route("/:id")
  .get(jwtAuth(), controller.getSingleSeaBooking)
  .put(jwtAuth(), controller.updateSeaBooking)
  .delete(jwtAuth(), controller.deleteSeaBooking);

export default SeaBookingRouter;
