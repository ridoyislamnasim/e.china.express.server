import { Router } from "express";
import controller from "../../modules/shoppingOrder/shopping.order.controller";
import jwtAuth from "../../middleware/auth/jwtAuth";
import { upload } from "../../middleware/upload/upload";
// import jwtAuth from "../../middleware/auth/jwtAuth";
// import { upload } from "../../middleware/upload/upload";

const ShoppingOrderRoute = Router();
// ShoppingOrderRoute.use(jwtAuth());

ShoppingOrderRoute.route("/")
  .post( jwtAuth(), controller.createShoppingOrder)
//   .get(controller.getAllOrder);


// /admin/discount-calculation/:id
ShoppingOrderRoute.post("/admin/discount-calculation/:id", jwtAuth(), controller.calculateDiscountForAdminShoppingDecision);
ShoppingOrderRoute.patch("/admin/status/:id", jwtAuth(), controller.updateShoppingOrderStatusApproveRejectByAdmin);
// ShoppingOrderRoute.get("/admin/pagination", jwtAuth(), controller.getAllShoppingOrderForAdminByFilterWithPagination);

ShoppingOrderRoute.get("/pagination", jwtAuth(), controller.getShoppingOrderWithPagination);
ShoppingOrderRoute.get("/admin/pagination",jwtAuth(), controller.getAllShoppingOrdersWithPaginationForAdmin);
// SourcingPurchasing
ShoppingOrderRoute.post("/admin/purchasing", jwtAuth(),upload, controller.createPurchaseForShoppingOrderByAdmin);
ShoppingOrderRoute.patch("/sourcing-purchasing/:id", jwtAuth(), controller.updateShoppingOrderStatusSourcingPurchasingByAdmin);

export default ShoppingOrderRoute;
