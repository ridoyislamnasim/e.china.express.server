import { Router } from "express";
import controller from "../../modules/expressBooking/express.booking.controller";
import { upload } from "../../middleware/upload/upload";
import jwtAuth from "../../middleware/auth/jwtAuth";

const ExpressBookingRouter = Router();
// ExpressBookingRouter.use(jwtAuth());

ExpressBookingRouter.route("/")
  .post(upload, jwtAuth(), controller.createExpressBooking)
  // .get(jwtAuth(), controller.getAllExpressBookingByFilterWithPagination);

ExpressBookingRouter.get("/pagination", jwtAuth(), controller.getAllExpressBookingByFilterWithPagination);

ExpressBookingRouter.route("/:id")
  .get(jwtAuth(), controller.getSingleExpressBooking)
  .put(jwtAuth(), controller.updateExpressBooking)
  .delete(jwtAuth(), controller.deleteExpressBooking);

export default ExpressBookingRouter;
