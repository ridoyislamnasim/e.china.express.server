import { Router } from "express";
import controller from "../../modules/airBooking/air.booking.controller";
import { upload } from "../../middleware/upload/upload";
import jwtAuth from "../../middleware/auth/jwtAuth";

const AirBookingRouter = Router();
// AirBookingRouter.use(jwtAuth());

AirBookingRouter.route("/")
  .post(upload, jwtAuth(), controller.createAirBooking)
  // .get(jwtAuth(), controller.getAllAirBookingByFilterWithPagination);

AirBookingRouter.get("/pagination", jwtAuth(), controller.getAllAirBookingByFilterWithPagination);

AirBookingRouter.route("/:id")
  .get(jwtAuth(), controller.getSingleAirBooking)
  .put(jwtAuth(), controller.updateAirBooking)
  .delete(jwtAuth(), controller.deleteAirBooking);

export default AirBookingRouter;
