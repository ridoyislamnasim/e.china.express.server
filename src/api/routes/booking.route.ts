import { Router } from "express";
import controller from "../../modules/booking/booking.controller";
import { upload } from "../../middleware/upload/upload";
import jwtAuth from "../../middleware/auth/jwtAuth";

const BookingRouter = Router();
// BookingRouter.use(jwtAuth());

BookingRouter.route("/supplier")
  .post( jwtAuth(), controller.createSupplierInformation) // not use now
  .get(jwtAuth(), controller.getAllSupplierInformation);

BookingRouter.route("/package")
  .post( jwtAuth(), controller.createBookingPackage)

BookingRouter.get("/pagination", jwtAuth(), controller.getAllBookingByFilterWithPagination);

BookingRouter.route("/:id")
  .get(jwtAuth(), controller.getSingleBooking)
  .put(jwtAuth(), controller.updateBooking)
  .delete(jwtAuth(), controller.deleteBooking);

export default BookingRouter;
