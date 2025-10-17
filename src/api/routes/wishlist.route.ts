import { Router } from "express";
import controller from "../../modules/wishlist/wishlist.controller";
// import jwtAuth from "../../middleware/auth/jwtAuth";
import { upload } from "../../middleware/upload/upload";

const WishlistRoute = Router();
// WishlistRoute.use(jwtAuth());

WishlistRoute.route("/")
  .post( controller.createWishList)
  .get(controller.getAllWishList);

WishlistRoute.get("/pagination", controller.getWishListWithPagination);

WishlistRoute.route("/:id")
  .get(controller.getSingleWishList)
  .delete(controller.deleteWishList);

export default WishlistRoute;
