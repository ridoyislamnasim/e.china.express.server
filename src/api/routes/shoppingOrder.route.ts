import { Router } from "express";
import controller from "../../modules/shoppingOrder/shopping.order.controller";
import jwtAuth from "../../middleware/auth/jwtAuth";
// import jwtAuth from "../../middleware/auth/jwtAuth";
// import { upload } from "../../middleware/upload/upload";

const ShoppingOrderRoute = Router();
// ShoppingOrderRoute.use(jwtAuth());

ShoppingOrderRoute.route("/")
  .post( jwtAuth(), controller.createShoppingOrder)
//   .get(controller.getAllOrder);

// ShoppingOrderRoute.route("/order-product").get(controller.getOrderProducts);
// ShoppingOrderRoute.route("/admin").post(controller.createAdminOrder);
// ShoppingOrderRoute.route("/user/:id").get(controller.getUserAllOrder);
// ShoppingOrderRoute.route("/track").get(controller.orderTracking);

// ShoppingOrderRoute.get("/pagination", controller.getOrderWithPagination);
// ShoppingOrderRoute.get("/incomplete/pagination", controller.getIncompleteOrderWithPagination);

// ShoppingOrderRoute.route(":id")
//   .get(controller.getSingleOrder)
//   .put(upload.any(), controller.updateOrder)
//   .delete(controller.deleteOrder);

// ShoppingOrderRoute.put("/status/:id", controller.updateOrderStatus);
// ShoppingOrderRoute.put("/couriersend/:id", controller.isCourierSending);

export default ShoppingOrderRoute;
