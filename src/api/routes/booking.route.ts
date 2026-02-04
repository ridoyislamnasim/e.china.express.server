import { Router } from "express";
import controller from "../../modules/booking/booking.controller";
import { upload } from "../../middleware/upload/upload";
import jwtAuth from "../../middleware/auth/jwtAuth";

const BookingRouter = Router();
// BookingRouter.use(jwtAuth());
// customer
BookingRouter.route("/supplier")
  .post( jwtAuth(), controller.createSupplierInformation) // not use now
  .get(jwtAuth(), controller.getAllSupplierInformation);
BookingRouter.route("/package").post( jwtAuth(), controller.createBookingPackage)
BookingRouter.patch("/customer/tracking-number", jwtAuth(), controller.updateBookingTrackingNumberByCustomer);

// admin Update Booking Status
BookingRouter.patch("/admin/status/:id", jwtAuth(), controller.updateBookingApprovedRejectByAdmin);

BookingRouter.get("/pagination", jwtAuth(), controller.getAllBookingByFilterWithPagination);
BookingRouter.get("/admin/pagination", jwtAuth(), controller.getAllBookingForAdminByFilterWithPagination);

BookingRouter.route("/:id")
  .get(jwtAuth(), controller.getSingleBooking)
  .put(jwtAuth(), controller.updateBooking)
  .delete(jwtAuth(), controller.deleteBooking);

export default BookingRouter;
