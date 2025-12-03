"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const errors_1 = require("../../utils/errors");
const base_service_1 = require("../base/base.service");
const cart_repository_1 = __importDefault(require("./cart.repository"));
const client_1 = require("@prisma/client");
// ProductService 
const product_service_1 = __importDefault(require("../product/product.service"));
const prisma = new client_1.PrismaClient();
class CartService extends base_service_1.BaseService {
    constructor(repository) {
        super(repository);
        this.createCartItem = async (payload, tx) => {
            var _a, _b, _c, _d, _e, _f, _g;
            const items = Array.isArray(payload) ? payload : [payload];
            console.log("Creating cart items with payload: ", items);
            if (!items || items.length === 0)
                return [];
            const first = items[0];
            const userId = (_c = (_b = (_a = first.user) !== null && _a !== void 0 ? _a : first.userId) !== null && _b !== void 0 ? _b : first.userRef) !== null && _c !== void 0 ? _c : null;
            const productId = (_f = (_e = (_d = first.product1688Id) !== null && _d !== void 0 ? _d : first.productLocalId) !== null && _e !== void 0 ? _e : first.productAlibabaId) !== null && _f !== void 0 ? _f : null;
            const productPayload = {
                productId: productId,
            };
            const product = await product_service_1.default.get1688ProductDetails(productPayload);
            if (!userId) {
                throw new Error('Missing user id in cart payload');
            }
            // compute totals
            let totalPrice = 0;
            let totalWeight = 0;
            for (const it of items) {
                const qty = Number((_g = it.quantity) !== null && _g !== void 0 ? _g : 1) || 1;
                const price = (() => {
                    var _a, _b, _c, _d;
                    if (it.skuId && ((_a = product === null || product === void 0 ? void 0 : product.saleInfo) === null || _a === void 0 ? void 0 : _a.priceRangeList)) {
                        const totalQuantity = items.reduce((sum, item) => { var _a; return sum + ((_a = item.quantity) !== null && _a !== void 0 ? _a : 1); }, 0);
                        const priceRange = product.saleInfo.priceRangeList
                            .filter((range) => totalQuantity >= range.startQuantity)
                            .sort((a, b) => b.startQuantity - a.startQuantity)[0];
                        if ((priceRange === null || priceRange === void 0 ? void 0 : priceRange.price) != null)
                            return Number(priceRange.price);
                    }
                    return it.skuId ? ((_d = (_c = (_b = product === null || product === void 0 ? void 0 : product.productSkuInfos_Variant) === null || _b === void 0 ? void 0 : _b.find((v) => v.skuId === it.skuId)) === null || _c === void 0 ? void 0 : _c.consignPrice) !== null && _d !== void 0 ? _d : (it.price != null ? Number(it.price) : undefined)) : (it.price != null ? Number(it.price) : undefined);
                })();
                const weight = (() => {
                    var _a, _b;
                    try {
                        // Check if skuShippingDetails exists for the specific skuId
                        const skuShippingDetails = (_a = product === null || product === void 0 ? void 0 : product.shippingInfo) === null || _a === void 0 ? void 0 : _a.skuShippingDetails;
                        if (skuShippingDetails && Array.isArray(skuShippingDetails)) {
                            const skuDetail = skuShippingDetails.find((s) => String(s.skuId) === String(it.skuId));
                            if ((skuDetail === null || skuDetail === void 0 ? void 0 : skuDetail.weight) != null)
                                return Number(skuDetail.weight);
                        }
                        // Fallback to shippingInfo.weight for all items
                        if (((_b = product === null || product === void 0 ? void 0 : product.shippingInfo) === null || _b === void 0 ? void 0 : _b.weight) != null) {
                            return Number(product.shippingInfo.weight);
                        }
                    }
                    catch (e) {
                        // Handle any unexpected errors
                    }
                    return 0; // Default weight if nothing is found
                })();
                totalPrice += price * qty;
                totalWeight += weight * qty;
            }
            console.log(`Total Price: ${totalPrice}, Total Weight: ${totalWeight}`);
            // create cart
            const cartPaylod = {
                userId: Number(userId),
                totalPrice: totalPrice || undefined,
                totalWeight: totalWeight || undefined,
                currency: 'Dollar',
                status: 'active',
            };
            const cart = await this.repository.createCart(cartPaylod, tx);
            console.log("Created Cart: ", cart);
            const createdProducts = [];
            for (const it of items) {
                const qty = Number(it.quantity) || 0;
                const price = (() => {
                    var _a, _b, _c, _d;
                    if (it.skuId && ((_a = product === null || product === void 0 ? void 0 : product.saleInfo) === null || _a === void 0 ? void 0 : _a.priceRangeList)) {
                        const totalQuantity = items.reduce((sum, item) => { var _a; return sum + ((_a = item.quantity) !== null && _a !== void 0 ? _a : 1); }, 0);
                        const priceRange = product.saleInfo.priceRangeList
                            .filter((range) => totalQuantity >= range.startQuantity)
                            .sort((a, b) => b.startQuantity - a.startQuantity)[0];
                        if ((priceRange === null || priceRange === void 0 ? void 0 : priceRange.price) != null)
                            return Number(priceRange.price);
                    }
                    return it.skuId ? ((_d = (_c = (_b = product === null || product === void 0 ? void 0 : product.variants) === null || _b === void 0 ? void 0 : _b.find((v) => v.skuId === it.skuId)) === null || _c === void 0 ? void 0 : _c.consignPrice) !== null && _d !== void 0 ? _d : (it.price != null ? Number(it.price) : undefined)) : (it.price != null ? Number(it.price) : undefined);
                })();
                const weight = (() => {
                    var _a, _b;
                    try {
                        // Check if skuShippingDetails exists for the specific skuId
                        const skuShippingDetails = (_a = product === null || product === void 0 ? void 0 : product.shippingInfo) === null || _a === void 0 ? void 0 : _a.skuShippingDetails;
                        if (skuShippingDetails && Array.isArray(skuShippingDetails)) {
                            const skuDetail = skuShippingDetails.find((s) => String(s.skuId) === String(it.skuId));
                            if ((skuDetail === null || skuDetail === void 0 ? void 0 : skuDetail.weight) != null)
                                return Number(skuDetail.weight);
                        }
                        // Fallback to shippingInfo.weight for all items
                        if (((_b = product === null || product === void 0 ? void 0 : product.shippingInfo) === null || _b === void 0 ? void 0 : _b.weight) != null) {
                            return Number(product.shippingInfo.weight);
                        }
                    }
                    catch (e) {
                        // Handle any unexpected errors
                    }
                    return 0; // Default weight if nothing is found
                })();
                const cartProductPayload = {
                    product1688Id: it.product1688Id != null ? String(it.product1688Id) : undefined,
                    productLocalId: it.productLocalId != null ? Number(it.productLocalId) : undefined,
                    productAlibabaId: it.productAlibabaId != null ? String(it.productAlibabaId) : undefined,
                    cartId: cart.id,
                    quantity: qty,
                    totalPrice: (price != null && Number.isFinite(Number(price)) ? Number(price) * qty : 0),
                    totalWeight: (weight !== null && weight !== void 0 ? weight : 0) * qty,
                    mainSkuImageUrl: product.images && product.images.length > 0 ? product.images[0] : null,
                };
                console.log("Creating Cart Product with payload -------- ", cartProductPayload);
                const cartProduct = await this.repository.createCartProduct(cartProductPayload, tx);
                console.log("Created Cart Product: ", cartProduct);
                const variantPayload = {
                    cartProductId: cartProduct.id,
                    skuId: it.skuId != null ? String(it.skuId) : undefined,
                    specId: it.specId != null ? String(it.specId) : undefined,
                    quantity: qty,
                    attributeName: (() => {
                        var _a, _b;
                        try {
                            const sku = (_a = product === null || product === void 0 ? void 0 : product.productSkuInfos_Variant) === null || _a === void 0 ? void 0 : _a.find((s) => Number(s.skuId) === Number(it.skuId));
                            const attrs = (_b = sku === null || sku === void 0 ? void 0 : sku.skuAttributes) !== null && _b !== void 0 ? _b : [];
                            if (!attrs || attrs.length === 0)
                                return "";
                            const a = attrs[0];
                            const name = a.attributeNameTrans || a.attributeName || "";
                            const val = a.valueTrans || a.value || "";
                            return name && val ? `${name}: ${val}` : (val || name || "");
                        }
                        catch (e) {
                            return "";
                        }
                    })(),
                    attributeNameSecond: (() => {
                        var _a, _b;
                        try {
                            const sku = (_a = product === null || product === void 0 ? void 0 : product.productSkuInfos_Variant) === null || _a === void 0 ? void 0 : _a.find((s) => Number(s.skuId) === Number(it.skuId));
                            const attrs = (_b = sku === null || sku === void 0 ? void 0 : sku.skuAttributes) !== null && _b !== void 0 ? _b : [];
                            if (!attrs || attrs.length < 2)
                                return "";
                            const a = attrs[1];
                            const name = a.attributeNameTrans || a.attributeName || "";
                            const val = a.valueTrans || a.value || "";
                            return name && val ? `${name}: ${val}` : (val || name || "");
                        }
                        catch (e) {
                            return "";
                        }
                    })(),
                    weight: weight,
                    dimensions: (() => {
                        var _a, _b, _c, _d, _e;
                        // return a formatted dimensions string like "30.00 x 20.00 x 10.00 cm" or null
                        const fmt = (v) => {
                            if (v == null || v === '')
                                return null;
                            const n = Number(v);
                            return Number.isFinite(n) ? n.toFixed(2) : null;
                        };
                        try {
                            const shipList = (_d = (_b = (_a = product === null || product === void 0 ? void 0 : product.shippingInfo) === null || _a === void 0 ? void 0 : _a.skuShippingInfoList) !== null && _b !== void 0 ? _b : (_c = product === null || product === void 0 ? void 0 : product.shippingInfo) === null || _c === void 0 ? void 0 : _c.skuShippingDetails) !== null && _d !== void 0 ? _d : [];
                            const per = Array.isArray(shipList) ? shipList.find((s) => Number(s.skuId) === Number(it.skuId)) : undefined;
                            if (per && (per.length != null || per.width != null || per.height != null)) {
                                const L = fmt(per.length);
                                const W = fmt(per.width);
                                const H = fmt(per.height);
                                if (L || W || H)
                                    return `${L !== null && L !== void 0 ? L : '-'} x ${W !== null && W !== void 0 ? W : '-'} x ${H !== null && H !== void 0 ? H : '-'} cm`;
                            }
                            const skuMeta = (_e = product === null || product === void 0 ? void 0 : product.productSkuInfos_Variant) === null || _e === void 0 ? void 0 : _e.find((s) => Number(s.skuId) === Number(it.skuId));
                            if (skuMeta && (skuMeta.length != null || skuMeta.width != null || skuMeta.height != null)) {
                                const L = fmt(skuMeta.length);
                                const W = fmt(skuMeta.width);
                                const H = fmt(skuMeta.height);
                                if (L || W || H)
                                    return `${L !== null && L !== void 0 ? L : '-'} x ${W !== null && W !== void 0 ? W : '-'} x ${H !== null && H !== void 0 ? H : '-'} cm`;
                            }
                            if ((product === null || product === void 0 ? void 0 : product.shippingInfo) && (product.shippingInfo.length != null || product.shippingInfo.width != null || product.shippingInfo.height != null)) {
                                const L = fmt(product.shippingInfo.length);
                                const W = fmt(product.shippingInfo.width);
                                const H = fmt(product.shippingInfo.height);
                                if (L || W || H)
                                    return `${L !== null && L !== void 0 ? L : '-'} x ${W !== null && W !== void 0 ? W : '-'} x ${H !== null && H !== void 0 ? H : '-'} cm`;
                            }
                        }
                        catch (e) {
                            // noop
                        }
                        return null;
                    })(),
                    price: (() => {
                        var _a;
                        if (it.skuId) {
                            const variant = (_a = product === null || product === void 0 ? void 0 : product.productSkuInfos_Variant) === null || _a === void 0 ? void 0 : _a.find((v) => String(v.skuId) === String(it.skuId));
                            if ((variant === null || variant === void 0 ? void 0 : variant.consignPrice) != null)
                                return Number(variant.consignPrice);
                        }
                        return it.price != null ? Number(it.price) : 0; // Default to 0 if price is undefined
                    })(),
                    skuImageUrl: (() => {
                        var _a, _b;
                        try {
                            const sku = (_a = product === null || product === void 0 ? void 0 : product.productSkuInfos_Variant) === null || _a === void 0 ? void 0 : _a.find((s) => Number(s.skuId) === Number(it.skuId));
                            if (!sku)
                                return null;
                            // prefer attribute that carries an image url
                            const attrImg = (_b = sku.skuAttributes) === null || _b === void 0 ? void 0 : _b.find((a) => (a === null || a === void 0 ? void 0 : a.skuImageUrl) || (a === null || a === void 0 ? void 0 : a.imageUrl) || (a === null || a === void 0 ? void 0 : a.image));
                            if (attrImg === null || attrImg === void 0 ? void 0 : attrImg.skuImageUrl)
                                return attrImg.skuImageUrl;
                            if (attrImg === null || attrImg === void 0 ? void 0 : attrImg.imageUrl)
                                return attrImg.imageUrl;
                            if (attrImg === null || attrImg === void 0 ? void 0 : attrImg.image)
                                return attrImg.image;
                            // try common direct fields on sku
                            if (sku.skuImageUrl)
                                return sku.skuImageUrl;
                            if (sku.image)
                                return sku.image;
                            if (sku.skuImage)
                                return sku.skuImage;
                        }
                        catch (e) {
                            // ignore
                        }
                        return null;
                    })(),
                };
                const variant = await this.repository.createCartProductVariant(variantPayload, tx);
                console.log("Created Cart Product Variant: ", variant);
                createdProducts.push({ cartProduct, variant });
            }
            // return created cart with products
            const result = await this.repository.findCartItemByUserAndProduct(userId, productId, tx);
            console.log("Final Cart with Products: ", result);
            return result;
        };
        this.repository = repository;
    }
    async getUserCartByProductId(userId, productId, tx) {
        console.log(`Fetching cart item for userId: ${userId}, productId: ${productId}`);
        const cartItem = await this.repository.findCartItemByUserAndProduct(userId, productId, tx);
        if (!cartItem) {
            throw new errors_1.NotFoundError('Cart item not found for the given user and product');
        }
        return cartItem;
    }
}
exports.CartService = CartService;
exports.default = new CartService(cart_repository_1.default);
