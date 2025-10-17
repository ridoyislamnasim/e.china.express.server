import { Request, Response, NextFunction } from 'express';
import catchError from '../../middleware/errors/catchError';
import { responseHandler } from '../../utils/responseHandler';
import withTransaction from '../../middleware/transactions/withTransaction';
import CartService from './cart.service';

class CartController {
  // Create a cart item
  createCart = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    const payload = {
      quantity: Number(req.body.quantity) || 1,
      userRef: req.body.userRef,
      productRef: req.body.productRef,
      inventoryRef: Number(req.body.inventoryRef),
    };
    const cartResult = await CartService.createCart(payload);
    const resDoc = responseHandler(
      201,
      'Cart Created successfully',
      cartResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getUserAllCartById = catchError(async (req: Request, res: Response) => {
    const userId = req.params.id;
    const cartResult = await CartService.getUserAllCartById(userId);
    const resDoc = responseHandler(200, 'Get All Carts', cartResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  // Get all cart items by user with calculation
  getAllCartByUser = catchError(async (req: Request, res: Response) => {
    console.log('Fetching all carts for user...', req.params);
    console.log('Fetching all carts for user...', req.query);
    const { userRef, coupon, productRef, inventoryRef } = req.query;
    const payload: any = { userRef, productRef, inventoryRef };
    if (coupon) {
      payload.coupon = coupon;
    }
    const cartResult = await CartService.getAllCartByUser(payload);
    const resDoc = responseHandler(
      200,
      ` ${cartResult?.message} `,
      cartResult?.data
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getCartWithPagination = catchError(async (req: Request, res: Response) => {
    const userId = req.query.userId as string;
    const payload = {
      userId,
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      order: req.query.order,
    };
    const cart = await CartService.getCartWithPagination(payload);
    const resDoc = responseHandler(200, 'Carts get successfully', cart);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSingleCart = catchError(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const cartResult = await CartService.getSingleCart(id);
    const resDoc = responseHandler(201, 'Single Cart successfully', cartResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateCart = catchError(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const payload = {
      quantity: req.body.quantity,
      userRef: req.body.userRef,
      productRef: req.body.productRef,
      inventoryRef: req.body.inventoryRef,
    };
    await CartService.updateCart(id, payload);
    const resDoc = responseHandler(201, 'Cart Update successfully');
    res.status(resDoc.statusCode).json(resDoc);
  });

  // Update cart quanity with calculation
  updateCartQuantity = catchError(async (req: Request, res: Response) => {
    console.log("Updating cart quantity...", req.params, req.query, req.body);
    try {
      const cartId = Number(req.params.id);
      const { increment, decrement, update } = req.query;
      let newQuantity;
      // Fetch the current cart item
      const currentCart = await CartService.getSingleCart(cartId);
      console.log("Current cart item:", currentCart);
      if (!currentCart) {
        return res.status(404).json({
          success: false,
          message: 'Cart not found',
        });
      }
      if (increment === 'true') {
        // Increment quantity
        newQuantity = currentCart.quantity + 1;
      } else if (decrement === 'true') {
        // Decrement quantity, ensuring it doesn't drop below 1
        newQuantity = Math.max(1, currentCart.quantity - 1);
      } else if (update === 'true') {
        // Update with a specific value from body
        const { quantity } = req.body;
        if (!quantity || quantity < 1) {
          return res.status(400).json({
            success: false,
            message: 'Invalid quantity provided',
          });
        }
        newQuantity = Number(quantity);
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid operation, specify increment, decrement, or update',
        });
      }
      // Update the cart quantity in the database
      const updatedCart = await CartService.updateCartQuantity(
        Number(cartId),
        newQuantity
      );
      return res.status(200).json({
        success: true,
        data: updatedCart,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });

  // Delete a cart item
  deleteCart = catchError(async (req: Request, res: Response) => {
    const id = req.params.id;
    await CartService.deleteCart(id);
    const resDoc = responseHandler(200, 'Cart Deleted successfully');
    res.status(resDoc.statusCode).json(resDoc);
  });


  // Buy Now Cart
  createBuyNowCart = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    const payload = {
      quantity: Number(req.body.quantity) || 1,
      userRef: req.body.userRef,
      productRef: req.body.productRef,
      inventoryRef: Number(req.body.inventoryRef),
    };
    const cartResult = await CartService.createBuyNowCart(payload);
    const resDoc = responseHandler(
      201,
      'Cart Created successfully',
      cartResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllBuyNowCartByUser = catchError(async (req: Request, res: Response) => {
    console.log('Fetching all carts for user...', req.params);
    console.log('Fetching all carts for user...', req.query);
    const { userRef, coupon, productRef, inventoryRef } = req.query;
    const payload: any = { userRef, productRef, inventoryRef };
    if (coupon) {
      payload.coupon = coupon;
    }
    const cartResult = await CartService.getAllBuyNowCartByUser(payload);
    const resDoc = responseHandler(
      200,
      ` ${cartResult?.message} `,
      cartResult?.data
    );
    res.status(resDoc.statusCode).json(resDoc);
  });
  // Update cart quanity with calculation
  updateBuyNowCartQuantity = catchError(async (req: Request, res: Response) => {
    console.log("Updating cart quantity...", req.params, req.query, req.body);
    try {
      const cartId = Number(req.params.id);
      const { increment, decrement, update } = req.query;
      let newQuantity = 0;
      // Fetch the current cart item
      const currentCart = await CartService.getSingleBuyNowCart(cartId);
      console.log("Current cart item:", currentCart);
      if (!currentCart) {
        return res.status(404).json({
          success: false,
          message: 'Cart not found',
        });
      }
      if (increment === 'true') {
        // Increment quantity
        newQuantity = (currentCart.quantity ?? 0) + 1;
      } else if (decrement === 'true') {
        // Decrement quantity, ensuring it doesn't drop below 1
        newQuantity = Math.max(1, (currentCart.quantity ?? 0) - 1);
      } else if (update === 'true') {
        // Update with a specific value from body
        const { quantity } = req.body;
        if (!quantity || quantity < 1) {
          return res.status(400).json({
            success: false,
            message: 'Invalid quantity provided',
          });
        }
        newQuantity = Number(quantity);
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid operation, specify increment, decrement, or update',
        });
      }
      // Update the cart quantity in the database
      const updatedCart = await CartService.updateBuyNowCartQuantity(
        Number(cartId),
        newQuantity
      );
      return res.status(200).json({
        success: true,
        data: updatedCart,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });
}

export default new CartController();
