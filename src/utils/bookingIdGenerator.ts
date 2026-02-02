 /**
 * Booking-specific ID generator
 * - Generates method-wise daily incremental IDs
 * - Usage: bookingIdGenerate({ model, shippingMethodId, shippingMethodName })
 */
export async function bookingIdGenerate(opts: {
  model: any;
  shippingMethodId?: number;
  shippingMethodName?: string;
  startNumber?: number;
  prefix?: string | null;
}): Promise<string> {
  const { model, shippingMethodId, shippingMethodName, startNumber = 1001, prefix = null } = opts;

  const date = new Date();
  const year = date.toLocaleString('en', { year: '2-digit' });
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateString = `${year}${month}${day}`;

  // Determine prefix
  let p = prefix || undefined;
  if (!p) {
    const name = String(shippingMethodName || '').toLowerCase();
    if (name.includes('air') && name.includes('d2d')) p = 'AIR';
    else if (name.includes('sea') && name.includes('d2d')) p = 'SEA';
    else if (name.includes('express')) p = 'EXP';
    else if (name.includes('freight')) {
      if (name.includes('sea')) p = 'SFT';
      else if (name.includes('air')) p = 'AFT';
      else p = 'FRT';
    } else {
      p = 'ABK';
    }
  }

  // Build where clause: count bookings for today with same prefix and (optionally) same shipping method
  const where: any = { orderNumber: { startsWith: `${p}${dateString}` } };
  if (shippingMethodId) {
    // relation field for shipmentBooking is rateRef
    where.rateRef = { shippingMethodId: Number(shippingMethodId) };
  }

  const count = await model.count({ where });

  const newNumber = startNumber + count;
  const newId = `${p}${dateString}${newNumber}`;
  return newId;
}
