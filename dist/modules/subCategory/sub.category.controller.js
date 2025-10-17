"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchError_1 = __importDefault(require("../../middleware/errors/catchError"));
const responseHandler_1 = require("../../utils/responseHandler");
const withTransaction_1 = __importDefault(require("../../middleware/transactions/withTransaction"));
const sub_category_service_1 = __importDefault(require("./sub.category.service"));
class SubCategoryController {
    constructor() {
        this.createSubCategory = (0, withTransaction_1.default)(async (req, res, next, tx) => {
            const payloadFiles = {
                files: req.files,
            };
            const payload = {
                name: req.body.name,
                status: Boolean(req.body.status),
                slug: req.body.slug,
                categoryRef: Number(req.body.categoryRef),
            };
            const subCategoryResult = await sub_category_service_1.default.createSubCategory(payloadFiles, payload, tx);
            const resDoc = (0, responseHandler_1.responseHandler)(201, 'SubCategory Created successfully', subCategoryResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getAllSubCategory = (0, catchError_1.default)(async (req, res, next) => {
            const subCategoryResult = await sub_category_service_1.default.getAllSubCategory();
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Get All SubCategorys', subCategoryResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getSubCategoryWithPagination = (0, catchError_1.default)(async (req, res, next) => {
            let payload = {
                page: req.query.page,
                limit: req.query.limit,
                order: req.query.order,
            };
            const subCategory = await sub_category_service_1.default.getSubCategoryWithPagination(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'SubCategorys get successfully', subCategory);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getSingleSubCategory = (0, catchError_1.default)(async (req, res, next) => {
            const slug = req.params.slug;
            const subCategoryResult = await sub_category_service_1.default.getSingleSubCategory(slug);
            const resDoc = (0, responseHandler_1.responseHandler)(201, 'Single SubCategory successfully', subCategoryResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.updateSubCategory = (0, catchError_1.default)(async (req, res, next) => {
            const slug = req.params.slug;
            const payloadFiles = {
                files: req === null || req === void 0 ? void 0 : req.files,
            };
            const payload = {
                name: req.body.name,
                status: typeof req.body.status === 'boolean' ? req.body.status : req.body.status === 'true' || req.body.status === true,
                slug: req.body.slug,
                categoryRef: req.body.categoryRef,
            };
            const subCategoryResult = await sub_category_service_1.default.updateSubCategory(slug, payloadFiles, payload);
            const resDoc = (0, responseHandler_1.responseHandler)(201, 'SubCategory Update successfully');
            res.status(resDoc.statusCode).json(resDoc);
        });
        //   updateSubCategoryStatus = catchError(async (req: Request, res: Response, next: NextFunction) => {
        //     const slug = req.params.slug;
        //     const status = req.query.status === 'true' ? true : req.query.status === 'false' ? false : true;
        //     const subCategoryResult = await SubCategoryService.updateSubCategoryStatus(
        //       slug,
        //       status
        //     );
        //     const resDoc = responseHandler(
        //       201,
        //       'SubCategory Status Update successfully'
        //     );
        //     res.status(resDoc.statusCode).json(resDoc);
        //   });
        this.deleteSubCategory = (0, catchError_1.default)(async (req, res, next) => {
            const slug = req.params.slug;
            const subCategoryResult = await sub_category_service_1.default.deleteSubCategory(slug);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'SubCategory Deleted successfully');
            res.status(resDoc.statusCode).json(resDoc);
        });
    }
}
exports.default = new SubCategoryController();
