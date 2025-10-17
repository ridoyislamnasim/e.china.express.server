"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const pagination_1 = require("../../utils/pagination");
const prisma = new client_1.PrismaClient();
class CouponRepository {
    async createCoupon(payload) {
        const { code, startDate, expireDate, ...rest } = payload;
        // Check if a coupon with the same code already exists
        const existingCoupon = await prisma.coupon.findFirst({
            where: { code },
        });
        if (existingCoupon) {
            throw new Error(`A coupon with the code '${code}' already exists.`);
        }
        // Validate and format dates
        if (!startDate || !expireDate) {
            throw new Error('startDate and expireDate are required');
        }
        const formattedStartDate = new Date(startDate).toISOString();
        const formattedExpireDate = new Date(expireDate).toISOString();
        return await prisma.coupon.create({
            data: {
                ...rest,
                code,
                startDate: formattedStartDate,
                expireDate: formattedExpireDate,
            },
        });
    }
    async updateCoupon(id, payload) {
        const updatedCoupon = await prisma.coupon.update({
            where: { id: Number(id) },
            data: payload,
        });
        if (!updatedCoupon) {
            throw new Error('Coupon not found');
        }
        return updatedCoupon;
    }
    async getCouponWithPagination(payload) {
        try {
            const coupons = await (0, pagination_1.pagination)(payload, async (limit, offset, sortOrder) => {
                const coupons = await prisma.coupon.findMany({
                    skip: offset,
                    take: limit,
                    orderBy: { createdAt: sortOrder },
                });
                const totalCoupon = await prisma.coupon.count();
                return { doc: coupons, totalDoc: totalCoupon };
            });
            return coupons;
        }
        catch (error) {
            console.error('Error getting coupons with pagination:', error);
            throw error;
        }
    }
    async calculateCouponTotal(payload) {
        try {
            const { userRef, couponRef } = payload;
            const cartItems = await prisma.cart.findMany({
                where: { userRef },
                include: { productRef: true },
            });
            if (!cartItems || cartItems.length === 0) {
                throw new Error('Cart is empty.');
            }
            let subTotal = cartItems.reduce((acc, item) => acc + (item.productRef.price - (item.productRef.discountAmount || 0)) * item.quantity, 0);
            let discount = 0;
            let total = subTotal;
            if (couponRef) {
                const coupon = await prisma.coupon.findUnique({ where: { id: couponRef } });
                if (!coupon) {
                    throw new Error('Invalid coupon.');
                }
                const now = new Date();
                if (coupon.expireDate && now > coupon.expireDate) {
                    throw new Error('Coupon expired.');
                }
                if ((coupon.used || 0) >= (coupon.useLimit || 0)) {
                    throw new Error('Coupon usage limit reached.');
                }
                const eligibleItems = cartItems.filter((item) => {
                    if (coupon.discountType === 'brand') {
                        return item.productRef.brandRefId === coupon.brandRefId;
                    }
                    else if (coupon.discountType === 'category') {
                        return item.productRef.categoryRefId === coupon.categoryRefId;
                    }
                    else if (coupon.discountType === 'subCategory') {
                        return item.productRef.subCategoryRefId === coupon.subCategoryRefId;
                    }
                    return false;
                });
                const eligibleSubtotal = eligibleItems.reduce((acc, item) => acc + (item.productRef.price - (item.productRef.discountAmount || 0)) * item.quantity, 0);
                discount = Math.min(coupon.discount || 0, eligibleSubtotal);
                await prisma.coupon.update({ where: { id: couponRef }, data: { used: { increment: 1 } } });
                total = subTotal - discount;
            }
            return {
                subTotal,
                discount,
                total,
                couponApplied: !!couponRef,
            };
        }
        catch (error) {
            console.error('Error calculating coupon total:', error);
            throw error;
        }
    }
}
exports.default = new CouponRepository();
