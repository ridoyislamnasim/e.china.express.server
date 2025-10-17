import { NotFoundError } from '../../utils/errors';
import { BaseService } from '../base/base.service';
import productRepository from '../product/product.repository';
import cartRepository from './cart.repository';

export class CartService extends BaseService<typeof cartRepository> {
  private repository: typeof cartRepository;
  constructor(repository: typeof cartRepository) {
    super(repository);
    this.repository = repository;
  }

  async createCart(payload: any, tx?: any) {
    const { quantity, userRef, productRef, inventoryRef } = payload;
    console.log('Creating cart with query 1:', payload);

    if (!productRef && !inventoryRef) {
      throw new Error('Product  & Inventory  is required');
    }
    const productExists = await productRepository.getSingleProduct(productRef);
    console.log('Product exists:', productExists);
    const query: any = {};
    console.log('Creating cart with query 2:', payload);
const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    .test(payload?.userRef || '');
    // console.log('Creating cart with query 3:', isUUID);
    if (!isUUID) {
      // console.log('Creating cart with query 4:', isUUID);
      query.userRef = Number(userRef);
      query.productRef = productExists?.id;
      query.inventoryRef = inventoryRef;
    } else {
      // console.log('Creating cart with query 5:', isUUID);
      query.correlationId = userRef;
      query.productRef = productExists?.id;
      query.inventoryRef = inventoryRef;
    }
    console.log('Creating cart with query:', query);
    const existingCart = await this.repository.findCartByUserAndProduct(query);
    query.quantity = Number(quantity);
    console.log('Existing cart found:', existingCart);
    let cartData;
    if (existingCart) {
      // Update the existing cart's quantity
      const updatedQuantity = Number(existingCart.quantity) + Number(quantity);
      cartData = await this.repository.updateCartQuantity(
        existingCart.id,
        updatedQuantity
      );
    } else {
      // Create a new cart document
      cartData = await this.repository.createCart(query);
    }
    return cartData;
  }

  async getUserAllCartById(userId: string) {
    return await this.repository.getUserAllCartById(userId);
  }

  async getAllCartByUser(payload: any) {
    return await this.repository.getAllCartByUser(payload);
  }

  async getCartWithPagination(payload: any) {
    const cart = await this.repository.getCartWithPagination(payload);
    return cart;
  }

  async getSingleCart(id: number) {
    const cartData = await this.repository.getSingleCart(id);
    if (!cartData) throw new NotFoundError('Cart Not Find');
    return cartData;
  }

    async getSingleBuyNowCart(id: number) {
    const cartData = await this.repository.getSingleBuyNowCart(id);
    if (!cartData) throw new NotFoundError('Cart Not Find');
    return cartData;
  }

  async updateCart(id: number, payload: any) {
    const cartData = await this.repository.updateCart(id, payload);
    return cartData;
  }

  async updateCartQuantity(cartId: number, newQuantity: number) {
    const updatedCart = await this.repository.updateCartQuantity(
      cartId,
      newQuantity
    );
    if (!updatedCart) {
      throw new Error('Cart not found');
    }
    // Optionally, calculate totals and return them here
    return updatedCart;
  }

  async deleteCart(id: string) {
    const deletedCart = await this.repository.deleteCart(id);
    return deletedCart;
  }

  // Buy now Cart ==========================================
  async createBuyNowCart(payload: any, tx?: any) {
    const { quantity, userRef, productRef, inventoryRef } = payload;
    if (!productRef && !inventoryRef) {
      throw new Error('Product ID & Inventory ID is required');
    }
    console.log("Creating cart with query buy now 1:", payload);
    const productExists = await productRepository.getSingleProduct(productRef);
    console.log('Product exists:', productExists);
    payload.productRef = productExists?.id;
    const query: any = {};
    console.log('Creating cart with query buy now 2:', payload);
const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    .test(payload?.userRef || '');
    console.log('Creating cart with query 3:', isUUID);
    if (!isUUID) {
      console.log('Creating cart with query 4:', isUUID);
      query.userRef = Number(userRef);
      payload.userRef = query.userRef;
      // query.productRef = productRef;
      // query.inventoryRef = inventoryRef;
    } else {
      console.log('Creating cart with query 5:', isUUID);
      query.correlationId = userRef;
      payload.correlationId = query.correlationId;
      delete payload.userRef;
      // query.productRef = productRef;
      // query.inventoryRef = inventoryRef;
    }
    console.log('Creating cart with query:', query);
    const existingCart = await this.repository.findBuyNowCartByUserAndProduct(query);
    console.log('Existing cart found:', existingCart);
    let cartData;
    if (existingCart) {
      // Update the existing cart's quantity
      await this.repository.deleteBuyNowCart(String(existingCart.id));
      // const updatedQuantity = Number(existingCart.quantity) + Number(quantity);
      // cartData = await this.repository.updateCartQuantity(
      //   existingCart.id,
      //   updatedQuantity
      // );
    } 
      // Create a new cart document
      cartData = await this.repository.createBuyNowCart(payload);

    return cartData;
  }

  async getAllBuyNowCartByUser(payload: any) {
    return await this.repository.getAllBuyNowCartByUser(payload);
  }

    async updateBuyNowCartQuantity(cartId: number, newQuantity: number) {
    const updatedCart = await this.repository.updateBuyNowCartQuantity(
      cartId,
      newQuantity
    );
    if (!updatedCart) {
      throw new Error('Cart not found');
    }
    // Optionally, calculate totals and return them here
    return updatedCart;
  }
}

export default new CartService(cartRepository);
