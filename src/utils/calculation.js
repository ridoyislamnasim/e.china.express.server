const calculateDiscountAmount = (mrpPrice, discountType, discount) => {
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
    price: Math.round(price),
    discountAmount: Math.round(calculatedDiscountAmount),
  };
};

const calculateVat = (discounted_price, vat) => {
  return (parseFloat(vat) * parseFloat(discounted_price)) / 100;
};

const totalCartDiscountedPrice = (cart) => {
  return cart.reduce((acc, item) => {
    const discountedPrice = calculateDiscountAmount(
      item.product.price,
      item.product.discount_type || "",
      item.product.discount || 0
    ).price;

    return acc + discountedPrice * item.quantity;
  }, 0);
};

// Export functions using CommonJS
module.exports = {
  calculateDiscountAmount,
  calculateVat,
  totalCartDiscountedPrice,
};
