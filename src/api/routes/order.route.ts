import { Router } from "express";
import controller from "../../modules/order/order.controller";
// import jwtAuth from "../../middleware/auth/jwtAuth";
// import { upload } from "../../middleware/upload/upload";

const OrderRoute = Router();
// OrderRoute.use(jwtAuth());

// OrderRoute.route("/")
//   .post( controller.createOrder)
//   .get(controller.getAllOrder);

// OrderRoute.route("/order-product").get(controller.getOrderProducts);
// OrderRoute.route("/admin").post(controller.createAdminOrder);
// OrderRoute.route("/user/:id").get(controller.getUserAllOrder);
// OrderRoute.route("/track").get(controller.orderTracking);

// OrderRoute.get("/pagination", controller.getOrderWithPagination);
// OrderRoute.get("/incomplete/pagination", controller.getIncompleteOrderWithPagination);

// OrderRoute.route(":id")
//   .get(controller.getSingleOrder)
//   .put(upload.any(), controller.updateOrder)
//   .delete(controller.deleteOrder);

// OrderRoute.put("/status/:id", controller.updateOrderStatus);
// OrderRoute.put("/couriersend/:id", controller.isCourierSending);

export default OrderRoute;
