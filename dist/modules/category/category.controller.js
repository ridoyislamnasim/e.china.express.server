"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const catchError_1 = __importDefault(require("../../middleware/errors/catchError"));
const responseHandler_1 = require("../../utils/responseHandler");
const withTransaction_1 = __importDefault(require("../../middleware/transactions/withTransaction"));
const category_service_1 = __importDefault(require("./category.service"));
class CategoryController {
    constructor() {
        this.createCategory = (0, withTransaction_1.default)(async (req, res, next, tx) => {
            const payloadFiles = {
                files: req.files,
            };
            const payload = {
                name: req.body.name,
                slug: req.body.slug,
                // subCategoryRef: req.body.subCategoryRef,
                status: typeof req.body.status === 'boolean' ? req.body.status : req.body.status === 'true' || req.body.status === true,
                colorCode: req.body.colorCode,
            };
            const categoryResult = await category_service_1.default.createCategory(payloadFiles, payload, tx);
            const resDoc = (0, responseHandler_1.responseHandler)(201, 'Category Created successfully', categoryResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getAllCategory = (0, catchError_1.default)(async (req, res, next) => {
            const categoryResult = await category_service_1.default.getAllCategory();
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Get All Categorys', categoryResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getCategoryWithPagination = (0, catchError_1.default)(async (req, res, next) => {
            let payload = {
                page: req.query.page,
                limit: req.query.limit,
                order: req.query.order,
            };
            const category = await category_service_1.default.getCategoryWithPagination(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Categorys get successfully', category);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getSingleCategory = (0, catchError_1.default)(async (req, res, next) => {
            const slug = req.params.slug;
            const categoryResult = await category_service_1.default.getSingleCategory(slug);
            const resDoc = (0, responseHandler_1.responseHandler)(201, 'Single Category successfully', categoryResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getSingleCategoryWithSlug = (0, catchError_1.default)(async (req, res, next) => {
            const slug = req.params.slug;
            const categoryResult = await category_service_1.default.getSingleCategoryWithSlug(slug);
            const resDoc = (0, responseHandler_1.responseHandler)(201, 'Single Category successfully', categoryResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getNavBar = (0, catchError_1.default)(async (req, res, next) => {
            console.log('Fetching Navbar Data...');
            const navBarResult = await category_service_1.default.getNavBar();
            const resDoc = (0, responseHandler_1.responseHandler)(201, 'Navbar successfully', navBarResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.updateCategory = (0, catchError_1.default)(async (req, res, next) => {
            const slug = req.params.slug;
            const payloadFiles = {
                files: req.files,
            };
            const payload = {
                name: req.body.name,
                slug: req.body.slug,
                // subCategoryRef: req.body.subCategoryRef,
                status: typeof req.body.status === 'boolean' ? req.body.status : req.body.status === 'true' || req.body.status === true,
                colorCode: req.body.colorCode,
            };
            const categoryResult = await category_service_1.default.updateCategory(slug, payloadFiles, payload);
            const resDoc = (0, responseHandler_1.responseHandler)(201, 'Category Update successfully');
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.updateCategoryStatus = (0, catchError_1.default)(async (req, res, next) => {
            const slug = req.params.slug;
            const status = req.query.status;
            const categoryResult = await category_service_1.default.updateCategoryStatus(slug, status);
            const resDoc = (0, responseHandler_1.responseHandler)(201, 'Category Status Update successfully');
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.deleteCategory = (0, catchError_1.default)(async (req, res, next) => {
            const slug = req.params.slug;
            const categoryResult = await category_service_1.default.deleteCategory(slug);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Category Deleted successfully');
            res.status(resDoc.statusCode).json(resDoc);
        });
    }
}
exports.CategoryController = CategoryController;
exports.default = new CategoryController();
