import { Router } from "express";
import controller from "../../modules/cart/cart.controller";
// import jwtAuth from "../../middleware/auth/jwtAuth";
import { upload } from "../../middleware/upload/upload";
import jwtAuth from "../../middleware/auth/jwtAuth";
const CartRoute = Router();
CartRoute.use(jwtAuth());
// cart
CartRoute.route("/")
  .post(controller.createCartItem)
//   .get(controller.getAllCartByUser);
CartRoute.get("/user-cart/product/:id", jwtAuth(), controller.getUserCartByProductId);
CartRoute.get("/user-cart", jwtAuth(), controller.getUserAllCart);
// /cart/product/:productId
CartRoute.delete("/product/:productTId", jwtAuth(), controller.delteCartProductTId);
CartRoute.delete("/variant/:variantTId", jwtAuth(), controller.delteCartProductVariantByTId);

export default CartRoute;
