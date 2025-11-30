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

//   CartRoute.route("/buy-now")
//   .post(controller.createBuyNowCart)
//   .get(controller.getAllBuyNowCartByUser);
//   CartRoute.route("/buy-now/:id")
//   .put( controller.updateBuyNowCartQuantity)

// CartRoute.get("/user-all-cart/:id", controller.getUserAllCartById);
// CartRoute.get("/pagination", controller.getCartWithPagination);

// CartRoute.route("/:id")
//   .get(controller.getSingleCart)
//   .put( controller.updateCartQuantity)
//   .delete(controller.deleteCart);

export default CartRoute;
