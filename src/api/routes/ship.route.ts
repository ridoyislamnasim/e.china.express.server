import { Router } from "express";
// import controller from "../../modules/order/order.controller";
import controller from "../../modules/ship/ship.controller";

// import jwtAuth from "../../middleware/auth/jwtAuth";
// import { upload } from "../../middleware/upload/upload";

const shipRouter = Router();
// OrderRoute.use(jwtAuth());

shipRouter.route("/")
    .post(controller.createShip)
    .get(controller.getAllShips);

shipRouter.get("/pagination", controller.getShipWithPagination);

shipRouter.route("/:id")
    .patch( controller.updateShip)
    .get(controller.getSingleShip)
    .delete(controller.deleteShip);

export default shipRouter;
