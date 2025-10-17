"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponService = void 0;
const errors_1 = require("../../utils/errors");
const base_service_1 = require("../base/base.service");
const coupon_repository_1 = __importDefault(require("./coupon.repository"));
class CouponService extends base_service_1.BaseService {
    constructor(repository, serviceName) {
        super(repository);
        this.repository = repository;
    }
    async createCoupon(payload) {
        const { code, discount, useLimit, used, startDate, expireDate, discountType, categoryRef, subCategoryRef, brandRef } = payload;
        if (!code || !discount || !startDate || !expireDate) {
            throw new errors_1.NotFoundError('Missing required fields');
        }
        if (discountType == "brand") {
            payload.brandRef = { connect: { id: Number(brandRef) } };
        }
        else if (discountType == "category") {
            payload.categoryRef = { connect: { id: Number(categoryRef) } };
        }
        else if (discountType == "subCategory") {
            payload.subCategoryRef = { connect: { id: Number(subCategoryRef) } };
        }
        return await this.repository.createCoupon(payload);
    }
    async getAllCoupon() {
        return await this.repository.getCouponWithPagination({});
    }
    async getCouponWithPagination(payload) {
        return await this.repository.getCouponWithPagination(payload);
    }
    async getSingleCoupon(id) {
        const couponData = await this.repository.getCouponWithPagination({ id });
        if (!couponData)
            throw new errors_1.NotFoundError('Coupon Not Found');
        return couponData;
    }
    async updateCoupon(id, payload) {
        const { code, discount, useLimit, used, startDate, expireDate, discountType, categoryRef, subCategoryRef, brandRef } = payload;
        if (!code || !discount || !startDate || !expireDate) {
            throw new errors_1.NotFoundError('Missing required fields');
        }
        if (discountType == "brand") {
            payload.brandRef = { connect: { id: Number(brandRef) } };
        }
        else if (discountType == "category") {
            payload.categoryRef = { connect: { id: categoryRef } };
        }
        else if (discountType == "subCategory") {
            payload.subCategoryRef = { connect: { id: Number(subCategoryRef) } };
        }
        return await this.repository.updateCoupon(id, payload);
    }
    async updateCouponStatus(id, status) {
        if (status === undefined || status === null)
            throw new errors_1.NotFoundError('Status is required');
        return await this.repository.updateCoupon(id, { status });
    }
    async deleteCoupon(id) {
        const coupon = await this.repository.getCouponWithPagination({ id });
        if (!coupon)
            throw new errors_1.NotFoundError('Coupon not found');
        return await this.repository.updateCoupon(id, { deleted: true });
    }
    async calculateCouponTotal(payload) {
        return await this.repository.calculateCouponTotal(payload);
    }
}
exports.CouponService = CouponService;
const couponService = new CouponService(coupon_repository_1.default, 'coupon');
exports.default = couponService;
