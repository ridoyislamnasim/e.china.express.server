export type DiscountType = "flat" | "percent";

export function calculateDiscountAmount(
  mrpPrice: number,
  discountType: DiscountType,
  discount: number
): { price: number; discountAmount: number } {
  let calculatedDiscountAmount = 0;
  let price = 0;

  if (discountType === "flat") {
    if (mrpPrice < discount) {
      throw new Error("Discount amount cannot be greater than the MRP price.");
    }
    calculatedDiscountAmount = discount;
    price = mrpPrice - calculatedDiscountAmount;
  }

  if (discountType === "percent") {
    if (discount !== undefined) {
      calculatedDiscountAmount = (discount / 100) * mrpPrice;
      price = mrpPrice - calculatedDiscountAmount;
    } else {
      throw new Error("Discount percentage is missing for percent discount.");
    }
  }

  return {
    price: Number(Math.round(price)),
    discountAmount: Number(Math.round(calculatedDiscountAmount)),
  };
}

export function calculateVat(discounted_price: number, vat: number): number {
  return (vat * discounted_price) / 100;
}

export interface CartItem {
  product: {
    price: number;
    discount_type?: DiscountType;
    discount?: number;
  };
  quantity: number;
}

export function totalCartDiscountedPrice(cart: CartItem[]): number {
  return cart.reduce((acc, item) => {
    const discountedPrice = calculateDiscountAmount(
      item.product.price,
      item.product.discount_type || "flat",
      item.product.discount || 0
    ).price;
    return acc + discountedPrice * item.quantity;
  }, 0);
}
