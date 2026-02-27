"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchError_1 = __importDefault(require("../../middleware/errors/catchError"));
const responseHandler_1 = require("../../utils/responseHandler");
const product_service_1 = __importDefault(require("./product.service"));
const APPKEY = "9077165"; // Replace with your actual App Key
const APPSECRET = "U1IH8T6UoQxf"; // Replace with your actual App Secret
const ACCESS_TOKEN = "793b6857-359d-494b-bc2b-e3b37bc87c12"; // Replace with valid access token
const axios_1 = __importDefault(require("axios"));
const crypto_js_1 = __importDefault(require("crypto-js"));
class ProductController {
    constructor() {
        this.getCategoryTranslation = async (req, res) => {
            var _a, _b;
            try {
                const { cateName, language } = req.body; // outMemberId সরিয়ে দিলাম
                const _aop_timestamp = Date.now().toString();
                const uriPath = `param2/1/com.alibaba.fenxiao.crossborder/category.translation.getByKeyword/${APPKEY}`;
                // Application-level params (outMemberId ছাড়া)
                const appParams = {
                    cateName,
                    language,
                    // outMemberId নেই = membership ID ছাড়াই কাজ করবে
                };
                // Signature generate
                const sortedKeys = Object.keys(appParams).sort();
                let paramStr = "";
                sortedKeys.forEach((key) => {
                    paramStr += key + appParams[key];
                });
                const stringToSign = uriPath + paramStr;
                const hash = crypto_js_1.default.HmacSHA1(stringToSign, APPSECRET);
                const _aop_signature = hash.toString(crypto_js_1.default.enc.Hex).toUpperCase();
                // Request body (outMemberId ছাড়া)
                const requestBody = { cateName, language };
                const url = `https://gw.open.1688.com/openapi/${uriPath}`;
                const response = await axios_1.default.post(url, requestBody, {
                    headers: {
                        "Content-Type": "application/json",
                        "_aop_timestamp": _aop_timestamp,
                        "_aop_signature": _aop_signature,
                    },
                    params: {
                        access_token: ACCESS_TOKEN,
                    },
                });
                res.json(response.data);
            }
            catch (err) {
                console.error("Error:", ((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err.message);
                res.status(500).json({ error: ((_b = err.response) === null || _b === void 0 ? void 0 : _b.data) || err.message });
            }
        };
        this.get1688ProductFilterForAgent = (0, catchError_1.default)(async (req, res) => {
            console.log("Request Body:", req.body);
            console.log("Request Params:", req.params);
            console.log("Request Query:", req.query);
            const payload = {
                keyword: req.query.keyword,
                beginPage: req.query.beginPage,
                pageSize: req.query.pageSize,
                categoryId: req.query.categoryId,
                categoryIdList: req.query.categoryIdList,
                priceEnd: req.query.priceEnd,
                priceStart: req.query.priceStart,
                sort: req.query.sort,
                saleFilterList: req.query.saleFilterList,
            };
            const result = await product_service_1.default.get1688ProductFilterForAgent(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(200, '1688 Product Filter created successfully', result);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.get1688ProductFilter = (0, catchError_1.default)(async (req, res) => {
            console.log("Request Body:", req.body);
            console.log("Request Params:", req.params);
            console.log("Request Query:", req.query);
            const payload = {
                keyword: req.query.keyword,
                beginPage: req.query.beginPage,
                pageSize: req.query.pageSize,
                categoryId: req.query.categoryId,
                categoryIdList: req.query.categoryIdList,
                priceEnd: req.query.priceEnd,
                priceStart: req.query.priceStart,
                sort: req.query.sort,
                saleFilterList: req.query.saleFilterList,
            };
            const result = await product_service_1.default.get1688ProductFilter(payload);
            const resDoc = (0, responseHandler_1.responseHandler)(200, '1688 Product Filter created successfully', result);
            res.status(resDoc.statusCode).json(resDoc);
        });
        // 1688 API Controllers
        this.get1688ProductDetailsForAgent = (0, catchError_1.default)(async (req, res) => {
            const payload = {
                productId: req.params.productId,
            };
            const productResult = await product_service_1.default.get1688ProductDetailsForAgent(payload);
            // console.log("productResult", productResult);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Product Details Retrieved Successfully', productResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.get1688ProductDetails = (0, catchError_1.default)(async (req, res) => {
            const payload = {
                productId: req.params.productId,
                currencyCode: req.query.currencyCode,
            };
            const productResult = await product_service_1.default.get1688ProductDetails(payload);
            // console.log("productResult", productResult);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Product Details Retrieved Successfully', productResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.get1688ProductDetailsTest = (0, catchError_1.default)(async (req, res) => {
            const payload = {
                productId: req.params.productId,
            };
            const productResult = await product_service_1.default.process1688ProductDetailTest(payload);
            // console.log("productResult", productResult);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Product Details Retrieved Successfully', productResult);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.get1688ProductImageSearch = (0, catchError_1.default)(async (req, res) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            // image resived from req.file or req.files
            console.log("Received files:--", req.files);
            const payloadFiles = {
                files: req.files,
            };
            const payload = {
                beginPage: typeof req.query.beginPage === 'string' ? req.query.beginPage : String((_a = req.query.beginPage) !== null && _a !== void 0 ? _a : '1'),
                pageSize: typeof req.query.pageSize === 'string' ? req.query.pageSize : String((_b = req.query.pageSize) !== null && _b !== void 0 ? _b : '20'),
                sort: typeof req.query.sort === 'string' ? req.query.sort : String((_c = req.query.sort) !== null && _c !== void 0 ? _c : ''),
                priceStart: typeof req.query.priceStart === 'string' ? req.query.priceStart : String((_d = req.query.priceStart) !== null && _d !== void 0 ? _d : ''),
                priceEnd: typeof req.query.priceEnd === 'string' ? req.query.priceEnd : String((_e = req.query.priceEnd) !== null && _e !== void 0 ? _e : ''),
                categoryId: typeof req.query.categoryId === 'string' ? req.query.categoryId : String((_f = req.query.categoryId) !== null && _f !== void 0 ? _f : ''),
            };
            const result = await product_service_1.default.get1688ProductImageSearch(payload, payloadFiles);
            const resDoc = (0, responseHandler_1.responseHandler)(200, '1688 Products retrieved successfully', (_h = (_g = result === null || result === void 0 ? void 0 : result.result) === null || _g === void 0 ? void 0 : _g.result) !== null && _h !== void 0 ? _h : []);
            res.status(resDoc.statusCode).json(resDoc);
        });
        // createProduct = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
        //   const payloadFiles = {
        //     files: req.files,
        //   };
        //   const payload = {
        //     name: req.body.name,
        //     description: req.body.description,
        //     gender: req.body.gender,
        //     costPrice: Number(req.body.costPrice),
        //     mrpPrice: Number(req.body.mrpPrice),
        //     discountType: ensureNullIfUndefined(req.body.discountType),
        //     discount: Number(req.body.discount),
        //     videoUrl: req.body.videoUrl,
        //     freeShipping: Boolean(req.body.freeShipping),
        //     brandRef: req.body.brandRef,
        //     categoryRef: Number(req.body.categoryRef),
        //     subCategoryRef: req.body.subCategoryRef ? Number(req.body.subCategoryRef) : undefined,
        //     // childCategoryRef: ensureNullIfUndefined(req.body.childCategoryRef),
        //     // subChildCategoryRef: ensureNullIfUndefined(req.body.subChildCategoryRef),
        //     inventoryType: req.body.inventoryType,
        //     inventoryArray: req?.body?.inventoryArray ? JSON.parse(req?.body?.inventoryArray) : [],
        //     slug: req.body.slug,
        //     barcode: req.body.barcode,
        //     publishStatus: req.body.publishStatus
        //   };
        //   console.log("Payload in updateProduct:", payload);
        //   const productResult = await ProductService.createProduct(payloadFiles, payload, tx);
        //   const resDoc = responseHandler(201, 'Product Created successfully', productResult);
        //   res.status(resDoc.statusCode).json(resDoc);
        // });
        // getAllProduct = catchError(async (req: Request, res: Response) => {
        //   const productResult = await ProductService.getAllProduct();
        //   const resDoc = responseHandler(200, 'Get All Products', productResult);
        //   res.status(resDoc.statusCode).json(resDoc);
        // });
        // getAllBestSellProduct = catchError(async (req: Request, res: Response) => {
        //   const payload = {
        //     limit: req.query.limit,
        //   };
        //   const productResult = await ProductService.getAllBestSellProduct(payload);
        //   const resDoc = responseHandler(200, 'Get All Best Selling Products', productResult);
        //   res.status(resDoc.statusCode).json(resDoc);
        // });
        // getAllDiscountedProduct = catchError(async (req: Request, res: Response) => {
        //   const payload = {
        //     limit: req.query.limit,
        //   };
        //   const productResult = await ProductService.getAllDiscountedProduct(payload);
        //   const resDoc = responseHandler(200, 'Get All Discounted Products', productResult);
        //   res.status(resDoc.statusCode).json(resDoc);
        // });
        // getShopOption = catchError(async (req: Request, res: Response) => {
        //   const productResult = await ProductService.getShopOption();
        //   const resDoc = responseHandler(200, "Get Shop Options", productResult);
        //   res.status(resDoc.statusCode).json(resDoc);
        // });
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
        // getRelatedProduct = catchError(async (req: Request, res: Response) => {
        //   const payload = {
        //     slug: req.params.slug,
        //   };
        //   const productResult = await ProductService.getRelatedProduct(payload);
        //   const resDoc = responseHandler(200, 'Get All Products', productResult);
        //   res.status(resDoc.statusCode).json(resDoc);
        // });
        // getSearchProduct = catchError(async (req: Request, res: Response) => {
        //   const payload = {
        //     search: req.query.search,
        //   };
        //   const productResult = await ProductService.getSearchProduct(payload);
        //   const resDoc = responseHandler(200, 'Get All Products', productResult);
        //   res.status(resDoc.statusCode).json(resDoc);
        // });
        // getProductWithPagination = catchError(async (req: Request, res: Response) => {
        //   let payload = {
        //     page: req.query.page,
        //     limit: req.query.limit,
        //     order: req.query.order,
        //     sortBy: req.query.sortBy,
        //     minPrice: req.query.minPrice,
        //     maxPrice: req.query.maxPrice,
        //     categoryId: req.query.categoryId,
        //     categorySlug: req.query.categorySlug,
        //     subCategoryId: req.query.subCategoryId,
        //     subCategorySlug: req.query.subCategorySlug,
        //     childCategoryId: req.query.childCategoryId,
        //     childCategorySlug: req.query.childCategorySlug,
        //     subChildCategoryId: req.query.subChildCategoryId,
        //     subChildCategorySlug: req.query.subChildCategorySlug,
        //     brandId: req.query.brandId,
        //     brandSlug: req.query.brandSlug,
        //     isNewArrival: req.query.isNewArrival,
        //     color: req.query.color,
        //     level: req.query.level,
        //     popular: req.query.popular,
        //     bestSell: req.query.bestSell,
        //     featured: req.query.featured,
        //     gender: req.query.gender,
        //   };
        //   const product = await ProductService.getProductWithPagination(payload);
        //   const resDoc = responseHandler(200, 'Products retrieved successfully', { ...product });
        //   res.status(resDoc.statusCode).json(resDoc);
        // });
        // getProductWithPaginationForAdmin = catchError(async (req: Request, res: Response) => {
        //   let payload = {
        //     page: req.query.page,
        //     limit: req.query.limit,
        //     order: req.query.order,
        //     warehouseRef: req.query.warehouseRef,
        //   };
        //   const product = await ProductService.getProductWithPaginationForAdmin(payload);
        //   // console.log("product", product);
        //   const resDoc = responseHandler(200, 'Products retrieved successfully', { ...product });
        //   res.status(resDoc.statusCode).json(resDoc);
        // });
        // getProductViewCount = catchError(async (req: Request, res: Response) => {
        //   let payload = {
        //     slug: req.params.slug,
        //   };
        //   const product = await ProductService.getProductViewCount(payload);
        //   const resDoc = responseHandler(200, 'Products view count successfully');
        //   res.status(resDoc.statusCode).json(resDoc);
        // });
        // getNewArrivalsProductWithPagination = catchError(async (req: Request, res: Response) => {
        //   let payload = {
        //     page: Number(req.query.page ?? 1),
        //     limit: Number(req.query.limit ?? 10),
        //     order: req.query.order,
        //   };
        //   const product = await ProductService.getNewArrivalsProductWithPagination(payload);
        //   const resDoc = responseHandler(200, 'Products retrieved successfully', product);
        //   res.status(resDoc.statusCode).json(resDoc);
        // });
        // getTrendingProductsWithPagination = catchError(async (req: Request, res: Response) => {
        //   let payload = {
        //     page: Number(req.query.page ?? 1),
        //     limit: Number(req.query.limit ?? 10),
        //     order: req.query.order,
        //   };
        //   const product = await ProductService.getTrendingProductsWithPagination(payload);
        //   const resDoc = responseHandler(200, 'Products retrieved successfully', product);
        //   res.status(resDoc.statusCode).json(resDoc);
        // });
        // getComingSoonProductWithPagination = catchError(async (req: Request, res: Response) => {
        //   let payload = {
        //     page: Number(req.query.page ?? 1),
        //     limit: Number(req.query.limit ?? 10),
        //     order: req.query.order,
        //   };
        //   const product = await ProductService.getComingSoonProductWithPagination(payload);
        //   const resDoc = responseHandler(200, 'Products retrieved successfully', product);
        //   res.status(resDoc.statusCode).json(resDoc);
        // });
        // getSingleProduct = catchError(async (req: Request, res: Response) => {
        //   const slug = req.params.slug;
        //   const productResult = await ProductService.getSingleProduct(slug);
        //   const resDoc = responseHandler(201, 'Single Product successfully', productResult);
        //   res.status(resDoc.statusCode).json(resDoc);
        // });
        // updateProduct = withTransaction(async (req: Request, res: Response, next: NextFunction, session: any) => {
        //   try {
        //     const slug = req.params.slug;
        //     const payloadFiles = {
        //       files: req?.files,
        //     };
        //     const payload = {
        //       name: req.body.name,
        //       description: req.body.description,
        //       gender: req.body.gender,
        //       warehousePrice: req.body.warehousePrice,
        //       warehouseProfit: req.body.warehouseProfit,
        //       wholesalePrice: req.body.wholesalePrice,
        //       wholesaleProfit: req.body.wholesaleProfit,
        //       mrpPrice: req.body.mrpPrice,
        //       discountType: ensureNullIfUndefined(req.body.discountType),
        //       discount: ensureNullIfUndefined(req.body.discount),
        //       videoUrl: req.body.videoUrl,
        //       freeShipping: req.body.freeShipping,
        //       brandRef: ensureNullIfUndefined(req.body.brandRef),
        //       categoryRef: ensureNullIfUndefined(req.body.categoryRef),
        //       subCategoryRef: req.body.subCategoryRef ? Number(req.body.subCategoryRef) : undefined,
        //       childCategoryRef: ensureNullIfUndefined(req.body.childCategoryRef),
        //       subChildCategoryRef: ensureNullIfUndefined(req.body.subChildCategoryRef),
        //       inventoryType: req.body.inventoryType,
        //       inventory: req?.body?.inventory,
        //       inventoryArray: req?.body?.inventoryArray ? JSON.parse(req?.body?.inventoryArray) : [],
        //       slug: req.body.slug,
        //       barcode: req.body.barcode,
        //     };
        //     await ProductService.updateProduct(slug, payloadFiles, payload, session);
        //     const resDoc = responseHandler(201, 'Product Update successfully');
        //     res.status(resDoc.statusCode).json(resDoc);
        //   } catch (error: any) {
        //     if (error.code === 11000) {
        //       return res.status(400).json({ message: 'Product title already exists.' });
        //     }
        //     // console.log(error);
        //     next(error);
        //   }
        // });
        //   updateProductStatus = catchError(async (req: Request, res: Response) => {
        //     const id = req.params.id;
        //     const status = req.query.status;
        //     await ProductService.updateProductStatus(id, status);
        //     const resDoc = responseHandler(201, 'Product Status Update successfully');
        //     res.status(resDoc.statusCode).json(resDoc);
        //   });
        // deleteProduct = withTransaction(async (req: Request, res: Response, next: NextFunction, session: any) => {
        //   const slug = req.params.slug;
        //   await ProductService.deleteProduct(slug, session);
        //   const resDoc = responseHandler(200, 'Product Deleted successfully');
        //   res.status(resDoc.statusCode).json(resDoc);
        // });
    }
}
exports.default = new ProductController();
