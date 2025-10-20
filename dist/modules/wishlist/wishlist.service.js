"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishListService = void 0;
const errors_1 = require("../../utils/errors");
const base_service_1 = require("../base/base.service");
const wishlist_repository_1 = __importDefault(require("./wishlist.repository"));
class WishListService extends base_service_1.BaseService {
    constructor(repository, serviceName) {
        super(repository);
        this.repository = repository;
    }
    async createWishList(payload) {
        const { userRef, productRef } = payload;
        if (!userRef || !productRef) {
            throw new errors_1.NotFoundError('Missing required fields');
        }
        return await this.repository.createWishList(payload);
    }
    async getAllWishList(payload) {
        return await this.repository.getAllWishList(payload);
    }
    async getWishListWithPagination(payload) {
        return await this.repository.getWishListWithPagination(payload);
    }
    async getSingleWishList(id) {
        const wishListData = await this.repository.getSingleWishList(id);
        if (!wishListData)
            throw new errors_1.NotFoundError('WishList Not Found');
        return wishListData;
    }
    async deleteWishList(id) {
        return await this.repository.deleteWishList(id);
    }
}
exports.WishListService = WishListService;
const wishListService = new WishListService(wishlist_repository_1.default, 'wishList');
exports.default = wishListService;
