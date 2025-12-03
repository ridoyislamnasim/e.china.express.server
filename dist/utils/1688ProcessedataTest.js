"use strict";
// Compact processor for 1688 product detail responses.
// Exports a single function `process1688ProductDetail` that accepts the
// raw response (the nested `result.result` or similar) and returns a
// normalized object with the main fields used by the application.
Object.defineProperty(exports, "__esModule", { value: true });
exports.process1688ProductDetailTest = process1688ProductDetailTest;
function process1688ProductDetailTest(raw) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1;
    if (!raw)
        return null;
    // The API often nests the useful payload at raw.result.result or raw.result
    const payload = (_c = (_b = (_a = raw === null || raw === void 0 ? void 0 : raw.result) === null || _a === void 0 ? void 0 : _a.result) !== null && _b !== void 0 ? _b : raw === null || raw === void 0 ? void 0 : raw.result) !== null && _c !== void 0 ? _c : raw;
    const product = {
        offerId: (_d = payload === null || payload === void 0 ? void 0 : payload.offerId) !== null && _d !== void 0 ? _d : payload === null || payload === void 0 ? void 0 : payload.offerId,
        categoryId: payload === null || payload === void 0 ? void 0 : payload.categoryId,
        title: (_f = (_e = payload === null || payload === void 0 ? void 0 : payload.subject) !== null && _e !== void 0 ? _e : payload === null || payload === void 0 ? void 0 : payload.title) !== null && _f !== void 0 ? _f : null,
        titleTrans: (_g = payload === null || payload === void 0 ? void 0 : payload.subjectTrans) !== null && _g !== void 0 ? _g : null,
        description: (_h = payload === null || payload === void 0 ? void 0 : payload.description) !== null && _h !== void 0 ? _h : null,
        descriptionTrans: (_j = payload === null || payload === void 0 ? void 0 : payload.descriptionTrans) !== null && _j !== void 0 ? _j : null,
        mainVideo: (_k = payload === null || payload === void 0 ? void 0 : payload.mainVideo) !== null && _k !== void 0 ? _k : null,
        images: Array.isArray((_l = payload === null || payload === void 0 ? void 0 : payload.productImage) === null || _l === void 0 ? void 0 : _l.images) ? payload.productImage.images : ((payload === null || payload === void 0 ? void 0 : payload.productImage) ? [payload.productImage] : []),
        whiteImage: (_o = (_m = payload === null || payload === void 0 ? void 0 : payload.productImage) === null || _m === void 0 ? void 0 : _m.whiteImage) !== null && _o !== void 0 ? _o : null,
        transImages: Array.isArray((_p = payload === null || payload === void 0 ? void 0 : payload.productImageTrans) === null || _p === void 0 ? void 0 : _p.images) ? payload.productImageTrans.images : [],
        attributes: Array.isArray(payload === null || payload === void 0 ? void 0 : payload.productAttribute) ? payload.productAttribute : [],
        skus: Array.isArray(payload === null || payload === void 0 ? void 0 : payload.productSkuInfos) ? payload.productSkuInfos : [],
        saleInfo: (_q = payload === null || payload === void 0 ? void 0 : payload.productSaleInfo) !== null && _q !== void 0 ? _q : null,
        shippingInfo: (_r = payload === null || payload === void 0 ? void 0 : payload.productShippingInfo) !== null && _r !== void 0 ? _r : null,
        minOrderQuantity: (_s = payload === null || payload === void 0 ? void 0 : payload.minOrderQuantity) !== null && _s !== void 0 ? _s : null,
        status: (_t = payload === null || payload === void 0 ? void 0 : payload.status) !== null && _t !== void 0 ? _t : null,
        promotionUrl: (_u = payload === null || payload === void 0 ? void 0 : payload.promotionUrl) !== null && _u !== void 0 ? _u : null,
        companyName: (_v = payload === null || payload === void 0 ? void 0 : payload.companyName) !== null && _v !== void 0 ? _v : null,
        sellingPoint: (_w = payload === null || payload === void 0 ? void 0 : payload.sellingPoint) !== null && _w !== void 0 ? _w : [],
        raw: payload,
    };
    // Derive a simple price summary if priceRangeList exists
    try {
        const priceRanges = (_x = payload === null || payload === void 0 ? void 0 : payload.productSaleInfo) === null || _x === void 0 ? void 0 : _x.priceRangeList;
        if (Array.isArray(priceRanges) && priceRanges.length) {
            const low = Number((_z = (_y = priceRanges[0]) === null || _y === void 0 ? void 0 : _y.price) !== null && _z !== void 0 ? _z : NaN);
            const high = Number((_1 = (_0 = priceRanges[priceRanges.length - 1]) === null || _0 === void 0 ? void 0 : _0.price) !== null && _1 !== void 0 ? _1 : NaN);
            product.priceRange = {
                min: Number.isFinite(low) ? low : null,
                max: Number.isFinite(high) ? high : null,
            };
        }
    }
    catch (e) {
        // ignore
    }
    return product;
}
exports.default = process1688ProductDetailTest;
