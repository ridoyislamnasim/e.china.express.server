// import { Router } from "express";
// import controller from "../../modules/shippingMethod/shipping.method.controller";
// // import jwtAuth from "../../middleware/auth/jwtAuth";
// import { upload } from "../../middleware/upload/upload";

// const ShippingMethodRoute = Router();
// // ShippingMethodRoute.use(jwtAuth());

// ShippingMethodRoute.route("/")
//   .post(upload.any(), controller.createShippingMethod)
//   .get(controller.getAllShippingMethod);

// ShippingMethodRoute.get("/pagination", controller.getShippingMethodWithPagination);

// ShippingMethodRoute.route(":id")
//   .get(controller.getSingleShippingMethod)
//   .put(upload.any(), controller.updateShippingMethod)
//   .delete(controller.deleteShippingMethod);

// ShippingMethodRoute.put("/status/:id", controller.updateShippingMethodStatus);

// export default ShippingMethodRoute;
