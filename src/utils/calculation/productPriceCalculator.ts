export function computeCartProductsTotal(userCheckoutCart: any[]): number {
  let computedTotal = 0;
  if (!Array.isArray(userCheckoutCart) || userCheckoutCart.length === 0) return 0;

  for (const cart of userCheckoutCart) {
    if (!cart.products) continue;
    for (const prod of cart.products) {
      const variants = Array.isArray(prod.variants) ? prod.variants : [];
      for (const v of variants) {
        const p = Number(v.price) || 0;
        const q = Number(v.quantity) || 0;
        computedTotal += p * q;
      }
    }
  }
  return computedTotal;
}

export function computeCartShippingFee(userCheckoutCart: any[]): number {
  let computedShipping = 0;
  if (!Array.isArray(userCheckoutCart) || userCheckoutCart.length === 0) return 0;

  for (const cart of userCheckoutCart) {
    if (!cart.products) continue;
    for (const prod of cart.products) {
      const shippings = Array.isArray(prod.productShipping) ? prod.productShipping : [];
      for (const s of shippings) {
        const totalCost = Number(s.totalCost);
        if (!Number.isNaN(totalCost) && totalCost > 0) {
          computedShipping += totalCost;
        } else if (s.rate && s.approxWeight) {
          const ratePrice = Number(s.rate.price) || 0;
          const approxW = Number(s.approxWeight) || 0;
          computedShipping += ratePrice * approxW;
        }
      }
    }
  }
  return computedShipping;
}

export function computeCartTotalWithShipping(userCheckoutCart: any[]): { productsTotal: number; shippingFee: number; grandTotal: number } {
  const productsTotal = computeCartProductsTotal(userCheckoutCart);
  const shippingFee = computeCartShippingFee(userCheckoutCart);
  return { productsTotal, shippingFee, grandTotal: productsTotal + shippingFee };
}
