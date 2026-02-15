import { Request, Response, NextFunction } from "express";
import catchError from "../../middleware/errors/catchError";
import { responseHandler } from "../../utils/responseHandler";
import withTransaction from "../../middleware/transactions/withTransaction";
import WishListService from "./wishlist.service";

class WishListController {
  createWishList = withTransaction(
    async (req: Request, res: Response, next: NextFunction, tx: any) => {
      const payload = {
        userRef: req.body.userRef,
        productRef: req.body.productRef,
      };
      const wishListResult = await WishListService.createWishList(payload);
      const resDoc = responseHandler(
        201,
        "WishList Created successfully",
        wishListResult,
      );
      res.status(resDoc.statusCode).json(resDoc);
    },
  );

  getAllWishList = catchError(async (req: Request, res: Response) => {
    const payload = {
      userRef: Number(req.query.userRef),
      productRef: Number(req.query.productRef),
    };
    const wishListResult = await WishListService.getAllWishList(payload);
    const resDoc = responseHandler(200, "Get All WishLists", wishListResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getWishListWithPagination = catchError(
    async (req: Request, res: Response) => {
      console.log("WishList query:", req.query);
      let payload = {
        userRef: Number(req.query.userRef),
        page: Number(req.query.page),
        limit: Number(req.query.limit),
        order: req.query.order,
      };
      console.log("WishList payload:", payload);
      const wishList = await WishListService.getWishListWithPagination(payload);
      const resDoc = responseHandler(
        200,
        "WishLists get successfully",
        wishList,
      );
      res.status(resDoc.statusCode).json(resDoc);
    },
  );

  getSingleWishList = catchError(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const wishListResult = await WishListService.getSingleWishList(id);
    const resDoc = responseHandler(
      201,
      "Single WishList successfully",
      wishListResult,
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  deleteWishList = catchError(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await WishListService.deleteWishList(id);
    const resDoc = responseHandler(200, "WishList Deleted successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });
}

export default new WishListController();
