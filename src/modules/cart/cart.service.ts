import { NotFoundError } from '../../utils/errors';
import { BaseService } from '../base/base.service';
import productRepository from '../product/product.repository';
import cartRepository from './cart.repository';
import { PrismaClient } from '@prisma/client';
// ProductService 
import ProductService from '../product/product.service';

const prisma = new PrismaClient();

export class CartService extends BaseService<typeof cartRepository> {
  private repository:
  typeof cartRepository;
  constructor(repository: typeof cartRepository) {
    super(repository);
    this.repository = repository;
  }

  createCartItem = async (payload: any, tx: any) => {
    const items = Array.isArray(payload) ? payload : [payload];
    console.log("Creating cart items with payload: ", items);

    if (!items || items.length === 0) return [];

    const first = items[0];
    const userId = first.user ?? first.userId ?? first.userRef ?? null;
    const productId = first.product1688Id ?? first.productLocalId ?? first.productAlibabaId ?? null;

    const productPayload = {
      productId: productId,
    };

   const product = await ProductService.get1688ProductDetails(productPayload);

    if (!userId) {
      throw new Error('Missing user id in cart payload');
    }

    // compute totals
    let totalPrice = 0;
    let totalWeight = 0;

    for (const it of items) {
      const qty = Number(it.quantity ?? 1) || 1;
      const price = (() => {
        if (it.skuId && product?.saleInfo?.priceRangeList) {
          const totalQuantity = items.reduce((sum, item) => sum + (item.quantity ?? 1), 0);
          const priceRange = product.saleInfo.priceRangeList
            .filter((range: any) => totalQuantity >= range.startQuantity)
            .sort((a: any, b: any) => b.startQuantity - a.startQuantity)[0];
          if (priceRange?.price != null) return Number(priceRange.price);
        }
        return it.skuId ? (product?.productSkuInfos_Variant?.find((v: any) => v.skuId === it.skuId)?.consignPrice ?? (it.price != null ? Number(it.price) : undefined)) : (it.price != null ? Number(it.price) : undefined);
      })();
      const weight = (() => {
        try {
          // Check if skuShippingDetails exists for the specific skuId
          const skuShippingDetails = (product as any)?.shippingInfo?.skuShippingDetails;
          if (skuShippingDetails && Array.isArray(skuShippingDetails)) {
            const skuDetail = skuShippingDetails.find((s: any) => String(s.skuId) === String(it.skuId));
            if (skuDetail?.weight != null) return Number(skuDetail.weight);
          }

          // Fallback to shippingInfo.weight for all items
          if ((product as any)?.shippingInfo?.weight != null) {
            return Number((product as any).shippingInfo.weight);
          }
        } catch (e) {
          // Handle any unexpected errors
        }
        return 0; // Default weight if nothing is found
      })();

      totalPrice += price * qty;
      totalWeight += weight * qty;
    }

    console.log(`Total Price: ${totalPrice}, Total Weight: ${totalWeight}`);


    // create cart
    const cartPaylod = {
      userId: Number(userId),
      totalPrice: totalPrice || undefined,
      totalWeight: totalWeight || undefined,
      currency: 'Dollar',
      status: 'active',
    };
    const cart = await this.repository.createCart(cartPaylod, tx);
    console.log("Created Cart: ", cart);

    const createdProducts: any[] = [];

    for (const it of items) {
      const qty = Number(it.quantity) || 0;
      const price = (() => {
        if (it.skuId && product?.saleInfo?.priceRangeList) {
          const totalQuantity = items.reduce((sum, item) => sum + (item.quantity ?? 1), 0);
          const priceRange = product.saleInfo.priceRangeList
            .filter((range: any) => totalQuantity >= range.startQuantity)
            .sort((a: any, b: any) => b.startQuantity - a.startQuantity)[0];
          if (priceRange?.price != null) return Number(priceRange.price);
        }
        return it.skuId ? (product?.variants?.find((v: any) => v.skuId === it.skuId)?.consignPrice ?? (it.price != null ? Number(it.price) : undefined)) : (it.price != null ? Number(it.price) : undefined);
      })();
      const weight = (() => {
        try {
          // Check if skuShippingDetails exists for the specific skuId
          const skuShippingDetails = (product as any)?.shippingInfo?.skuShippingDetails;
          if (skuShippingDetails && Array.isArray(skuShippingDetails)) {
            const skuDetail = skuShippingDetails.find((s: any) => String(s.skuId) === String(it.skuId));
            if (skuDetail?.weight != null) return Number(skuDetail.weight);
          }

          // Fallback to shippingInfo.weight for all items
          if ((product as any)?.shippingInfo?.weight != null) {
            return Number((product as any).shippingInfo.weight);
          }
        } catch (e) {
          // Handle any unexpected errors
        }
        return 0; // Default weight if nothing is found
      })();

      const cartProductPayload = {
        product1688Id: it.product1688Id != null ? String(it.product1688Id) : undefined,
        productLocalId: it.productLocalId != null ? Number(it.productLocalId) : undefined,
        productAlibabaId: it.productAlibabaId != null ? String(it.productAlibabaId) : undefined,
        cartId: cart.id,
        quantity: qty,
        totalPrice: (price != null && Number.isFinite(Number(price)) ? Number(price) * qty : 0),
        totalWeight: (weight ?? 0) * qty,
        mainSkuImageUrl: product.images && product.images.length > 0 ? product.images[0] : null,
      };
      console.log("Creating Cart Product with payload -------- ", cartProductPayload);
      const cartProduct = await this.repository.createCartProduct(cartProductPayload, tx);
      console.log("Created Cart Product: ", cartProduct);

      const variantPayload = {
        cartProductId: cartProduct.id,
        skuId: it.skuId != null ? String(it.skuId) : undefined,
        specId: it.specId != null ? String(it.specId) : undefined,
        quantity: qty,
        attributeName: (() => {
          try {
            const sku = product?.productSkuInfos_Variant?.find((s: any) => Number(s.skuId) === Number(it.skuId));
            const attrs = sku?.skuAttributes ?? [];
            if (!attrs || attrs.length === 0) return "";
            const a = attrs[0];
            const name = a.attributeNameTrans || a.attributeName || "";
            const val = a.valueTrans || a.value || "";
            return name && val ? `${name}: ${val}` : (val || name || "");
          } catch (e) {
            return "";
          }
        })(),
        attributeNameSecond: (() => {
          try {
            const sku = product?.productSkuInfos_Variant?.find((s: any) => Number(s.skuId) === Number(it.skuId));
            const attrs = sku?.skuAttributes ?? [];
            if (!attrs || attrs.length < 2) return "";
            const a = attrs[1];
            const name = a.attributeNameTrans || a.attributeName || "";
            const val = a.valueTrans || a.value || "";
            return name && val ? `${name}: ${val}` : (val || name || "");
          } catch (e) {
            return "";
          }
        })(),
        weight: weight,
        dimensions: (() => {
          // return a formatted dimensions string like "30.00 x 20.00 x 10.00 cm" or null
          const fmt = (v: any) => {
            if (v == null || v === '') return null;
            const n = Number(v);
            return Number.isFinite(n) ? n.toFixed(2) : null;
          };

          try {
            const shipList = product?.shippingInfo?.skuShippingInfoList ?? product?.shippingInfo?.skuShippingDetails ?? [];
            const per = Array.isArray(shipList) ? shipList.find((s: any) => Number(s.skuId) === Number(it.skuId)) : undefined;
            if (per && (per.length != null || per.width != null || per.height != null)) {
              const L = fmt(per.length);
              const W = fmt(per.width);
              const H = fmt(per.height);
              if (L || W || H) return `${L ?? '-'} x ${W ?? '-'} x ${H ?? '-'} cm`;
            }

            const skuMeta = product?.productSkuInfos_Variant?.find((s: any) => Number(s.skuId) === Number(it.skuId));
            if (skuMeta && (skuMeta.length != null || skuMeta.width != null || skuMeta.height != null)) {
              const L = fmt(skuMeta.length);
              const W = fmt(skuMeta.width);
              const H = fmt(skuMeta.height);
              if (L || W || H) return `${L ?? '-'} x ${W ?? '-'} x ${H ?? '-'} cm`;
            }

            if (product?.shippingInfo && (product.shippingInfo.length != null || product.shippingInfo.width != null || product.shippingInfo.height != null)) {
              const L = fmt(product.shippingInfo.length);
              const W = fmt(product.shippingInfo.width);
              const H = fmt(product.shippingInfo.height);
              if (L || W || H) return `${L ?? '-'} x ${W ?? '-'} x ${H ?? '-'} cm`;
            }
          } catch (e) {
            // noop
          }
          return null;
        })(),
        price: (() => {
          if (it.skuId) {
            const variant = product?.productSkuInfos_Variant?.find((v: any) => String(v.skuId) === String(it.skuId));
            if (variant?.consignPrice != null) return Number(variant.consignPrice);
          }
          return it.price != null ? Number(it.price) : 0; // Default to 0 if price is undefined
        })(),
        skuImageUrl: (() => {
          try {
            const sku = product?.productSkuInfos_Variant?.find((s: any) => Number(s.skuId) === Number(it.skuId));
            if (!sku) return null;
            // prefer attribute that carries an image url
            const attrImg = sku.skuAttributes?.find((a: any) => a?.skuImageUrl || a?.imageUrl || a?.image);
            if (attrImg?.skuImageUrl) return attrImg.skuImageUrl;
            if (attrImg?.imageUrl) return attrImg.imageUrl;
            if (attrImg?.image) return attrImg.image;
            // try common direct fields on sku
            if (sku.skuImageUrl) return sku.skuImageUrl;
            if (sku.image) return sku.image;
            if (sku.skuImage) return sku.skuImage;
          } catch (e) {
            // ignore
          }
          return null;
        })(),
      };

      const variant = await this.repository.createCartProductVariant(variantPayload, tx);
      console.log("Created Cart Product Variant: ", variant);

      createdProducts.push({ cartProduct, variant });
    }



    // return created cart with products
    const result = await this.repository.findCartItemByUserAndProduct(userId, productId, tx);
    console.log("Final Cart with Products: ", result);

    return result;
  };

  async getUserCartByProductId(userId: string | number, productId: string | number, tx?: any) {
    console.log(`Fetching cart item for userId: ${userId}, productId: ${productId}`);
    const cartItem = await this.repository.findCartItemByUserAndProduct(userId, productId, tx);
    if (!cartItem) {
      throw new NotFoundError('Cart item not found for the given user and product');
    }
    return cartItem;
  }

  getUserAllCart = async (userId: string | number, tx?: any) => {
    console.log(`Fetching all cart items for userId: ${userId}`);
    const cartItems = await this.repository.findAllCartByUser(userId, tx);
    return cartItems;
  }

  delteCartProductTId = async (productTId: number, tx?: any) => {
    console.log(`Deleting cart products with productTId: ${productTId}`);
    const deletedProducts = await this.repository.deleteCartProductByProductTId(productTId, tx);

    if (!deletedProducts || deletedProducts.count === 0) {
        throw new NotFoundError(`No cart products found with productTId: ${productTId}`);
    }

    return deletedProducts;
  }

  delteCartProductVariantByTId = async (variantTId: number, tx?: any) => {
    console.log(`Deleting cart product variant with id: ${variantTId}`);
    const deletedVariant = await this.repository.delteCartProductVariantByTId(variantTId, tx);
    return deletedVariant;
  }


}

export default new CartService(cartRepository);