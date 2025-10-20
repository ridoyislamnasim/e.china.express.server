"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchError_1 = __importDefault(require("../../middleware/errors/catchError"));
const responseHandler_1 = require("../../utils/responseHandler");
const withTransaction_1 = __importDefault(require("../../middleware/transactions/withTransaction"));
const wishlist_service_1 = __importDefault(require("./wishlist.service"));
class WishListController {
    constructor() {
        this.createWishList = (0, withTransaction_1.default)(async (req, res, next, tx) => {
            const payload = {
                userRef: req.body.userRef,
                productRef: req.body.productRef,
            };
            const wishListResult = await wishlist_service_1.default.createWishList(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(201, 'WishList Created successfully', wishListResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getAllWishList = (0, catchError_1.default)(async (req, res) => {
            const payload = {
                userRef: Number(req.query.userRef),
                productRef: Number(req.query.productRef),
            };
            const wishListResult = await wishlist_service_1.default.getAllWishList(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Get All WishLists', wishListResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getWishListWithPagination = (0, catchError_1.default)(async (req, res) => {
            console.log('WishList query:', req.query);
            let payload = {
                userRef: Number(req.query.userRef),
                page: Number(req.query.page),
                limit: Number(req.query.limit),
                order: req.query.order,
            };
            console.log('WishList payload:', payload);
            const wishList = await wishlist_service_1.default.getWishListWithPagination(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'WishLists get successfully', wishList);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getSingleWishList = (0, catchError_1.default)(async (req, res) => {
            const id = req.params.id;
            const wishListResult = await wishlist_service_1.default.getSingleWishList(id);
            const resDoc = (0, responseHandler_1.responseHandler)(201, 'Single WishList successfully', wishListResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.deleteWishList = (0, catchError_1.default)(async (req, res) => {
            const id = req.params.id;
            await wishlist_service_1.default.deleteWishList(id);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'WishList Deleted successfully');
            res.status(resDoc.statusCode).json(resDoc);
        });
    }
}
exports.default = new WishListController();
