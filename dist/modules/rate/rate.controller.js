"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responseHandler_1 = require("../../utils/responseHandler");
const rate_service_1 = require("./rate.service");
const rate_repository_1 = __importDefault(require("./rate.repository"));
const catchError_1 = __importDefault(require("../../middleware/errors/catchError"));
const withBalkTransaction_1 = __importDefault(require("../../middleware/transactions/withBalkTransaction"));
const rateService = new rate_service_1.RateService(rate_repository_1.default);
class RateController {
    constructor() {
        this.createRate = async (req, res, next) => {
            try {
                const { price, weightCategoryId, shippingMethodId, category1688Id, importCountryId, exportCountryId } = req.body;
                const payload = {
                    price: Number(price),
                    weightCategoryId: Number(weightCategoryId),
                    shippingMethodId: Number(shippingMethodId),
                    category1688Id: Number(category1688Id),
                    importCountryId: Number(importCountryId),
                    exportCountryId: Number(exportCountryId)
                };
                const shippingMethod = await rateService.createRate(payload);
                const resDoc = (0, responseHandler_1.responseHandler)(201, 'Rate created successfully', shippingMethod);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        };
        this.getAllRate = async (req, res, next) => {
            try {
                const rates = await rateService.getAllRate();
                const resDoc = (0, responseHandler_1.responseHandler)(200, 'Rates retrieved successfully', rates);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        };
        this.findRateByCriteria = (0, catchError_1.default)(async (req, res, next) => {
            console.log("req.body", req.body);
            const { importCountryId, exportCountryId, weight, shippingMethodId, category1688Id } = req.body;
            const payload = {
                importCountryId,
                exportCountryId,
                weight,
                shippingMethodId,
                category1688Id
            };
            const rates = await rateService.findRateByCriteria(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Rates retrieved successfully', rates);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.findBookingShippingRate = (0, catchError_1.default)(async (req, res, next) => {
            console.log("req.body", req.body);
            const { importCountryId, exportCountryId, weight, shippingMethodId, category1688Id } = req.body;
            const payload = {
                importCountryId,
                exportCountryId,
                weight,
                shippingMethodId,
                category1688Id
            };
            const rates = await rateService.findBookingShippingRate(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Rates retrieved successfully', rates);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.countryMethodWiseRate = (0, catchError_1.default)(async (req, res, next) => {
            const { importCountryId, exportCountryId, shippingMethodId } = req.query;
            const payload = {
                importCountryId,
                exportCountryId,
                shippingMethodId
            };
            const rates = await rateService.countryMethodWiseRate(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Country Method Wise Rates retrieved successfully', rates);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.bulkAdjustRate = (0, withBalkTransaction_1.default)(async (req, res, next, transaction) => {
            const { adjustIsPercent, adjustMode, amount, weightCategoryId, applyToNonEmptyOnly, exportCountryId, importCountryId, shippingMethodId } = req.body;
            const payload = {
                adjustIsPercent,
                adjustMode,
                amount,
                weightCategoryId,
                applyToNonEmptyOnly,
                exportCountryId,
                importCountryId,
                shippingMethodId
            };
            const result = await rateService.bulkAdjustRate(payload, transaction);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Bulk Rate Adjustment completed successfully', result);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.findShippingRateForProduct = (0, catchError_1.default)(async (req, res, next) => {
            var _a, _b, _c, _d;
            const userRef = (_d = (_c = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_info_encrypted) === null || _b === void 0 ? void 0 : _b.id) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : null;
            const { importCountryId, productId, topCategoryId, secondCategoryId } = req.body;
            const payload = {
                importCountryId,
                productId: Number(productId),
                categoryId: Number(topCategoryId),
                subCategoryId: Number(secondCategoryId),
                userRef
            };
            console.log("Finding shipping rate for product with payload:", payload);
            const rates = await rateService.findShippingRateForProduct(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Shipping Rates for Product retrieved successfully', rates);
            res.status(resDoc.statusCode).json(resDoc);
        });
    }
}
exports.default = new RateController();
