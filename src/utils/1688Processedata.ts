// Compact processor for 1688 product detail responses.
// Exports a single function `process1688ProductDetail` that accepts the
// raw response (the nested `result.result` or similar) and returns a
// normalized object with the main fields used by the application.

import { convertCurrency, getExchangeRate, getRates } from "./currency/currencyConverter";

export async function process1688ProductDetail(raw: any, currencyCode?: string) {
	if (!raw) return null;

	// The API often nests the useful payload at raw.result.result or raw.result
	const payload = raw?.result?.result ?? raw?.result ?? raw;

	// getRates
	console.log("------", "Fetching exchange rates for currency code:", currencyCode);
	console.log("------", "Available exchange rates:", await getRates(currencyCode || "USD"));
	// getExchangeRate
	console.log("------", `Fetching exchange rate from CNY to ${currencyCode ?? "USD"}`);
	console.log("------", "Exchange rate result:", await getExchangeRate("CNY", currencyCode ?? "USD"));
// convertCurrency
	console.log("------", `Converting price from CNY to ${currencyCode ?? "USD"}`);
	console.log("------", "Converted price:", await convertCurrency("CNY", currencyCode ?? "USD", 10));


	const product: any = {
		offerId: payload?.offerId ?? payload?.offerId,
		categoryId: payload?.categoryId,
		titleTrans: payload?.subjectTrans ?? null,
		description: payload?.description ?? payload?.descriptionTrans ?? null,

		mainVideo: payload?.mainVideo ?? null,
		images: Array.isArray(payload?.productImage?.images) ? payload.productImage.images : (payload?.productImage ? [payload.productImage] : []),


		productAttribute: Array.isArray(payload?.productAttribute) ? payload.productAttribute : [],
		productSkuInfos_Variant: Array.isArray(payload?.productSkuInfos) ? payload.productSkuInfos : [],

		saleInfo: payload?.productSaleInfo ?? null,
		priceRange: payload?.priceRange ?? null,

		shippingInfo: payload?.productShippingInfo ?? null,
		minOrderQuantity: payload?.minOrderQuantity ?? null,
		topCategoryId: payload?.topCategoryId ?? null,
		secondCategoryId: payload?.secondCategoryId ?? null,
		thirdCategoryId: payload?.thirdCategoryId ?? null,
		// status: payload?.status ?? null,
		// promotionUrl: payload?.promotionUrl ?? null,
		// companyName: payload?.companyName ?? null,
		// sellingPoint: payload?.sellingPoint ?? [],
		// raw: payload,
	};

	// Derive a simple price summary if priceRangeList exists
	// try {
	// 	const priceRanges = payload?.productSaleInfo?.priceRangeList;
	// 	if (Array.isArray(priceRanges) && priceRanges.length) {
	// 		const low = Number(priceRanges[0]?.price ?? NaN);
	// 		const high = Number(priceRanges[priceRanges.length - 1]?.price ?? NaN);
	// 		product.priceRange = {
	// 			min: Number.isFinite(low) ? low : null,
	// 			max: Number.isFinite(high) ? high : null,
	// 		};
	// 	}
	// } catch (e) {
	// 	// ignore
	// }

	return product;
}

export default process1688ProductDetail;
