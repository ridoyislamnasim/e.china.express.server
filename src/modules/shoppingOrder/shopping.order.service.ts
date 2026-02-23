import { NotFoundError } from '../../utils/errors';
import { BaseService } from '../base/base.service';
import shoppingOrderRepository from './shopping.order.repository';
import cartRepository from '../cart/cart.repository';
// import inventoryRepository from '../inventory/inventory.repository';
import { idGenerate } from '../../utils/IdGenerator';
import { PrismaClient } from '@prisma/client';
import { computeCartProductsTotal, computeCartShippingFee, computeCartTotalWithShipping } from '../../utils/calculation/productPriceCalculator';
import { BookingProduct, BookingProductVariant, ProductShippingData } from '../../types/shoppingOrder.type';
import { custom } from 'zod';
export class shoppingOrderService extends BaseService<any> {
  private repository: typeof shoppingOrderRepository;
  private cartRepository: any;
  // private inventoryRepository: any;
  private prisma: PrismaClient;

  constructor(
    repository: typeof shoppingOrderRepository,
    cartRepository: any,
    // inventoryRepository: any,
    prisma: PrismaClient,
  ) {
    super(repository);
    this.repository = repository;
    this.cartRepository = cartRepository;
    // this.inventoryRepository = inventoryRepository;
    this.prisma = prisma;
  }

  async createShoppingOrder(payload: any, tx: any) {
    const { userId, products, addressId, payment } = payload;
    const prismaClient: any = tx || this.prisma;

    const userCheckoutCart = await this.cartRepository.findCheckoutCartByUser(userId, products, tx);
    if (!userCheckoutCart || userCheckoutCart.length === 0) {
      throw new NotFoundError('No checkout cart found for the user with the specified products');
    }
    // compute totals and shipping using shared utility

    const productsTotal = computeCartProductsTotal(userCheckoutCart);
    const computedShipping = computeCartShippingFee(userCheckoutCart);
    const totals = computeCartTotalWithShipping(userCheckoutCart);
    console.log('Computed totalAmount from checkout cart:', productsTotal);
    console.log('Computed shipping fee from checkout cart:', computedShipping);
    const orderNumber = await idGenerate("ORD", "orderNumber", prismaClient.shoppingBooking);
    const orderData = {
      // address relation
      orderNumber: orderNumber,
      totalProductCost: productsTotal,
      shippingPrice: computedShipping,
      mainStatus: "PENDING",
      warehouseReceivingStatus: "PENDING",
      bookingDate: new Date(),
      addressRef: { connect: { id: addressId } },
      paymentMethod: payment?.method.toUpperCase() || null,
      ...(payment?.agentId ? { paymentAgentRef: { connect: { id: payment.agentId } } } : {})
    };
    const order = await this.repository.createShoppingOrder(orderData, tx);

    // Save checkout cart products into BookingProduct + nested priceRanges/variants
    const checkoutProducts = userCheckoutCart.flatMap((cart: any) => cart?.products || []);

    for (const cartProduct of checkoutProducts) {

      console.log('Creating BookingProduct for cart product:', cartProduct);
      const bookingProductData: BookingProduct = {
        shoppingBookingId: Number(order.id),

        titleTrans: cartProduct.titleTrans,
        product1688Id: cartProduct.product1688Id,
        productAlibabaId: cartProduct.productAlibabaId,
        mainSkuImageUrl: cartProduct.mainSkuImageUrl,
        quantity: Number(cartProduct.quantity || 0),
        totalPrice: Number(cartProduct.totalPrice || 0),
        calculatedPrice: Number(cartProduct.calculatedPrice || 0),
        totalWeight: Number(cartProduct.totalWeight || 0),

        vendorId: cartProduct.vendorId != null ? Number(cartProduct.vendorId) : null,
        productLocalId: cartProduct.productLocalId != null ? Number(cartProduct.productLocalId) : null,

        customerId: Number(userId),
        itemName: cartProduct.titleTrans || 'Shopping Product',
      };
      console.log('BookingProduct data to be created:', bookingProductData);
      const createdBookingProduct = await this.repository.createBookingProduct(bookingProductData, tx);


      const priceRanges = Array.isArray(cartProduct?.priceRanges) ? cartProduct.priceRanges : [];
      if (priceRanges.length > 0) {
        const priceRangeData = priceRanges.map((range: any) => ({
          bookingProductId: createdBookingProduct.id,
          startQuantity: Number(range.startQuantity || 0),
          price: range.price,
        }));
        await this.repository.createBookingProductPriceRanges(priceRangeData, tx);
      }

      const variants = Array.isArray(cartProduct?.variants) ? cartProduct.variants : [];
      if (variants.length > 0) {
        const bookingProductVariantData: BookingProductVariant[] = variants.map((variant: any) => ({
          bookingProductId: createdBookingProduct.id,
          skuId: variant.skuId,
          specId: variant.specId,
          quantity: Number(variant.quantity || 1),
          amountOnSale: variant.amountOnSale,
          attributeName: variant.attributeName,
          attributeNameSecond: variant.attributeNameSecond,
          weight: variant.weight,
          dimensions: variant.dimensions,
          price: variant.price,
          skuImageUrl: variant.skuImageUrl,
        }));
        await this.repository.createBookingProductVariants(bookingProductVariantData, tx);
      }

      // ProductShipping

      const productShipping = cartProduct.productShipping?.[0];
      console.log('ProductShipping data from cart product:', productShipping);
      const productShippingData: ProductShippingData = {
        bookingProductId: createdBookingProduct.id,

        rateId: productShipping?.rateId != null ? Number(productShipping.rateId) : null,

        totalQuantity: productShipping?.totalQuantity != null ? Number(productShipping.totalQuantity) : 0,
        approxWeight: productShipping?.approxWeight != null ? Number(productShipping.approxWeight) : 0,

        weightRange: productShipping?.weightRange != null ? Number(productShipping.weightRange) : 0,
        shippingMethodId: productShipping?.shippingMethodId != null ? Number(productShipping.shippingMethodId) : null,
        totalCost: productShipping?.totalCost != null ? Number(productShipping.totalCost) : 0,


        orderEnabled: productShipping?.orderEnabled || false,
        customDuty: productShipping?.customDuty != null ? Number(productShipping.customDuty) : 0,
        vat: productShipping?.vat != null ? Number(productShipping.vat) : 0,

        handlingFee: productShipping?.handlingFee != null ? Number(productShipping.handlingFee) : 0,
        packagingFee: productShipping?.packagingFee != null ? Number(productShipping.packagingFee) : 0,
        discount: productShipping?.discount != null ? Number(productShipping.discount) : 0,

        finalPayable: productShipping?.finalPayable != null ? Number(productShipping.finalPayable) : 0,
        estDeliveryDays: productShipping?.estDeliveryDays != null ? Number(productShipping.estDeliveryDays) : null,
        actualDeliveryDate: productShipping?.actualDeliveryDate ? new Date(productShipping.actualDeliveryDate) : null,

        trackingNumber: productShipping?.trackingNumber || null,
        trackingURL: productShipping?.trackingURL || productShipping?.trakingUrl || null,
        warehouseLocation: productShipping?.warehouseLocation || null,
        shippingStatus: productShipping?.shippingStatus || 'pending',
        remarks: productShipping?.remarks || null,
        toCountryId: productShipping?.toCountryId != null ? Number(productShipping.toCountryId) : null,
        fromCountryId: productShipping?.fromCountryId != null ? Number(productShipping.fromCountryId) : null,

      };
      await this.repository.createProductShipping(productShippingData, tx);
    }

    // await this.cartRepository.clearCart(userId, tx);
    return order;
  }

  async getShoppingOrderWithPagination(payload: any) {
    const orders = await this.repository.getShoppingOrderWithPagination({ payload });
    return orders;
  }

  async getAllShoppingOrdersWithPaginationForAdmin(payload: any) {
    const orders = await this.repository.getAllShoppingOrdersWithPaginationForAdmin({ payload });
    return orders;
  }


}

const prisma = new PrismaClient();
export default new shoppingOrderService(shoppingOrderRepository, cartRepository, prisma,);
