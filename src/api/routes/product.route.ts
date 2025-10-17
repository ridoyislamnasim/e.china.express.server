import { Router } from "express";
import controller from "../../modules/product/product.controller";
// import jwtAuth from "../../middleware/auth/jwtAuth";
import { upload } from "../../middleware/upload/upload";

const ProductRoute = Router();
// ProductRoute.use(jwtAuth());

ProductRoute.route("/")
  .post(upload.any(), controller.createProduct)
  .get(controller.getAllProduct);

// ProductRoute.get("/search", controller.getSearchProduct);
ProductRoute.get("/shop/option", controller.getShopOption);
ProductRoute.get("/related-product/:slug", controller.getRelatedProduct);
// ProductRoute.get("/view-type", controller.getAllProductForHomePage);
ProductRoute.get("/pagination", controller.getProductWithPagination);
ProductRoute.get("/pagination/admin", controller.getProductWithPaginationForAdmin);
ProductRoute.post("/view-product-count/:slug", controller.getProductViewCount);
// Trending Now
ProductRoute.get("/best-sell", controller.getAllBestSellProduct);
ProductRoute.get("/discounted-product", controller.getAllDiscountedProduct);
ProductRoute.get("/coming-soon", controller.getComingSoonProductWithPagination);
ProductRoute.get("/new-arrivals", controller.getNewArrivalsProductWithPagination);
ProductRoute.get("/trending", controller.getTrendingProductsWithPagination);

ProductRoute.route("/:slug")
  .get(controller.getSingleProduct)
  .put(upload.any(), controller.updateProduct)
  .delete(controller.deleteProduct);

export default ProductRoute;
