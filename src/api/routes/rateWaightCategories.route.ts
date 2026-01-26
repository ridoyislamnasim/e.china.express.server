import { Router } from "express";
// import controller from "../../modules/order/order.controller";
import controller from "../../modules/rateWeightCategories/rateWeightCategories.controller";

// import jwtAuth from "../../middleware/auth/jwtAuth";
// import { upload } from "../../middleware/upload/upload";

const rateWeightCategoriesRoute = Router();
// OrderRoute.use(jwtAuth());

rateWeightCategoriesRoute.route("/")
    .post(controller.createRateWeightCategories)
    .get(controller.getAllRateWeightCategories);

rateWeightCategoriesRoute.get("/pagination", controller.getRateWeightCategoriesWithPagination);

rateWeightCategoriesRoute.route("/:id")
    // .get(controller.getSingleOrder)
    .put( controller.updateRateWeightCategories)
    .delete(controller.deleteRateWeightCategories);


export default rateWeightCategoriesRoute;
