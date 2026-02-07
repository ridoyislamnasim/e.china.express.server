import { Console } from "console";

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
    if (name.includes('air') && name.includes('d2d')) p = 'AD2DB';
    else if (name.includes('sea') && name.includes('d2d')) p = 'SD2DB';
    else if (name.includes('express')) p = 'EXPSB';
    else if (name.includes('freight')) {
      if (name.includes('sea')) p = 'SFRTB';
      else if (name.includes('air')) p = 'AFRTB';
      else p = 'FRT';
    } else {
      p = 'ABK';
    }
  }

  // Build where clause: count bookings for today with same prefix and (optionally) same shipping method
  const where: any = { orderNumber: { startsWith: `${p}${dateString}` } };
  if (shippingMethodId) {
    // relation field for shipmentBooking is rateRef
    where.shippingMethodId = Number(shippingMethodId) 
  }
  console.log("-----",where)

  const count = await model.count({ where });
  console.log(`Counted ${count} existing bookings with prefix ${p} and date ${dateString}${shippingMethodId ? ` for shipping method ID ${shippingMethodId}` : ''}`);

  const newNumber = startNumber + count;
  const newId = `${p}${dateString}${newNumber}`;
  console.log(`Generated booking ID: ${newId} (Count: ${count}, Prefix: ${p}, Date: ${dateString})`); 
  return newId;
}
