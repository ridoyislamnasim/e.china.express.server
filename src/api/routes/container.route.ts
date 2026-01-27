import { Router } from "express";
// import controller from "../../modules/order/order.controller";
import controller from "../../modules/container/container.controller";

// import jwtAuth from "../../middleware/auth/jwtAuth";
// import { upload } from "../../middleware/upload/upload";

const containerRouter = Router();
// OrderRoute.use(jwtAuth());

containerRouter.route("/")
    .post(controller.createContainer)
    .get(controller.getAllContainers);

containerRouter.get("/pagination", controller.getContainerWithPagination);

containerRouter.route("/:id")
    .patch( controller.updateContainer)
    .get(controller.getSingleContainer)
    .delete(controller.deleteContainer);

export default containerRouter;
