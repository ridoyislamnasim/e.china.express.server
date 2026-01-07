import { Router } from "express";
import controller from "../../modules/airBooking/air.booking.controller";
// import { upload } from "../../middleware/upload/upload";
// import jwtAuth from "../../middleware/auth/jwtAuth";

const AirBookingRouter = Router();
// AirBookingRouter.use(jwtAuth());

AirBookingRouter.route("/")
  .post( controller.createAirBooking)
  .get(controller.getAllAirBooking);

AirBookingRouter.get("/pagination", controller.getAirBookingWithPagination);

AirBookingRouter.route("/:id")
  .get(controller.getSingleAirBooking)
  .put( controller.updateAirBooking)
  .delete(controller.deleteAirBooking);

export default AirBookingRouter;
