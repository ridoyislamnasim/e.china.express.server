export interface BookingProductVariant {
  bookingProductId: number;
  skuId?: string;
    specId?: string;
    quantity?: number;
    amountOnSale?: number;
    attributeName?: string;
    attributeNameSecond?: string;
    weight?: number;
    dimensions?: string;
    price?: number;
    skuImageUrl?: string;
}


export interface BookingProduct {
    shoppingBookingId: number;
    titleTrans?: string | null;
    product1688Id?: string | null;
    productAlibabaId?: string | null;
    mainSkuImageUrl?: string | null;
    vendorId?: number | null;
    productLocalId?: number | null;
    quantity: number;
    totalPrice: number;
    calculatedPrice: number;
    totalWeight: number;
    customerId?: number | null;
    itemName: string;
}

export interface ProductShippingData {
    bookingProductId?: number | null;
    rateId?: number | null;
    totalQuantity?: number;
    approxWeight?: number | string;
    weightRange?: number | string;
    shippingMethodId?: number | null;
    totalCost?: number | string;
    orderEnabled?: boolean;
    customDuty?: number | string;
    vat?: number | string;
    handlingFee?: number | string;
    packagingFee?: number | string;
    discount?: number | string;
    finalPayable?: number | string;
    estDeliveryDays?: number | null;
    actualDeliveryDate?: Date | null;
    trackingNumber?: string | null;
    trackingURL?: string | null;
    warehouseLocation?: string | null;
    shippingStatus?: string;
    remarks?: string | null;
    toCountryId?: number | null;
    fromCountryId?: number | null;
}


export interface ShoppingOrder {
  title: string;
  details: string;
  type: string;
  BookingCategory: string;
  status: string;
  link: string;
  // add other fields as needed
}
