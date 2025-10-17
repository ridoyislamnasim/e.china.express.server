"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchError_1 = __importDefault(require("../../middleware/errors/catchError"));
const responseHandler_1 = require("../../utils/responseHandler");
const withTransaction_1 = __importDefault(require("../../middleware/transactions/withTransaction"));
const product_service_1 = __importDefault(require("./product.service"));
const helpers_1 = require("../../utils/helpers");
class ProductController {
    constructor() {
        this.createProduct = (0, withTransaction_1.default)(async (req, res, next, session) => {
            var _a, _b, _c;
            const payloadFiles = {
                files: req.files,
            };
            const payload = {
                name: req.body.name,
                description: req.body.description,
                gender: req.body.gender,
                costPrice: Number(req.body.costPrice),
                mrpPrice: Number(req.body.mrpPrice),
                discountType: (0, helpers_1.ensureNullIfUndefined)(req.body.discountType),
                discount: Number(req.body.discount),
                videoUrl: req.body.videoUrl,
                freeShipping: Boolean(req.body.freeShipping),
                brandRef: req.body.brandRef,
                categoryRef: Number(req.body.categoryRef),
                subCategoryRef: req.body.subCategoryRef ? Number(req.body.subCategoryRef) : undefined,
                // childCategoryRef: ensureNullIfUndefined(req.body.childCategoryRef),
                // subChildCategoryRef: ensureNullIfUndefined(req.body.subChildCategoryRef),
                inventoryType: req.body.inventoryType,
                inventory: (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.inventory,
                inventoryArray: ((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.inventoryArray) ? JSON.parse((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.inventoryArray) : [],
                slug: req.body.slug,
                barcode: req.body.barcode,
                publishStatus: req.body.publishStatus
            };
            console.log("Payload in updateProduct:", payload);
            const productResult = await product_service_1.default.createProduct(payloadFiles, payload, session);
            const resDoc = (0, responseHandler_1.responseHandler)(201, 'Product Created successfully', productResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getAllProduct = (0, catchError_1.default)(async (req, res) => {
            const productResult = await product_service_1.default.getAllProduct();
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Get All Products', productResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getAllBestSellProduct = (0, catchError_1.default)(async (req, res) => {
            const payload = {
                limit: req.query.limit,
            };
            const productResult = await product_service_1.default.getAllBestSellProduct(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Get All Best Selling Products', productResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getAllDiscountedProduct = (0, catchError_1.default)(async (req, res) => {
            const payload = {
                limit: req.query.limit,
            };
            const productResult = await product_service_1.default.getAllDiscountedProduct(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Get All Discounted Products', productResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        //   getAllProductByBrandOrGender = catchError(async (req: Request, res: Response) => {
        //     const payload = {
        //       limit: req?.query?.limit,
        //       gender: req?.query?.gender,
        //       brandRef: req?.query?.brandRef,
        //     };
        //     const productResult = await ProductService.getAllProductByBrandOrGender(payload);
        //     const data = {
        //       result: productResult?.product,
        //     };
        //     const resDoc = responseHandler(200, 'Get All Products By Brand Or gender', data);
        //     res.status(resDoc.statusCode).json(resDoc);
        //   });
        //   getAllProductForHomePage = catchError(async (req: Request, res: Response) => {
        //     const payload = {
        //       limit: req.query.limit,
        //       viewType: req.query.viewType,
        //     };
        //     const productResult = await ProductService.getAllProductForHomePage(payload);
        //     const data = {
        //       result: productResult?.product,
        //       category: productResult?.subCategory,
        //     };
        //     const resDoc = responseHandler(200, 'Get All Products', data);
        //     res.status(resDoc.statusCode).json(resDoc);
        //   });
        this.getRelatedProduct = (0, catchError_1.default)(async (req, res) => {
            const payload = {
                slug: req.params.slug,
            };
            const productResult = await product_service_1.default.getRelatedProduct(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Get All Products', productResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        //   getSearchProduct = catchError(async (req: Request, res: Response) => {
        //     const payload = {
        //       search: req.query.search,
        //     };
        //     const productResult = await ProductService.getSearchProduct(payload);
        //     const resDoc = responseHandler(200, 'Get All Products', productResult);
        //     res.status(resDoc.statusCode).json(resDoc);
        //   });
        this.getProductWithPagination = (0, catchError_1.default)(async (req, res) => {
            let payload = {
                page: req.query.page,
                limit: req.query.limit,
                order: req.query.order,
                sortBy: req.query.sortBy,
                minPrice: req.query.minPrice,
                maxPrice: req.query.maxPrice,
                categoryId: req.query.categoryId,
                categorySlug: req.query.categorySlug,
                subCategoryId: req.query.subCategoryId,
                subCategorySlug: req.query.subCategorySlug,
                childCategoryId: req.query.childCategoryId,
                childCategorySlug: req.query.childCategorySlug,
                subChildCategoryId: req.query.subChildCategoryId,
                subChildCategorySlug: req.query.subChildCategorySlug,
                brandId: req.query.brandId,
                brandSlug: req.query.brandSlug,
                isNewArrival: req.query.isNewArrival,
                color: req.query.color,
                level: req.query.level,
                popular: req.query.popular,
                bestSell: req.query.bestSell,
                featured: req.query.featured,
                gender: req.query.gender,
            };
            const product = await product_service_1.default.getProductWithPagination(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Products retrieved successfully', { ...product });
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getProductWithPaginationForAdmin = (0, catchError_1.default)(async (req, res) => {
            let payload = {
                page: req.query.page,
                limit: req.query.limit,
                order: req.query.order,
                warehouseRef: req.query.warehouseRef,
            };
            const product = await product_service_1.default.getProductWithPaginationForAdmin(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Products retrieved successfully', { ...product });
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getProductViewCount = (0, catchError_1.default)(async (req, res) => {
            let payload = {
                slug: req.params.slug,
            };
            const product = await product_service_1.default.getProductViewCount(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Products view count successfully');
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getNewArrivalsProductWithPagination = (0, catchError_1.default)(async (req, res) => {
            var _a, _b;
            let payload = {
                page: Number((_a = req.query.page) !== null && _a !== void 0 ? _a : 1),
                limit: Number((_b = req.query.limit) !== null && _b !== void 0 ? _b : 10),
                order: req.query.order,
            };
            const product = await product_service_1.default.getNewArrivalsProductWithPagination(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Products retrieved successfully', product);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getTrendingProductsWithPagination = (0, catchError_1.default)(async (req, res) => {
            var _a, _b;
            let payload = {
                page: Number((_a = req.query.page) !== null && _a !== void 0 ? _a : 1),
                limit: Number((_b = req.query.limit) !== null && _b !== void 0 ? _b : 10),
                order: req.query.order,
            };
            const product = await product_service_1.default.getTrendingProductsWithPagination(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Products retrieved successfully', product);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getComingSoonProductWithPagination = (0, catchError_1.default)(async (req, res) => {
            var _a, _b;
            let payload = {
                page: Number((_a = req.query.page) !== null && _a !== void 0 ? _a : 1),
                limit: Number((_b = req.query.limit) !== null && _b !== void 0 ? _b : 10),
                order: req.query.order,
            };
            const product = await product_service_1.default.getComingSoonProductWithPagination(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Products retrieved successfully', product);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.getSingleProduct = (0, catchError_1.default)(async (req, res) => {
            const slug = req.params.slug;
            const productResult = await product_service_1.default.getSingleProduct(slug);
            const resDoc = (0, responseHandler_1.responseHandler)(201, 'Single Product successfully', productResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.updateProduct = (0, withTransaction_1.default)(async (req, res, next, session) => {
            var _a, _b, _c;
            try {
                const slug = req.params.slug;
                const payloadFiles = {
                    files: req === null || req === void 0 ? void 0 : req.files,
                };
                const payload = {
                    name: req.body.name,
                    description: req.body.description,
                    gender: req.body.gender,
                    warehousePrice: req.body.warehousePrice,
                    warehouseProfit: req.body.warehouseProfit,
                    wholesalePrice: req.body.wholesalePrice,
                    wholesaleProfit: req.body.wholesaleProfit,
                    mrpPrice: req.body.mrpPrice,
                    discountType: (0, helpers_1.ensureNullIfUndefined)(req.body.discountType),
                    discount: (0, helpers_1.ensureNullIfUndefined)(req.body.discount),
                    videoUrl: req.body.videoUrl,
                    freeShipping: req.body.freeShipping,
                    brandRef: (0, helpers_1.ensureNullIfUndefined)(req.body.brandRef),
                    categoryRef: (0, helpers_1.ensureNullIfUndefined)(req.body.categoryRef),
                    subCategoryRef: req.body.subCategoryRef ? Number(req.body.subCategoryRef) : undefined,
                    childCategoryRef: (0, helpers_1.ensureNullIfUndefined)(req.body.childCategoryRef),
                    subChildCategoryRef: (0, helpers_1.ensureNullIfUndefined)(req.body.subChildCategoryRef),
                    inventoryType: req.body.inventoryType,
                    inventory: (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.inventory,
                    inventoryArray: ((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.inventoryArray) ? JSON.parse((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.inventoryArray) : [],
                    slug: req.body.slug,
                    barcode: req.body.barcode,
                };
                await product_service_1.default.updateProduct(slug, payloadFiles, payload, session);
                const resDoc = (0, responseHandler_1.responseHandler)(201, 'Product Update successfully');
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                if (error.code === 11000) {
                    return res.status(400).json({ message: 'Product title already exists.' });
                }
                // console.log(error);
                next(error);
            }
        });
        //   updateProductStatus = catchError(async (req: Request, res: Response) => {
        //     const id = req.params.id;
        //     const status = req.query.status;
        //     await ProductService.updateProductStatus(id, status);
        //     const resDoc = responseHandler(201, 'Product Status Update successfully');
        //     res.status(resDoc.statusCode).json(resDoc);
        //   });
        this.deleteProduct = (0, withTransaction_1.default)(async (req, res, next, session) => {
            const slug = req.params.slug;
            await product_service_1.default.deleteProduct(slug, session);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Product Deleted successfully');
            res.status(resDoc.statusCode).json(resDoc);
        });
    }
}
exports.default = new ProductController();
