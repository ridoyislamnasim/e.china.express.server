// USD – United States Dollar  
// AED – United Arab Emirates Dirham  
// AFN – Afghan Afghani  
// ALL – Albanian Lek  
// AMD – Armenian Dram  
// ANG – Netherlands Antillean Guilder  
// AOA – Angolan Kwanza  
// ARS – Argentine Peso  
// AUD – Australian Dollar  
// AWG – Aruban Florin  
// AZN – Azerbaijani Manat  
// BDT – Bangladeshi Taka  
// BGN – Bulgarian Lev  
// BHD – Bahraini Dinar  
// BIF – Burundian Franc  
// BMD – Bermudian Dollar  
// CAD – Canadian Dollar  
// CHF – Swiss Franc  
// CNY – Chinese Yuan  
// EUR – Euro  
// GBP – British Pound Sterling  
// INR – Indian Rupee  
// JPY – Japanese Yen  
// KRW – South Korean Won  
// MXN – Mexican Peso  
// NZD – New Zealand Dollar  
// PKR – Pakistani Rupee  
// SAR – Saudi Riyal  
// SGD – Singapore Dollar  
// THB – Thai Baht  
// TRY – Turkish Lira  
// ZAR – South African Rand 

type ExchangeRateResponse = {
  result?: string;
  rates?: Record<string, number>;
  error?: string;
};

const RATE_CACHE_TTL_MS = 30 * 60 * 1000;
const rateCache = new Map<string, { rates: Record<string, number>; expiresAt: number }>();

function normalizeCurrencyCode(currencyCode: string): string {
  return String(currencyCode || '').trim().toUpperCase();
}

export async function getRates(baseCurrency: string): Promise<Record<string, number>> {
  const now = Date.now();
  const cached = rateCache.get(baseCurrency);

  if (cached && cached.expiresAt > now) {
    return cached.rates;
  }

  const res = await fetch(`https://open.er-api.com/v6/latest/${baseCurrency}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch exchange rates for ${baseCurrency}`);
  }

  const data = (await res.json()) as ExchangeRateResponse;
  if (!data?.rates || typeof data.rates !== 'object') {
    throw new Error(`Invalid exchange rate response for ${baseCurrency}`);
  }

  rateCache.set(baseCurrency, {
    rates: data.rates,
    expiresAt: now + RATE_CACHE_TTL_MS,
  });

  return data.rates;
}

export async function getExchangeRate(fromCode: string, toCode: string): Promise<number> {
  const baseCurrency = normalizeCurrencyCode(fromCode);
  const targetCurrency = normalizeCurrencyCode(toCode);

  if (!baseCurrency || !targetCurrency) {
    throw new Error('Both fromCode and toCode are required');
  }

  const rates = await getRates(baseCurrency);
  const rate = rates[targetCurrency];

  if (typeof rate !== 'number' || !Number.isFinite(rate)) {
    throw new Error(`Rate for ${targetCurrency} not found`);
  }

  return rate;
}

export async function convertCurrency(fromCode: string, toCode: string, amount: number = 1): Promise<number> {
  const numericAmount = Number(amount ?? 1);
  if (!Number.isFinite(numericAmount)) {
    throw new Error('Amount must be a valid number');
  }

  const rate = await getExchangeRate(fromCode, toCode);
  return numericAmount * rate;
}

// Example:
// convertCurrency('USD', 'BDT').then(price => console.log(price));
// getExchangeRate('USD', 'BDT').then(rate => console.log(rate));
