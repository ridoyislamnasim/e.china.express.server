"use strict";
// Compact processor for 1688 product detail responses.
// Exports a single function `process1688ProductDetail` that accepts the
// raw response (the nested `result.result` or similar) and returns a
// normalized object with the main fields used by the application.
Object.defineProperty(exports, "__esModule", { value: true });
exports.process1688ProductDetail = process1688ProductDetail;
const currencyConverter_1 = require("./currency/currencyConverter");
async function process1688ProductDetail(raw, currencyCode) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    if (!raw)
        return null;
    // The API often nests the useful payload at raw.result.result or raw.result
    const payload = (_c = (_b = (_a = raw === null || raw === void 0 ? void 0 : raw.result) === null || _a === void 0 ? void 0 : _a.result) !== null && _b !== void 0 ? _b : raw === null || raw === void 0 ? void 0 : raw.result) !== null && _c !== void 0 ? _c : raw;
    // getRates
    console.log("------", "Fetching exchange rates for currency code:", currencyCode);
    console.log("------", "Available exchange rates:", await (0, currencyConverter_1.getRates)(currencyCode || "USD"));
    // getExchangeRate
    console.log("------", `Fetching exchange rate from CNY to ${currencyCode !== null && currencyCode !== void 0 ? currencyCode : "USD"}`);
    console.log("------", "Exchange rate result:", await (0, currencyConverter_1.getExchangeRate)("CNY", currencyCode !== null && currencyCode !== void 0 ? currencyCode : "USD"));
    // convertCurrency
    console.log("------", `Converting price from CNY to ${currencyCode !== null && currencyCode !== void 0 ? currencyCode : "USD"}`);
    console.log("------", "Converted price:", await (0, currencyConverter_1.convertCurrency)("CNY", currencyCode !== null && currencyCode !== void 0 ? currencyCode : "USD", 10));
    const product = {
        offerId: (_d = payload === null || payload === void 0 ? void 0 : payload.offerId) !== null && _d !== void 0 ? _d : payload === null || payload === void 0 ? void 0 : payload.offerId,
        categoryId: payload === null || payload === void 0 ? void 0 : payload.categoryId,
        titleTrans: (_e = payload === null || payload === void 0 ? void 0 : payload.subjectTrans) !== null && _e !== void 0 ? _e : null,
        description: (_g = (_f = payload === null || payload === void 0 ? void 0 : payload.description) !== null && _f !== void 0 ? _f : payload === null || payload === void 0 ? void 0 : payload.descriptionTrans) !== null && _g !== void 0 ? _g : null,
        mainVideo: (_h = payload === null || payload === void 0 ? void 0 : payload.mainVideo) !== null && _h !== void 0 ? _h : null,
        images: Array.isArray((_j = payload === null || payload === void 0 ? void 0 : payload.productImage) === null || _j === void 0 ? void 0 : _j.images) ? payload.productImage.images : ((payload === null || payload === void 0 ? void 0 : payload.productImage) ? [payload.productImage] : []),
        productAttribute: Array.isArray(payload === null || payload === void 0 ? void 0 : payload.productAttribute) ? payload.productAttribute : [],
        productSkuInfos_Variant: Array.isArray(payload === null || payload === void 0 ? void 0 : payload.productSkuInfos) ? payload.productSkuInfos : [],
        saleInfo: (_k = payload === null || payload === void 0 ? void 0 : payload.productSaleInfo) !== null && _k !== void 0 ? _k : null,
        priceRange: (_l = payload === null || payload === void 0 ? void 0 : payload.priceRange) !== null && _l !== void 0 ? _l : null,
        shippingInfo: (_m = payload === null || payload === void 0 ? void 0 : payload.productShippingInfo) !== null && _m !== void 0 ? _m : null,
        minOrderQuantity: (_o = payload === null || payload === void 0 ? void 0 : payload.minOrderQuantity) !== null && _o !== void 0 ? _o : null,
        topCategoryId: (_p = payload === null || payload === void 0 ? void 0 : payload.topCategoryId) !== null && _p !== void 0 ? _p : null,
        secondCategoryId: (_q = payload === null || payload === void 0 ? void 0 : payload.secondCategoryId) !== null && _q !== void 0 ? _q : null,
        thirdCategoryId: (_r = payload === null || payload === void 0 ? void 0 : payload.thirdCategoryId) !== null && _r !== void 0 ? _r : null,
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
exports.default = process1688ProductDetail;
