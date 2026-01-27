import { Router } from "express";
// import controller from "../../modules/order/order.controller";
import controller from "../../modules/shipSchedule/ship.schedule.controller";

// import jwtAuth from "../../middleware/auth/jwtAuth";
// import { upload } from "../../middleware/upload/upload";

const shipScheduleRouter = Router();
// OrderRoute.use(jwtAuth());

shipScheduleRouter.route("/")
    .post(controller.createShipSchedule)
    .get(controller.getAllShipSchedules);

shipScheduleRouter.get("/pagination", controller.getShipScheduleWithPagination);

shipScheduleRouter.route("/:id")
    .patch( controller.updateShipSchedule)
    .get(controller.getSingleShipSchedule)
    .delete(controller.deleteShipSchedule);

export default shipScheduleRouter;
