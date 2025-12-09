"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const base_repository_1 = require("../base/base.repository");
const errors_1 = require("../../utils/errors");
class CartRepository extends base_repository_1.BaseRepository {
    constructor(prisma) {
        super(prisma.cart);
        this.prisma = prisma;
    }
    async createCart(payload, tx) {
        var _a, _b, _c, _d;
        const client = tx || this.prisma;
        // try to find existing active cart for the user
        const existing = await client.cart.findFirst({ where: { userId: Number(payload.userId) } });
        if (existing) {
            // update existing cart with provided fields (totals, status, currency)
            return await client.cart.update({
                where: { id: existing.id }, data: {
                    totalPrice: (_a = payload.totalPrice) !== null && _a !== void 0 ? _a : existing.totalPrice,
                    totalWeight: (_b = payload.totalWeight) !== null && _b !== void 0 ? _b : existing.totalWeight,
                    currency: (_c = payload.currency) !== null && _c !== void 0 ? _c : existing.currency,
                    status: (_d = payload.status) !== null && _d !== void 0 ? _d : existing.status,
                }
            });
        }
        else {
            // create new cart when no existing cart found
            return await client.cart.create({ data: payload });
        }
    }
    async createCartProduct(payload, tx) {
        var _a, _b, _c, _d;
        const client = tx || this.prisma;
        console.log("Creating Cart Product with payload: ", payload);
        // try to find existing cartProduct for same cart and same product id (any of the id fields)
        const whereClauses = [];
        if (payload.product1688Id != null)
            whereClauses.push({ product1688Id: String(payload.product1688Id) });
        if (payload.productLocalId != null)
            whereClauses.push({ productLocalId: Number(payload.productLocalId) });
        if (payload.productAlibabaId != null)
            whereClauses.push({ productAlibabaId: String(payload.productAlibabaId) });
        const existing = whereClauses.length > 0
            ? await client.cartProduct.findFirst({ where: { cartId: payload.cartId, OR: whereClauses } })
            : null;
        if (existing) {
            // update existing: sum quantities and totals
            const newQuantity = ((_a = payload.quantity) !== null && _a !== void 0 ? _a : 0);
            const newTotalPrice = ((_b = payload.totalPrice) !== null && _b !== void 0 ? _b : 0);
            const newTotalWeight = ((_c = payload.totalWeight) !== null && _c !== void 0 ? _c : 0);
            console.log("Updating existing Cart Product ID:", existing.id, "New Quantity:", newQuantity, "New Total Price:", newTotalPrice, "New Total Weight:", newTotalWeight);
            return await client.cartProduct.update({
                where: { id: existing.id },
                data: {
                    quantity: newQuantity,
                    totalPrice: newTotalPrice,
                    totalWeight: newTotalWeight,
                    mainSkuImageUrl: (_d = payload.mainSkuImageUrl) !== null && _d !== void 0 ? _d : existing.mainSkuImageUrl,
                },
            });
        }
        // no existing product -> create new
        return await client.cartProduct.create({ data: payload });
    }
    async createCartProductVariant(payload, tx) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        console.log("Creating Cart Product Variant with payload: ", payload);
        const client = tx || this.prisma;
        // require cartProductId to match existing variant
        if (payload.skuId == null && payload.specId == null) {
            // find exiting variant by cartProductId only
            const existing = await client.cartProductVariant.findFirst({ where: { cartProductId: payload.cartProductId } });
            if (existing) {
                const newQuantity = ((_a = payload.quantity) !== null && _a !== void 0 ? _a : 0);
                const newPrice = ((_b = payload.price) !== null && _b !== void 0 ? _b : 0);
                const newWeight = ((_c = payload.weight) !== null && _c !== void 0 ? _c : 0);
                return await client.cartProductVariant.update({
                    where: { id: existing.id },
                    data: {
                        quantity: newQuantity,
                        price: newPrice,
                        weight: newWeight,
                        attributeName: (_d = payload.attributeName) !== null && _d !== void 0 ? _d : existing.attributeName,
                        attributeNameSecond: (_e = payload.attributeNameSecond) !== null && _e !== void 0 ? _e : existing.attributeNameSecond,
                        dimensions: (_f = payload.dimensions) !== null && _f !== void 0 ? _f : existing.dimensions,
                        skuImageUrl: (_g = payload.skuImageUrl) !== null && _g !== void 0 ? _g : existing.skuImageUrl,
                    },
                });
            }
            // create directly if no parent id provided
            return await client.cartProductVariant.create({ data: payload });
        }
        const whereClauses = [];
        if (payload.skuId != null)
            whereClauses.push({ skuId: String(payload.skuId) });
        if (payload.specId != null)
            whereClauses.push({ specId: String(payload.specId) });
        const existing = whereClauses.length > 0
            ? await client.cartProductVariant.findFirst({ where: { cartProductId: payload.cartProductId, OR: whereClauses } })
            : null;
        if (existing) {
            const newQuantity = ((_h = payload.quantity) !== null && _h !== void 0 ? _h : 0);
            const newPrice = ((_j = payload.price) !== null && _j !== void 0 ? _j : 0);
            const newWeight = ((_k = payload.weight) !== null && _k !== void 0 ? _k : 0);
            return await client.cartProductVariant.update({
                where: { id: existing.id },
                data: {
                    quantity: newQuantity,
                    price: newPrice,
                    weight: newWeight,
                    attributeName: (_l = payload.attributeName) !== null && _l !== void 0 ? _l : existing.attributeName,
                    attributeNameSecond: (_m = payload.attributeNameSecond) !== null && _m !== void 0 ? _m : existing.attributeNameSecond,
                    dimensions: (_o = payload.dimensions) !== null && _o !== void 0 ? _o : existing.dimensions,
                    skuImageUrl: (_p = payload.skuImageUrl) !== null && _p !== void 0 ? _p : existing.skuImageUrl,
                },
            });
        }
        return await client.cartProductVariant.create({ data: payload });
    }
    async findCartItemByUserAndProduct(userId, productId, tx) {
        var _a;
        const client = tx || this.prisma;
        const pidStr = String(productId);
        // filter বানানো
        const productFilter = {
            OR: [
                { product1688Id: pidStr },
                // { productLocalId: pidStr },
                { productAlibabaId: pidStr },
            ],
        };
        const cart = await client.cart.findFirst({
            where: {
                userId: Number(userId),
                products: {
                    some: productFilter,
                },
            },
            include: {
                products: {
                    where: productFilter,
                    include: {
                        variants: {
                            select: {
                                id: true,
                                cartProductId: true,
                                skuId: true,
                                specId: true,
                                quantity: true,
                            },
                        },
                    },
                },
            },
        });
        if (!cart) {
            throw new errors_1.NotFoundError('Cart not found for the user');
        }
        return (_a = cart === null || cart === void 0 ? void 0 : cart.products[0]) === null || _a === void 0 ? void 0 : _a.variants;
    }
    async findAllCartByUser(userId, tx) {
        const client = tx || this.prisma;
        const carts = await client.cart.findMany({
            where: { userId: Number(userId) },
            include: {
                products: {
                    include: {
                        variants: true,
                    },
                },
            },
        });
        return carts;
    }
    async deleteCartProductByProductTId(productTId, tx) {
        const client = tx || this.prisma;
        return await client.cartProduct.deleteMany({
            where: { id: Number(productTId) },
        });
    }
    async delteCartProductVariantByTId(variantTId, tx) {
        const client = tx || this.prisma;
        return await client.cartProductVariant.delete({
            where: { id: variantTId },
        });
    }
}
const prisma = new client_1.PrismaClient();
exports.default = new CartRepository(prisma);
