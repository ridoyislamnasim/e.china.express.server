import { Router } from "express";
import controller from "../../modules/cart/cart.controller";
// import jwtAuth from "../../middleware/auth/jwtAuth";
import { upload } from "../../middleware/upload/upload";

const CartRoute = Router();
// CartRoute.use(jwtAuth());
// cart
CartRoute.route("/")
  .post(controller.createCart)
  .get(controller.getAllCartByUser);

  CartRoute.route("/buy-now")
  .post(controller.createBuyNowCart)
  .get(controller.getAllBuyNowCartByUser);
  CartRoute.route("/buy-now/:id")
  .put( controller.updateBuyNowCartQuantity)

CartRoute.get("/user-all-cart/:id", controller.getUserAllCartById);
CartRoute.get("/pagination", controller.getCartWithPagination);

CartRoute.route("/:id")
  .get(controller.getSingleCart)
  .put( controller.updateCartQuantity)
  .delete(controller.deleteCart);

export default CartRoute;
