import { Router } from "express";
// import controller from "../../modules/order/order.controller";
import controller from "../../modules/shipRoute/ship.route.controller";

// import jwtAuth from "../../middleware/auth/jwtAuth";
// import { upload } from "../../middleware/upload/upload";

const shipRouteRouter = Router();
// OrderRoute.use(jwtAuth());

shipRouteRouter.route("/")
    .post(controller.createShipRoute)
    .get(controller.getAllShipRoutes);
    
shipRouteRouter.get("/pagination", controller.getShipRouteWithPagination);

shipRouteRouter.route("/:id")
    .patch( controller.updateShipRoute)
    .get(controller.getSingleShipRoute)
    .delete(controller.deleteShipRoute);

export default shipRouteRouter;
