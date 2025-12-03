"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responseHandler_1 = require("../../utils/responseHandler");
const rateProduct_service_1 = require("./rateProduct.service");
const rateProduct_repository_1 = __importDefault(require("./rateProduct.repository"));
const withTransaction_1 = __importDefault(require("../../middleware/transactions/withTransaction"));
const rateProductService = new rateProduct_service_1.RatePorductService(rateProduct_repository_1.default);
class RateProductController {
    constructor() {
        this.createRateProduct = (0, withTransaction_1.default)(async (req, res, next, tx) => {
            try {
                const { categoryName, categoryShCode, categoryDescription, subCategoryName, subCategoryShCode, subCagetoryDescription, subHeadingName, subHeadingShCode, subHeadingDescription, productName, productShCode, status } = req.body;
                const payload = {
                    productName,
                    productShCode,
                    status,
                    // Include additional options
                    categoryName: categoryName !== null && categoryName !== void 0 ? categoryName : null,
                    categoryShCode: categoryShCode !== null && categoryShCode !== void 0 ? categoryShCode : null,
                    categoryDescription: categoryDescription !== null && categoryDescription !== void 0 ? categoryDescription : null,
                    subCategoryName: subCategoryName !== null && subCategoryName !== void 0 ? subCategoryName : null,
                    subCategoryShCode: subCategoryShCode !== null && subCategoryShCode !== void 0 ? subCategoryShCode : null,
                    subCagetoryDescription: subCagetoryDescription !== null && subCagetoryDescription !== void 0 ? subCagetoryDescription : null,
                    subHeadingName: subHeadingName !== null && subHeadingName !== void 0 ? subHeadingName : null,
                    subHeadingShCode: subHeadingShCode !== null && subHeadingShCode !== void 0 ? subHeadingShCode : null,
                    subHeadingDescription: subHeadingDescription !== null && subHeadingDescription !== void 0 ? subHeadingDescription : null,
                };
                const shippingMethod = await rateProductService.createRateProduct(payload);
                const resDoc = (0, responseHandler_1.responseHandler)(201, 'Rate weight categories created successfully', shippingMethod);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        });
        this.getAllRateProduct = async (req, res, next) => {
            try {
                const rateProducts = await rateProductService.getAllRateProduct();
                const resDoc = (0, responseHandler_1.responseHandler)(200, 'Rate products retrieved successfully', rateProducts);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = new RateProductController();
