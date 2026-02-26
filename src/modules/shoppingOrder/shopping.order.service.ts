import { NotFoundError } from '../../utils/errors';
import { BaseService } from '../base/base.service';
import shoppingOrderRepository from './shopping.order.repository';
import cartRepository from '../cart/cart.repository';
// import inventoryRepository from '../inventory/inventory.repository';
import { idGenerate } from '../../utils/IdGenerator';
import { Prisma, PrismaClient } from '@prisma/client';
import { computeCartProductsTotal, computeCartShippingFee, computeCartTotalWithShipping } from '../../utils/calculation/productPriceCalculator';
import { BookingProduct, BookingProductVariant, ProductShippingData } from '../../types/shoppingOrder.type';
import { custom } from 'zod';
import authRepository from '../auth/auth.repository';
import ImgUploader from '../../middleware/upload/ImgUploder';
export class shoppingOrderService extends BaseService<any> {
  private repository: typeof shoppingOrderRepository;
  private cartRepository: any;
  private authRepository: any;
  // private inventoryRepository: any;
  private prisma: PrismaClient;

  constructor(
    repository: typeof shoppingOrderRepository,
    cartRepository: any,
    authRepository: any,
    // inventoryRepository: any,
    prisma: PrismaClient,
  ) {
    super(repository);
    this.repository = repository;
    this.authRepository = authRepository;
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
      customerRef: { connect: { id: userId } },
      ...(payment?.agentId ? { paymentAgentRef: { connect: { id: Number(payment.agentId) } } } : {})
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

    // checkout hya gele user er product er je je varient gula delete koro
    const checkoutVariantIds: number[] = checkoutProducts
      .flatMap((cartProduct: any) => (Array.isArray(cartProduct?.variants) ? cartProduct.variants : []))
      .map((variant: any) => Number(variant?.id))
      .filter((id: number): id is number => Number.isFinite(id));

    const uniqueVariantIds: number[] = Array.from(new Set<number>(checkoutVariantIds));
    if (uniqueVariantIds.length > 0) {
      await Promise.all(
        uniqueVariantIds.map((variantId: number) =>
          this.cartRepository.delteCartProductVariantByTId(variantId, tx)
        )
      );
    }


    // await this.cartRepository.clearCart(userId, tx);
    return order;
  }


  async createPurchaseForShoppingOrderByAdmin(payload: any, payloadFiles: any, tx: any) {
    console.log("Create Purchase for Shopping Order by Admin Payload:", payload);
    const { supplierName, supplierId, paymentMethod, purchaseLink, sourcingPrice, courierFee, totalAmount, purchaseProductIds } = payload;
    if (!supplierName || !paymentMethod || !totalAmount) {
      throw new Error("supplierName, paymentMethod and totalAmount are required to create a purchase");
    }



    const purchaseData = {
      supplierName,
      //   supplierId,
      paymentMethod: paymentMethod.toUpperCase(),
      purchaseLink: purchaseLink || null,
      sourcingPrice: sourcingPrice != null ? Number(sourcingPrice) : 0,
      courierFee: courierFee != null ? Number(courierFee) : 0,
      totalAmount: totalAmount != null ? Number(totalAmount) : 0,
      purchaseImages: [] as any[],
    };

    const { files } = payloadFiles;
    if (files && Array.isArray(files)) {
      const uploadedImages = await ImgUploader(files);

      // 👇 যদি ImgUploader array return করে
      if (Array.isArray(uploadedImages)) {
        purchaseData.purchaseImages = [
          ...purchaseData.purchaseImages,
          ...uploadedImages,
        ];
      }

      // 👇 যদি object return করে { purchaseImages: [] }
      if (uploadedImages.purchaseImages) {
        purchaseData.purchaseImages = [
          ...purchaseData.purchaseImages,
          ...uploadedImages.purchaseImages,
        ];
      }
    }
    const purchase = await this.repository.createPurchaseForShoppingOrderByAdmin(purchaseData, tx);
    // purchaseProductIds update in BookingProduct add purchaseId in BookingProduct and connect with created purchase
    if (purchase && purchase.id && purchaseProductIds && purchaseProductIds.length > 0) {
      const data =  await this.repository.connectPurchaseToBookingProducts(purchase.id, purchaseProductIds, tx);
      console.log("Connected Purchase to BookingProducts:", data);
    }


  }

  async calculateDiscountForAdminShoppingDecision(bookingId: string, payload: any) {
    const { discountTarget, discountType, discountValue } = payload;
    console.log("Calculate Discount for Admin Shipping Decision Payload:", payload);
    // allow discountValue === 0, so only reject if it is null or undefined
    if (!bookingId || !discountTarget || !discountType || discountValue === undefined || discountValue === null) {
      throw new Error("bookingId, discountTarget, discountType and discountValue are required");
    }
    // Fetch the booking to get current shipping price
    const booking = await this.repository.getSingleShoppingOrder(Number(bookingId));
    if (!booking) {
      throw new NotFoundError("Booking Not Found");
    }
    // discountTarget wise maintain hobe - shipping, packaging, branding
    let originalPrice: Prisma.Decimal = new Prisma.Decimal(0);
    if (discountTarget === "totalProductCost") {
      originalPrice = booking.totalProductCost || new Prisma.Decimal(0);
    } else if (discountTarget === "shipping") {
      originalPrice = booking.shippingPrice || new Prisma.Decimal(0);
    } else if (discountTarget === "packaging") {
      originalPrice = booking.packagingCharge || new Prisma.Decimal(0);
    } else if (discountTarget === "branding") {
      originalPrice = booking.brandingCharge || new Prisma.Decimal(0);
    } else {
      throw new Error("Invalid discountTarget. Must be 'totalProductCost', 'shipping', 'packaging' or 'branding'.");
    }

    // Normalize discountType values from different callers
    const t = (discountType || '').toString().toLowerCase();
    let isPercent = false;
    if (['percentage', 'percent', 'p', 'pct'].includes(t)) isPercent = true;
    if (['fixed', 'flat', 'f'].includes(t)) isPercent = false;

    let discountAmount: Prisma.Decimal;
    if (isPercent) {
      discountAmount = originalPrice.mul(new Prisma.Decimal(discountValue).div(100));
    } else {
      discountAmount = new Prisma.Decimal(discountValue);
    }

    let discountedPrice = originalPrice.sub(discountAmount);
    // Ensure price doesn't go negative — avoid using chained `.max()` which may not be available on the runtime Decimal type
    if (discountedPrice.toNumber() < 0) {
      discountedPrice = new Prisma.Decimal(0);
    }
    console.log(`Original Price: ${originalPrice.toString()}, Discount Amount: ${discountAmount.toString()}, Discounted Price: ${discountedPrice.toString()}`);

    // Prepare data to persist on booking based on target

    const updateData: any = {};
    const prismaDiscountType = isPercent ? 'PERCENT' : 'FIXED';
    if (discountTarget === 'totalProductCost') {
      updateData.productCostDiscount = new Prisma.Decimal(discountValue);
      updateData.productCostDiscountType = prismaDiscountType;
      updateData.productCostDiscountAmount = discountAmount;
    } else if (discountTarget === 'shipping') {
      updateData.shippingDiscount = new Prisma.Decimal(discountValue);
      updateData.shippingDiscountType = prismaDiscountType;
      updateData.shippingDiscountAmount = discountAmount;
    } else if (discountTarget === 'packaging') {
      updateData.packagingDiscount = new Prisma.Decimal(discountValue);
      updateData.packagingDiscountType = prismaDiscountType;
      updateData.packagingDiscountAmount = discountAmount;
    } else if (discountTarget === 'branding') {
      updateData.brandingDiscount = new Prisma.Decimal(discountValue);
      updateData.brandingDiscountType = prismaDiscountType;
      updateData.brandingDiscountAmount = discountAmount;
    }

    // Persist the discount fields on the booking and return the updated booking + computed values
    const updatedBooking = await this.repository.findByConditionAndUpdate({ id: Number(bookingId) }, updateData);
    if (!updatedBooking) throw new NotFoundError('Booking Not Find');

    return {
      booking: updatedBooking,
      originalPrice,
      discountAmount,
      discountedPrice,
    };
  }

  async updateShoppingOrderStatusApproveRejectByAdmin(id: string, payload: any, session?: any) {
    console.log("Update Booking Status by Admin Payload:", id, payload);
    const { status } = payload;
    if (!status || (status.toUpperCase() !== 'APPROVE' && status.toUpperCase() !== 'REJECTED_AT_WAREHOUSE')) {
      throw new Error('Status must be either "APPROVE" or "REJECT".');
    }
    const updateData: any = {
      mainStatus: status.toUpperCase(),
      warehouseReceivingStatus: status.toUpperCase(),
      // adminRemarks: payload.adminRemarks || undefined,
      // adminRef: payload.adminId ? { connect: { id: Number(payload.adminId) } } : undefined,
    };
    const BookingData = await this.repository.findByConditionAndUpdate({ id: Number(id) }, updateData, session);
    if (!BookingData) throw new NotFoundError("Booking Not Find");
    return BookingData;
  }

  async getShoppingOrderWithPagination(payload: any) {
    const orders = await this.repository.getShoppingOrderWithPagination( payload );
    return orders;
  }

  async getAllShoppingOrdersWithPaginationForAdmin(payload: any) {
    const orders = await this.repository.getAllShoppingOrdersWithPaginationForAdmin(payload);
    return orders;
  }

  async updateShoppingOrderStatusSourcingPurchasingByAdmin(id: string, payload: any, tx?: any) {
    console.log("Update Booking Status to Sourcing/Purchasing by Admin Payload:", id, payload);
    const { status } = payload;
    if (!status || (status.toUpperCase() !== 'SOURCED' && status.toUpperCase() !== 'PRICE_CHECKING' && status.toUpperCase() !== 'PRICE_CONFIRMED' && status.toUpperCase() !== 'PURCHASING' && status.toUpperCase() !== 'PURCHASED')) {
      throw new Error('Status must be either "SOURCED", "PRICE_CHECKING", "PRICE_CONFIRMED", "PURCHASING" or "PURCHASED".');
    }
    const updateData: any = {
      mainStatus: status.toUpperCase(),
      // warehouseReceivingStatus: status.toUpperCase(), //  eta use hobe na 
      // adminRemarks: payload.adminRemarks || undefined,
      // adminRef: payload.adminId ? { connect: { id: Number(payload.adminId) } } : undefined,
    };
    const BookingData = await this.repository.findByConditionAndUpdate({ id: Number(id) }, updateData, tx);
    if (!BookingData) throw new NotFoundError("Booking Not Find");
    return BookingData;
  }


  async getAllShoopingOrderForAdminByFilterWithPagination(payload: any) {
    // check userRef roleId if customer then return with error msg
    const userRef = payload.userRef;
    const user = await this.authRepository.getUserRoleById(Number(userRef));
    console.log("Admin Booking List Access Check User:", user);
    // Assuming roleId 3 is 'customer', adjust as needed
    if (user?.role.toLowerCase() === 'customer') {
      throw new Error('Customers are not allowed to access this booking list.');
    }
    const Bookings = await this.repository.getAllShoppingOrderForAdminByFilterWithPagination(payload);
    return Bookings;
  }


}

const prisma = new PrismaClient();
export default new shoppingOrderService(shoppingOrderRepository, cartRepository, authRepository, prisma);
