"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponService = void 0;
const base_service_1 = require("../base/base.service");
const coupon_repository_1 = __importDefault(require("./coupon.repository"));
class CouponService extends base_service_1.BaseService {
    constructor(repository, serviceName) {
        super(repository);
        this.repository = repository;
    }
}
exports.CouponService = CouponService;
const couponService = new CouponService(coupon_repository_1.default, 'coupon');
exports.default = couponService;
