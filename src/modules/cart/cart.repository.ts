import { PrismaClient, Cart, CartProduct, CartProductVariant } from '@prisma/client';
import { pagination } from '../../utils/pagination';
import { BaseRepository } from '../base/base.repository';
import { NotFoundError } from '../../utils/errors';
import { ProductShippingPayload, TCart, TCartProduct, TCartProductVariant, TSaleInfo } from '../../types/cart';

export class CartRepository extends BaseRepository<Cart> {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    super(prisma.cart);
    this.prisma = prisma;
  }


  // ------------------------------------------- common methods  ----------------------------
  async findConfirmVariantsByTCartProductId(cartProductId: number, tx?: any) {
    const client = tx || this.prisma;
    return await client.cartProduct.findMany({
      where: {
        id: cartProductId,
        confirm: true
      },
      include: {
        variants: true,
        productShipping: {
          include: {
            rate: true,
            fromCountry: true,
            toCountry: true,
            shippingMethod: true
          }
        }

      },
    });
  }

  // ------------------------------------------ common methods End ----------------------------

  async createCart(payload: TCart, tx?: any) {
    const client = tx || this.prisma;

    // try to find existing active cart for the user
    const existing = await client.cart.findFirst({ where: { userId: Number(payload.userId) } });
    if (existing) {
      // update existing cart with provided fields (totals, status, currency)
      return await client.cart.update({
        where: { id: existing.id }, data: {
          totalPrice: payload.totalPrice ?? existing.totalPrice,
          totalWeight: payload.totalWeight ?? existing.totalWeight,
          currency: payload.currency ?? existing.currency,
          status: payload.status ?? existing.status,
        }
      });
    } else {
      // create new cart when no existing cart found
      return await client.cart.create({ data: payload as any });
    }
  }

  async createCartProduct(payload: TCartProduct, saleInfo?: TSaleInfo, tx?: any) {
    const client = tx || this.prisma;
    console.log("Creating Cart Product with payload: ", payload);
    // try to find existing cartProduct for same cart and same product id (any of the id fields)
    const whereClauses: any[] = [];
    if (payload.product1688Id != null) whereClauses.push({ product1688Id: String(payload.product1688Id) });
    if (payload.productLocalId != null) whereClauses.push({ productLocalId: Number(payload.productLocalId) });
    if (payload.productAlibabaId != null) whereClauses.push({ productAlibabaId: String(payload.productAlibabaId) });

    const existing = whereClauses.length > 0
      ? await client.cartProduct.findFirst({ where: { cartId: payload.cartId, OR: whereClauses } })
      : null;

    if (existing) {
      // update existing: sum quantities and totals
      const newQuantity = (payload.quantity ?? 0);
      const newTotalPrice = (payload.totalPrice ?? 0);
      const newTotalWeight = (payload.totalWeight ?? 0);
      console.log("Updating existing Cart Product ID:", existing.id, "New Quantity:", newQuantity, "New Total Price:", newTotalPrice, "New Total Weight:", newTotalWeight);
      return await client.cartProduct.update({
        where: { id: existing.id },
        data: {
          quantity: newQuantity,
          totalPrice: newTotalPrice,
          totalWeight: newTotalWeight,
          mainSkuImageUrl: payload.mainSkuImageUrl ?? existing.mainSkuImageUrl,
          calculatedPrice: existing.calculatedPrice,
        },
      });
    }

    // no existing product -> create new
    const cartProductCreate = await client.cartProduct.create({ data: payload as any });
    if (cartProductCreate) {
      // than create CartProductPriceRange entries if priceRanges provided
      if (saleInfo && Array.isArray(saleInfo.priceRangeList)) {
        for (const pr of saleInfo.priceRangeList) {
          await client.cartProductPriceRange.create({
            data: {
              cartProductId: cartProductCreate.id,
              startQuantity: pr.startQuantity,
              price: pr.price,
            }
          });
        }
      }
    }
    return cartProductCreate;


  }


  async createCartProductVariant(payload: TCartProductVariant, tx?: any) {
    console.log("Creating Cart Product Variant with payload: ", payload);
    const client = tx || this.prisma;

    // require cartProductId to match existing variant
    if (payload.skuId == null && payload.specId == null) {
      // find exiting variant by cartProductId only
      const existing = await client.cartProductVariant.findFirst({ where: { cartProductId: payload.cartProductId } });
      console.log("Existing variant found by cartProductId only:", existing, payload.quantity);
      if (payload.quantity == 0) {
        console.log("Deleting existing variant ID -0 :", existing?.id);
        await client.cartProductVariant.delete({ where: { id: existing.id } });
        return [];
      }

      if (existing) {
        const newQuantity = (payload.quantity ?? 0);
        const newPrice = (payload.price ?? 0);
        const newWeight = (payload.weight ?? 0);
        return await client.cartProductVariant.update({
          where: { id: existing.id },
          data: {
            quantity: newQuantity,
            price: newPrice,
            weight: newWeight,
            attributeName: payload.attributeName ?? existing.attributeName,
            attributeNameSecond: payload.attributeNameSecond ?? existing.attributeNameSecond,
            dimensions: payload.dimensions ?? existing.dimensions,
            skuImageUrl: payload.skuImageUrl ?? existing.skuImageUrl,
          },
        });
      }
      // create directly if no parent id provided
      console.log("Deleting existing variant ID 0:", existing?.id);
      return await client.cartProductVariant.create({ data: payload as any });

    }

    const whereClauses: any[] = [];
    if (payload.skuId != null) whereClauses.push({ skuId: String(payload.skuId) });
    if (payload.specId != null) whereClauses.push({ specId: String(payload.specId) });

    const existing = whereClauses.length > 0
      ? await client.cartProductVariant.findFirst({ where: { cartProductId: payload.cartProductId, OR: whereClauses } })
      : null;

    console.log("Existing variant found by SKU/Spec:", existing, payload.quantity, whereClauses);

    if (existing) {
      console.log("Existing variant found by cartProductId only:", existing, payload.quantity);
      if (payload.quantity == 0) {
        console.log("Deleting existing variant ID 1:", existing?.id);
        await client.cartProductVariant.delete({ where: { id: existing.id } });
        return [];
      }
      console.log("Deleting existing variant ID 2:", existing?.id);

      const newQuantity = (payload.quantity ?? 0);
      const newPrice = (payload.price ?? 0);
      const newWeight = (payload.weight ?? 0);
      return await client.cartProductVariant.update({
        where: { id: existing.id },
        data: {
          quantity: newQuantity,
          price: newPrice,
          weight: newWeight,
          attributeName: payload.attributeName ?? existing.attributeName,
          attributeNameSecond: payload.attributeNameSecond ?? existing.attributeNameSecond,
          dimensions: payload.dimensions ?? existing.dimensions,
          skuImageUrl: payload.skuImageUrl ?? existing.skuImageUrl,
        },
      });
    }

    if (payload.quantity == 0) {
      console.log("Deleting existing variant ID 1:", existing?.id);
      await client.cartProductVariant.delete({ where: { id: existing.id } });
      return [];
    }

    return await client.cartProductVariant.create({ data: payload as any });
  }


  async findCartItemByUserAndProduct(userId: string | number, productId: string | number, tx?: any) {
    const client = tx || this.prisma;

    const pidStr = String(productId);

    // filter বানানো
    const productFilter = {
      OR: [
        { product1688Id: pidStr },
        // { productLocalId: pidStr },
        { productAlibabaId: pidStr },
      ],
    };

    const cart = await client.cart.findFirst({
      where: {
        userId: Number(userId),
        products: {
          some: productFilter,
        },
      },
      include: {
        products: {
          where: productFilter,
          include: {
            variants: {
              select: {
                id: true,
                cartProductId: true,
                skuId: true,
                specId: true,
                quantity: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      throw new NotFoundError('Cart not found for the user');
    }
    return cart?.products[0]?.variants;
  }

  async findCartItemByUserAndProductForRate(userId: string | number, productId: string | number, tx?: any) {
    const client = tx || this.prisma;

    const pidStr = String(productId);

    // filter বানানো
    const productFilter = {
      OR: [
        { product1688Id: pidStr },
        // { productLocalId: pidStr },
        { productAlibabaId: pidStr },
      ],
    };

    const cart = await client.cart.findFirst({
      where: {
        userId: Number(userId),
        products: {
          some: productFilter,
        },
      },
      include: {
        products: {
          where: productFilter,
          include: {
            variants: {
              select: {
                id: true,
                cartProductId: true,
                skuId: true,
                specId: true,
                quantity: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      throw new NotFoundError('Cart not found for the user');
    }
    // return cart?.products[0]?.variants;
    return cart;
  }

  async createCartProductShipping(payload: any, tx?: any) {
    console.log("Creating/Updating Cart Product Shipping with payload: ", payload);
    const { userId, cartProductId } = payload;
    const client = tx || this.prisma;

    if (payload.shippingMethodId) {
      console.log("Validating shipping method ID: ", payload.shippingMethodId);
      const method = await client.rateShippingMethod.findUnique({
        where: { id: Number(payload.shippingMethodId) }
      });
      console.log("Shipping method found: ", method);

      if (!method) {
        throw new Error(
          `Shipping method ${payload.shippingMethodId} not found`
        );
      }
    }
    console.log("Shipping method ID validated: ", payload.shippingMethodId);

    // Check if a CartProductShipping entry already exists for the given userId and cartProductId
    const existing = await client.cartProductShipping.findFirst({
      where: {
        userId: Number(userId),
        cartProductId: Number(cartProductId),
      },
    });
    console.log("Existing CartProductShipping entry: ", existing);
    if (existing) {
      // Update the existing ProductShipping entry
      console.log("Updating existing ProductShipping entry:", existing.id);
      return await client.cartProductShipping.update({
        where: { id: existing.id },
        data: payload,
      });
    }

    // Create a new ProductShipping entry if none exists
    console.log("Creating new ProductShipping entry with payload:", payload);
    return await client.cartProductShipping.create({ data: payload });
  }

  async updateCartProductShipping(id: number, cartProductShippingPayload: ProductShippingPayload, tx?: any) {
    const client = tx || this.prisma;

    return await client.cartProductShipping.update({
      where: {
        id: Number(id),
      },
      data: cartProductShippingPayload,
    });
  }


  async updateCartProductShippingConfirm(cartProductId: string | number, tx?: any) {
    const client = tx || this.prisma;

    return await client.cartProduct.updateMany({
      where: {
        id: Number(cartProductId),
      },
      data: {
        confirm: true,
      },
    });
  }

  async findAllCartByUser(userId: string | number, tx?: any) {
    const client = tx || this.prisma;
    const carts = await client.cart.findMany({
      where: { userId: Number(userId) },
      include: {
        products: {
          where: { confirm: true },
          // include: {
          //   variants: true,
          //    productShipping: {
          //     productShipping:true
          //   },
          //   // productShipping: true,
          //   // cartProductShipping: true,

          // },
          include: {
            variants: true,
            priceRanges: true,
            productShipping: {
              include: {
                rate: true,
                fromCountry: true,
                toCountry: true,
                shippingMethod: true
                // country: true,
                // productShipping: true,
              }
            }
          },
        },
      },
    });
    return carts;
  }

  async findCheckoutCartByUser(userId: string | number, products: any, tx?: any) {
    //  products: [{ productId: 9, variantIds: [ 10 ] },
    //   { productId: 10, variantIds: [ 11 ] }
    // ]


    // Normalize inputs and build typed lists for Prisma
    // product IDs for 1688/Alibaba fields are strings in the DB, local product IDs are numbers
    const productIdList: string[] = Array.isArray(products) ? products.map((p: any) => String(p.productId)) : [];
    const productLocalIdList: number[] = Array.isArray(products)
      ? products.map((p: any) => (p.productLocalId != null ? Number(p.productLocalId) : null)).filter((n: number | null): n is number => n !== null)
      : [];
    const variantIdList: number[] = Array.isArray(products)
      ? products.flatMap((p: any) => (Array.isArray(p.variantIds) ? p.variantIds.map((v: any) => Number(v)).filter((n: any) => !Number.isNaN(n)) : []))
      : [];

    const client = tx || this.prisma;



    // also accept numeric product ids (cartProduct.id) if client sends them
    const productIdNumericList: number[] = Array.isArray(products)
      ? products.map((p: any) => {
          const n = Number(p.productId);
          return Number.isFinite(n) ? n : null;
        }).filter((n: number | null): n is number => n !== null)
      : [];

    console.log("Finding checkout cart for user:", userId, "Product ID List:", productIdList, "Product ID Numeric List:", productIdNumericList, "Variant ID List:", variantIdList);

    // build product where clause used both in `where.products.some` and `include.products.where`
    const productWhere: any = { confirm: true, OR: [] };
    if (productIdList.length > 0) {
      productWhere.OR.push({ product1688Id: { in: productIdList } });
      productWhere.OR.push({ productAlibabaId: { in: productIdList } });
    }
    if (productLocalIdList.length > 0) {
      productWhere.OR.push({ productLocalId: { in: productLocalIdList } });
    }
    if (productIdNumericList.length > 0) {
      productWhere.OR.push({ id: { in: productIdNumericList } });
    }
    // include productLocalId condition if needed in future
    if (!productWhere.OR.length) return [];

    console.log("Product where clause for checkout cart query:", productWhere);

    const carts = await client.cart.findMany({
      where: {
        userId: Number(userId),
        products: { some: productWhere },
      },
      include: {
        products: {
          where: productWhere,
          include: {
            variants: variantIdList.length > 0 ? { where: { id: { in: variantIdList } } } : true,
            priceRanges: true,
            productShipping: {
              include: {
                rate: true,
                fromCountry: true,
                toCountry: true,
                shippingMethod: true,
              },
            },
          },
        },
      },
    });

    console.log("Checkout carts found:", carts.length);
    return carts;
  }

  async deleteCartById(cartId: number, tx?: any) {
    const client = tx || this.prisma;
    return await client.cart.delete({
      where: { id: cartId },
    });
  }

  async deleteCartProductByProductTId(productTId: string | number, tx?: any) {
    const client = tx || this.prisma;
    return await client.cartProduct.deleteMany({
      where: { id: Number(productTId) },
    });
  }

  async delteCartProductVariantByTId(variantTId: number, tx?: any) {
    const client = tx || this.prisma;
    return await client.cartProductVariant.delete({
      where: { id: variantTId },
    });
  }

}


const prisma = new PrismaClient();
const cartRepository = new CartRepository(prisma);
export default cartRepository;
