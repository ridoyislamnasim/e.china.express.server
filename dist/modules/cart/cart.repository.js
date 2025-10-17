"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const pagination_1 = require("../../utils/pagination");
const base_repository_1 = require("../base/base.repository");
class CartRepository extends base_repository_1.BaseRepository {
    constructor(prisma) {
        super(prisma.cart);
        this.prisma = prisma;
    }
    async findCartByUserAndProduct(query) {
        console.log('Finding cart with query:', query);
        const whereClause = {
            correlationId: query.correlationId,
            userRef: query.userRef ? { id: Number(query.userRef) } : undefined,
            productRef: query.productRef ? { id: Number(query.productRef) } : undefined,
            inventoryRef: query.inventoryRef ? { id: Number(query.inventoryRef) } : undefined,
        };
        return await this.prisma.cart.findFirst({ where: whereClause });
    }
    async findBuyNowCartByUserAndProduct(query) {
        console.log('Finding cart with query:', query);
        const whereClause = {
            correlationId: query.correlationId,
            userRef: query.userRef ? { id: Number(query.userRef) } : undefined,
            productRef: query.productRef ? { id: Number(query.productRef) } : undefined,
            inventoryRef: query.inventoryRef ? { id: Number(query.inventoryRef) } : undefined,
        };
        return await this.prisma.buyNowCart.findFirst({ where: whereClause });
    }
    async createCart(payload) {
        console.log("payload", payload);
        const data = {
            quantity: payload.quantity,
            productRef: payload.productRef
                ? { connect: { id: Number(payload.productRef) } }
                : undefined,
            inventoryRef: payload.inventoryRef
                ? { connect: { id: Number(payload.inventoryRef) } }
                : undefined,
        };
        console.log("payload 999", data);
        if (payload.userRef) {
            data.userRef = { connect: { id: Number(payload.userRef) } };
        }
        else if (payload.correlationId) {
            data.correlationId = payload.correlationId;
        }
        console.log('Creating cart with data:', data);
        const newCart = await this.prisma.cart.create({
            data: data,
        });
        console.log('New cart created:', newCart);
        return newCart;
    }
    async getAllCartByUser(payload) {
        const { userRef, coupon, productRef, inventoryRef } = payload;
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(userRef);
        const query = {};
        if (isUUID) {
            query.correlationId = userRef;
        }
        else {
            query.userRef = { id: Number(userRef) };
        }
        // if (productRef && inventoryRef) {
        //   query.productRef = productRef;
        //   query.inventoryRef = inventoryRef;
        // }
        const carts = await prisma.cart.findMany({
            where: query,
            include: {
                productRef: true,
                userRef: true,
                inventoryRef: true,
            },
        });
        let appliedCoupon = null;
        let message = `Viewing carts`;
        if (coupon) {
            const existingCoupon = await prisma.coupon.findFirst({ where: { code: coupon } });
            message = `Sorry, that coupon isn’t valid.`;
            if (existingCoupon) {
                const now = new Date();
                if (existingCoupon.startDate &&
                    existingCoupon.expireDate &&
                    now > existingCoupon.startDate &&
                    now < existingCoupon.expireDate &&
                    (existingCoupon.useLimit || 0) > (existingCoupon.used || 0)) {
                    appliedCoupon = existingCoupon;
                    message = `Congratulations, your coupon was applied successfully!`;
                }
            }
        }
        let totalPrice = 0;
        let totalSaved = 0;
        let totalCouponDiscount = 0;
        let productDiscount = 0;
        console.log("cart details", carts.length);
        const cartDetails = carts.map((cart) => {
            const product = cart.productRef;
            const inventory = cart.inventoryRef;
            const quantity = cart.quantity || 0;
            const price = (inventory === null || inventory === void 0 ? void 0 : inventory.price) || 0;
            const discountAmount = (inventory === null || inventory === void 0 ? void 0 : inventory.discountAmount) || 0;
            let couponDiscount = 0;
            if (appliedCoupon) {
                if ((appliedCoupon.categoryRefId && String(appliedCoupon.categoryRefId) === String(product === null || product === void 0 ? void 0 : product.categoryRefId)) ||
                    (appliedCoupon.subCategoryRefId && String(appliedCoupon.subCategoryRefId) === String(product === null || product === void 0 ? void 0 : product.subCategoryRefId))) {
                    const discount = appliedCoupon.discount || 0;
                    couponDiscount =
                        appliedCoupon.discountType === "percent"
                            ? (price * discount) / 100
                            : discount;
                    couponDiscount *= quantity;
                }
            }
            const subtotal = price * quantity;
            const savedAmount = discountAmount * quantity + couponDiscount;
            totalPrice += subtotal - couponDiscount;
            productDiscount += discountAmount * quantity;
            totalCouponDiscount += couponDiscount;
            totalSaved += savedAmount;
            return {
                cartId: cart.id,
                quantity,
                product,
                inventory,
                subtotal,
                couponDiscount,
                savedAmount,
                productDiscount,
            };
        });
        console.log("cart ");
        console.log("cart details", cartDetails.length);
        return {
            data: {
                cartDetails,
                totalPrice,
                totalSaved,
                couponDiscount: totalCouponDiscount,
                productDiscount,
            },
            message,
        };
    }
    async updateCart(id, payload) {
        const updatedCart = await this.prisma.cart.update({
            where: { id },
            data: {
                quantity: payload.quantity,
                userRef: payload.userRef ? { connect: { id: Number(payload.userRef) } } : undefined,
                productRef: payload.productRef ? { connect: { id: Number(payload.productRef) } } : undefined,
                inventoryRef: payload.inventoryRef ? { connect: { id: Number(payload.inventoryRef) } } : undefined,
                correlationId: payload.correlationId,
            },
        });
        if (!updatedCart) {
            throw new Error('Cart not found');
        }
        return updatedCart;
    }
    async updateCartQuantity(cartId, quantity) {
        return await this.prisma.cart.update({
            where: { id: cartId },
            data: { quantity },
        });
    }
    async getCartWithPagination(payload) {
        try {
            const carts = await (0, pagination_1.pagination)(payload, async (limit, offset, sortOrder) => {
                // const prismaSortOrder = sortOrder === -1 ? 'desc' : 'asc';
                const carts = await this.prisma.cart.findMany({
                    where: { userRef: payload.userId ? { id: Number(payload.userId) } : undefined },
                    // orderBy: { createdAt: prismaSortOrder },
                    skip: offset,
                    take: limit,
                });
                const totalCart = await this.prisma.cart.count({
                    where: { userRef: payload.userId ? { id: Number(payload.userId) } : undefined },
                });
                return { doc: carts, totalDoc: totalCart };
            });
            return carts;
        }
        catch (error) {
            // console.error('Error getting carts with pagination:', error);
            throw error;
        }
    }
    async getUserAllCartById(userId) {
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(userId);
        const query = {};
        if (isUUID) {
            query.correlationId = userId;
        }
        else {
            query.userRef = { id: Number(userId) };
        }
        return await this.prisma.cart.findMany({
            where: query,
            include: {
                productRef: true,
                userRef: true,
                inventoryRef: true,
            },
        });
    }
    async deleteCart(id) {
        const deletedCart = await this.prisma.cart.delete({
            where: { id: Number(id) },
        });
        return deletedCart;
    }
    // Buy now Cart
    async createBuyNowCart(payload) {
        console.log("payload", payload);
        const data = {
            quantity: payload.quantity,
            productRef: payload.productRef
                ? { connect: { id: Number(payload.productRef) } }
                : undefined,
            inventoryRef: payload.inventoryRef
                ? { connect: { id: Number(payload.inventoryRef) } }
                : undefined,
        };
        console.log("payload 999", data);
        if (payload.userRef) {
            data.userRef = { connect: { id: Number(payload.userRef) } };
        }
        else if (payload.correlationId) {
            data.correlationId = payload.correlationId;
        }
        console.log('Creating cart with data:', data);
        const newCart = await this.prisma.buyNowCart.create({
            data: data,
        });
        console.log('New cart created:', newCart);
        return newCart;
    }
    async getAllBuyNowCartByUser(payload) {
        const { userId, coupon, productRef, inventoryRef } = payload;
        const query = {};
        // if (/^[a-f\d]{24}$/i.test(userId)) {
        //   query.userRef = userId;
        // } else {
        //   query.correlationId = userId;
        // }
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
            .test(userId || '');
        if (!isUUID) {
            console.log('Creating cart with query 4:', isUUID);
            query.userRef = Number(userId);
        }
        else {
            console.log('Creating cart with query 5:', isUUID);
            query.correlationId = userId;
        }
        // if (productRef && inventoryRef) {
        //   query.productRef = productRef;
        //   query.inventoryRef = inventoryRef;
        // }
        const carts = await prisma.buyNowCart.findMany({
            where: query,
            include: {
                productRef: true,
                userRef: true,
                inventoryRef: true,
            },
        });
        let appliedCoupon = null;
        let message = `Viewing carts`;
        if (coupon) {
            const existingCoupon = await prisma.coupon.findFirst({ where: { code: coupon } });
            message = `Sorry, that coupon isn’t valid.`;
            if (existingCoupon) {
                const now = new Date();
                if (existingCoupon.startDate &&
                    existingCoupon.expireDate &&
                    now > existingCoupon.startDate &&
                    now < existingCoupon.expireDate &&
                    (existingCoupon.useLimit || 0) > (existingCoupon.used || 0)) {
                    appliedCoupon = existingCoupon;
                    message = `Congratulations, your coupon was applied successfully!`;
                }
            }
        }
        let totalPrice = 0;
        let totalSaved = 0;
        let totalCouponDiscount = 0;
        let productDiscount = 0;
        const cartDetails = carts.map((cart) => {
            const product = cart.productRef;
            const inventory = cart.inventoryRef;
            const quantity = cart.quantity || 0;
            const price = (inventory === null || inventory === void 0 ? void 0 : inventory.price) || 0;
            const discountAmount = (inventory === null || inventory === void 0 ? void 0 : inventory.discountAmount) || 0;
            let couponDiscount = 0;
            if (appliedCoupon) {
                if ((appliedCoupon.categoryRefId && String(appliedCoupon.categoryRefId) === String(product === null || product === void 0 ? void 0 : product.categoryRefId)) ||
                    (appliedCoupon.subCategoryRefId && String(appliedCoupon.subCategoryRefId) === String(product === null || product === void 0 ? void 0 : product.subCategoryRefId))) {
                    const discount = appliedCoupon.discount || 0;
                    couponDiscount =
                        appliedCoupon.discountType === "percent"
                            ? (price * discount) / 100
                            : discount;
                    couponDiscount *= quantity;
                }
            }
            const subtotal = price * quantity;
            const savedAmount = discountAmount * quantity + couponDiscount;
            totalPrice += subtotal - couponDiscount;
            productDiscount += discountAmount * quantity;
            totalCouponDiscount += couponDiscount;
            totalSaved += savedAmount;
            return {
                cartId: cart.id,
                quantity,
                product,
                inventory,
                subtotal,
                couponDiscount,
                savedAmount,
                productDiscount,
            };
        });
        return {
            data: {
                cartDetails,
                totalPrice,
                totalSaved,
                couponDiscount: totalCouponDiscount,
                productDiscount,
            },
            message,
        };
    }
}
const prisma = new client_1.PrismaClient();
exports.default = new CartRepository(prisma);
