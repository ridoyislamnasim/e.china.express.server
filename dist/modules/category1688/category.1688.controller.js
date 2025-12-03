"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category1688Controller = void 0;
const catchError_1 = __importDefault(require("../../middleware/errors/catchError"));
const responseHandler_1 = require("../../utils/responseHandler");
const withTransaction_1 = __importDefault(require("../../middleware/transactions/withTransaction"));
const category_1688_service_1 = __importDefault(require("./category.1688.service"));
class Category1688Controller {
    constructor() {
        this.createCategory1688 = (0, withTransaction_1.default)(async (req, res, next, tx) => {
            const category1688Result = await category_1688_service_1.default.createCategory1688();
            const resDoc = (0, responseHandler_1.responseHandler)(201, 'Category1688 Created successfully', category1688Result);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getAllCategory1688 = (0, catchError_1.default)(async (req, res, next) => {
            const category1688Result = await category_1688_service_1.default.getAllCategory1688();
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Get All Category1688s', category1688Result);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getCategoryIdBySubcategory = (0, catchError_1.default)(async (req, res, next) => {
            const { categoryId } = req.params;
            const payload = {
                categoryId: Number(categoryId)
            };
            const category1688Result = await category_1688_service_1.default.getCategoryIdBySubcategory(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Get Category1688 by Subcategory', category1688Result);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getAllCategory1688ForRateCalculation = (0, catchError_1.default)(async (req, res, next) => {
            const category1688Result = await category_1688_service_1.default.getAllCategory1688ForRateCalculation();
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Get All Category1688s for Rate Calculation', category1688Result);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.addCategoryForRateCalculation = (0, catchError_1.default)(async (req, res, next) => {
            const { categoryId } = req.params;
            console.log('Received categoryId in controller:', categoryId);
            const payload = {
                categoryId: Number(categoryId)
            };
            const category1688Result = await category_1688_service_1.default.addCategoryForRateCalculation(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Category added for rate calculation', category1688Result);
            res.status(resDoc.statusCode).json(resDoc);
        });
        // HS Code Entry Handlers
        this.createHsCodeEntryByCategoryId = (0, catchError_1.default)(async (req, res, next) => {
            const { id } = req.params;
            const { globalHsCodes, chinaHsCodes, globalMaterialComment, countryHsCode } = req.body;
            const payload = {
                id: Number(id),
                globalHsCodes,
                chinaHsCodes,
                globalMaterialComment,
                countryHsCode: countryHsCode !== null && countryHsCode !== void 0 ? countryHsCode : []
            };
            const hsCodeEntryResult = await category_1688_service_1.default.createHsCodeEntryByCategoryId(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(201, 'HS Code Entry Created successfully', hsCodeEntryResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getHsCodeEntryByCategoryId = (0, catchError_1.default)(async (req, res, next) => {
            const { id } = req.params;
            const payload = {
                id: Number(id)
            };
            const hsCodeEntryResult = await category_1688_service_1.default.getHsCodeEntryByCategoryId(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Get HS Code Entry by Category ID', hsCodeEntryResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
    }
}
exports.Category1688Controller = Category1688Controller;
exports.default = new Category1688Controller();
