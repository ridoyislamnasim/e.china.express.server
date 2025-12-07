import { Request, Response, NextFunction } from 'express';
import catchError from '../../middleware/errors/catchError';
import { responseHandler } from '../../utils/responseHandler';
import withTransaction from '../../middleware/transactions/withTransaction';
import CartService from './cart.service';
import { cartItemSchema, cartSchema } from './cart.Zschema';



class CartController {
  // Create a cart item
  createCartItem = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    // Zschema validation can be added here if needed
    console.log("Request Body: ", req.body);
    const payload = cartSchema.parse(req.body);
    // attach authenticated user id to payload items safely
    const userRef = req.user?.user_info_encrypted?.id?.toString() ?? null;
    if (Array.isArray(payload)) {
      // payload is an array of items - add userRef to each
      (payload as any[]).forEach((p) => {
        (p as any).userRef = userRef;
      });
    } else {
      // single object payload
      (payload as any).userRef = userRef;
    }

    // এখন payload safe
    console.log("Validated Payload: ", payload);

    const cartServiceResult = await CartService.createCartItem(payload, tx);
    const resDoc = responseHandler(200, "Cart created", cartServiceResult);
    res.status(resDoc.statusCode).json(resDoc);


  })


  getUserCartByProductId = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const userRef = req.user?.user_info_encrypted?.id?.toString() ?? null;
    const productId = req.params.id;
    const cartServiceResult = await CartService.getUserCartByProductId(userRef, Number(productId));
    const resDoc = responseHandler(200, "User cart fetched", cartServiceResult);
    res.status(resDoc.statusCode).json(resDoc);
  }
  )

  getUserAllCart = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const userRef = req.user?.user_info_encrypted?.id?.toString() ?? null;
    const cartServiceResult = await CartService.getUserAllCart(userRef);
    const resDoc = responseHandler(200, "User all cart fetched", cartServiceResult);
    res.status(resDoc.statusCode).json(resDoc);
  }
  )

  deleteCartById = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const cartId = req.params.cartId;
    const cartServiceResult = await CartService.deleteCartById(Number(cartId));
    const resDoc = responseHandler(200, "Cart deleted", cartServiceResult);
    res.status(resDoc.statusCode).json(resDoc);
  })

  delteCartProductTId = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const productTId = req.params.productTId;
    const cartServiceResult = await CartService.delteCartProductTId(Number(productTId));
    const resDoc = responseHandler(200, "Cart product deleted", cartServiceResult);
    res.status(resDoc.statusCode).json(resDoc);
  })

  delteCartProductVariantByTId = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const variantTId = req.params.variantTId;
    const cartServiceResult = await CartService.delteCartProductVariantByTId(Number(variantTId));
    const resDoc = responseHandler(200, "Cart product variant deleted", cartServiceResult);
    res.status(resDoc.statusCode).json(resDoc);
  }
  )

}

export default new CartController();
