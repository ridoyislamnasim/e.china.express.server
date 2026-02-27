"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const product_repository_1 = __importDefault(require("./product.repository"));
const config_1 = __importDefault(require("../../config/config"));
const e1688_1 = __importDefault(require("../../utils/e1688"));
const e1688_copy_1 = __importDefault(require("../../utils/e1688 copy"));
const _1688Processedata_1 = __importDefault(require("../../utils/1688Processedata"));
const _1688ProcessedataTest_1 = require("../../utils/1688ProcessedataTest");
// import { removeUploadFile } from '../../middleware/upload/removeUploadFile';
const fs_1 = __importDefault(require("fs"));
class ProductService {
    constructor(repository) {
        this.repository = repository;
    }
    async get1688ProductFilterForAgent(payload) {
        try {
            const filterCriteria = payload.filterCriteria || {};
            console.log('Filter Criteria:', payload);
            const { keyword, beginPage, pageSize, categoryId, categoryIdList, priceEnd, priceStart, sort, saleFilterList } = payload;
            // keyword, beginPage, pageSize, are required
            if (!beginPage || !pageSize) {
                throw new Error("Missing required parameters: keyword, beginPage, or pageSize");
            }
            // Use config values
            const appSecret = config_1.default.e1688AppSecret || '';
            const access_token = config_1.default.e1688AccessToken || '';
            const apiBaseUrl = config_1.default.e1688ApiBaseUrl || 'https://gw.open.1688.com/openapi/';
            const uriPath = 'param2/1/com.alibaba.fenxiao.crossborder/product.search.keywordQuery/9077165';
            const offerBody = {
                keyword: keyword || "",
                beginPage: Number(beginPage) || 1,
                pageSize: Number(pageSize) || 20,
                country: 'en',
            };
            console.log('Offer Body before optional params:', offerBody);
            if (categoryId)
                offerBody.categoryId = String(categoryId);
            if (categoryIdList)
                offerBody.categoryIdList = String(categoryIdList);
            if (priceStart !== undefined)
                offerBody.priceStart = priceStart;
            if (priceEnd !== undefined)
                offerBody.priceEnd = priceEnd;
            if (sort)
                offerBody.sort = sort;
            if (saleFilterList)
                offerBody.saleFilterList = saleFilterList;
            const offerQueryParam = JSON.stringify(offerBody);
            // Build params that include both the offerQueryParam (JSON string) and
            // the separate keyword/pagination fields as strings. The helper expects
            // Record<string,string> so stringify numeric fields.
            const unifiedParams = {
                access_token,
                offerQueryParam,
            };
            // console.log('Unified Filter Params:', unifiedParams);
            const data = await e1688_copy_1.default.call168822(apiBaseUrl, uriPath, unifiedParams, appSecret);
            return data;
        }
        catch (error) {
            throw error;
        }
    }
    async get1688ProductFilter(payload) {
        try {
            // Implement your filtering logic here based on the payload
            // For example, you might want to call a specific 1688 API endpoint with filter criteria
            const filterCriteria = payload.filterCriteria || {};
            console.log('Filter Criteria:', payload);
            const { keyword, beginPage, pageSize, categoryId, categoryIdList, priceEnd, priceStart, sort, saleFilterList } = payload;
            // keyword, beginPage, pageSize, are required
            if (!beginPage || !pageSize) {
                throw new Error("Missing required parameters: keyword, beginPage, or pageSize");
            }
            // Use config values
            const appSecret = config_1.default.e1688AppSecret || '';
            const access_token = config_1.default.e1688AccessToken || '';
            const apiBaseUrl = config_1.default.e1688ApiBaseUrl || 'https://gw.open.1688.com/openapi/';
            // Allow separate search uri path via env, otherwise use commonly expected search path
            const uriPath = 'param2/1/com.alibaba.fenxiao.crossborder/product.search.keywordQuery/9077165';
            // Build a single request that includes both the compact `offerQueryParam`
            // JSON string and the traditional keyword/pagination fields. This makes
            // the request compatible with both API styles and keeps a single call
            // path (so we "maintain with one" and include both formats).
            const offerBody = {
                keyword: keyword || "",
                beginPage: Number(beginPage) || 1,
                pageSize: Number(pageSize) || 20,
                country: 'en',
            };
            console.log('Offer Body before optional params:', offerBody);
            if (categoryId)
                offerBody.categoryId = String(categoryId);
            if (categoryIdList)
                offerBody.categoryIdList = String(categoryIdList);
            if (priceStart !== undefined)
                offerBody.priceStart = priceStart;
            if (priceEnd !== undefined)
                offerBody.priceEnd = priceEnd;
            if (sort)
                offerBody.sort = sort;
            if (saleFilterList)
                offerBody.saleFilterList = saleFilterList;
            const offerQueryParam = JSON.stringify(offerBody);
            // Build params that include both the offerQueryParam (JSON string) and
            // the separate keyword/pagination fields as strings. The helper expects
            // Record<string,string> so stringify numeric fields.
            const unifiedParams = {
                access_token,
                offerQueryParam,
            };
            // console.log('Unified Filter Params:', unifiedParams);
            const data = await e1688_copy_1.default.call168822(apiBaseUrl, uriPath, unifiedParams, appSecret);
            return data;
        }
        catch (error) {
            throw error;
        }
    }
    // 1688 API Service
    async get1688ProductDetails(payload) {
        try {
            const { productId, currencyCode } = payload; // your product / offer ID
            console.log('Fetching 1688 product details for productId:', productId);
            // === Setup Required Values (from config with sensible fallbacks) ===
            const appSecret = config_1.default.e1688AppSecret || "U1IH8T6UoQxf";
            const access_token = config_1.default.e1688AccessToken || "793b6857-359d-494b-bc2b-e3b37bc87c12";
            const offerId = productId || config_1.default.e1688DefaultOfferId || "714232053871";
            // === API endpoint & URI path ===
            const apiBaseUrl = config_1.default.e1688ApiBaseUrl || "https://gw.open.1688.com/openapi/";
            const uriPath = config_1.default.e1688UriPath || "param2/1/com.alibaba.fenxiao.crossborder/product.search.queryProductDetail/9077165";
            // === Request parameters ===
            const offerDetailParam = JSON.stringify({
                offerId,
                country: "en",
            });
            const params = {
                access_token,
                offerDetailParam,
            };
            // Use shared util to call 1688 API (generates signature and sends request)
            const responseData = await e1688_1.default.call1688(apiBaseUrl, uriPath, params, appSecret);
            // Process the external payload into a compact product shape
            const processed = (0, _1688Processedata_1.default)(responseData, currencyCode);
            return processed;
        }
        catch (error) {
            // console.error("❌ Error fetching 1688 product details:", error.message);
            throw error;
        }
    }
    async get1688ProductDetailsForAgent(payload) {
        try {
            const { productId } = payload; // your product / offer ID
            console.log('Fetching 1688 product details for productId:', productId);
            // === Setup Required Values (from config with sensible fallbacks) ===
            const appSecret = config_1.default.e1688AppSecret || "U1IH8T6UoQxf";
            const access_token = config_1.default.e1688AccessToken || "793b6857-359d-494b-bc2b-e3b37bc87c12";
            const offerId = productId || config_1.default.e1688DefaultOfferId || "714232053871";
            // === API endpoint & URI path ===
            const apiBaseUrl = config_1.default.e1688ApiBaseUrl || "https://gw.open.1688.com/openapi/";
            const uriPath = config_1.default.e1688UriPath || "param2/1/com.alibaba.fenxiao.crossborder/product.search.queryProductDetail/9077165";
            // === Request parameters ===
            const offerDetailParam = JSON.stringify({
                offerId,
                country: "en",
            });
            const params = {
                access_token,
                offerDetailParam,
            };
            // Use shared util to call 1688 API (generates signature and sends request)
            const responseData = await e1688_1.default.call1688(apiBaseUrl, uriPath, params, appSecret);
            // Process the external payload into a compact product shape
            const processed = (0, _1688Processedata_1.default)(responseData);
            return processed;
        }
        catch (error) {
            // console.error("❌ Error fetching 1688 product details:", error.message);
            throw error;
        }
    }
    async process1688ProductDetailTest(payload) {
        try {
            const { productId } = payload; // your product / offer ID
            console.log('Fetching 1688 product details for productId:', productId);
            // === Setup Required Values (from config with sensible fallbacks) ===
            const appSecret = config_1.default.e1688AppSecret || "U1IH8T6UoQxf";
            const access_token = config_1.default.e1688AccessToken || "793b6857-359d-494b-bc2b-e3b37bc87c12";
            const offerId = productId || config_1.default.e1688DefaultOfferId || "714232053871";
            // === API endpoint & URI path ===
            const apiBaseUrl = config_1.default.e1688ApiBaseUrl || "https://gw.open.1688.com/openapi/";
            const uriPath = config_1.default.e1688UriPath || "param2/1/com.alibaba.fenxiao.crossborder/product.search.queryProductDetail/9077165";
            // === Request parameters ===
            const offerDetailParam = JSON.stringify({
                offerId,
                country: "en",
            });
            const params = {
                access_token,
                offerDetailParam,
            };
            // Use shared util to call 1688 API (generates signature and sends request)
            const responseData = await e1688_1.default.call1688(apiBaseUrl, uriPath, params, appSecret);
            // Process the external payload into a compact product shape
            const processed = (0, _1688ProcessedataTest_1.process1688ProductDetailTest)(responseData);
            // Preserve the original API metadata (like success/code) and place
            // the processed product under result.result so controller response
            // will become: { data: { result: { ...meta..., result: { ...product } } } }
            const apiMeta = (responseData === null || responseData === void 0 ? void 0 : responseData.result) ? { ...responseData.result } : {};
            const normalized = {
                result: {
                    result: processed,
                    responseData: responseData
                },
            };
            return processed;
        }
        catch (error) {
            // console.error("❌ Error fetching 1688 product details:", error.message);
            throw error;
        }
    }
    async get1688ProductImageSearch(payload, payloadFiles) {
        var _a, _b, _c, _d, _e;
        try {
            // Accept multiple shapes for uploaded files: array, single file, or payload fallback
            let imageBuffer;
            if (Array.isArray(payloadFiles) && payloadFiles.length > 0) {
                const file = payloadFiles.find((f) => (f === null || f === void 0 ? void 0 : f.fieldname) === 'image') || payloadFiles[0];
                if (file === null || file === void 0 ? void 0 : file.buffer)
                    imageBuffer = file.buffer;
            }
            else if ((payloadFiles === null || payloadFiles === void 0 ? void 0 : payloadFiles.files) && Array.isArray(payloadFiles.files) && payloadFiles.files.length > 0) {
                const file = payloadFiles.files.find((f) => (f === null || f === void 0 ? void 0 : f.fieldname) === 'image') || payloadFiles.files[0];
                if (file === null || file === void 0 ? void 0 : file.buffer)
                    imageBuffer = file.buffer;
            }
            else if ((_a = payloadFiles === null || payloadFiles === void 0 ? void 0 : payloadFiles.image) === null || _a === void 0 ? void 0 : _a.buffer) {
                imageBuffer = payloadFiles.image.buffer;
            }
            else if (payloadFiles === null || payloadFiles === void 0 ? void 0 : payloadFiles.buffer) {
                imageBuffer = payloadFiles.buffer;
            }
            const imageInput = imageBuffer !== null && imageBuffer !== void 0 ? imageBuffer : payload === null || payload === void 0 ? void 0 : payload.image;
            console.log('Received image input for search:', imageInput ? 'Exists' : 'Not provided');
            console.log('Type of image input:', imageInput);
            console.log('Type of image input:', typeof imageInput);
            if (!imageInput) {
                const error = new Error("Provide an image via files array, single file object, or payload.image");
                error.statusCode = 400;
                throw error;
            }
            let base64;
            if (Buffer.isBuffer(imageInput)) {
                base64 = imageInput.toString('base64');
            }
            else if (typeof imageInput === 'object' && imageInput && imageInput.buffer) {
                base64 = Buffer.from(imageInput.buffer).toString('base64');
            }
            else if (typeof imageInput === 'string') {
                if (/^data:\w+\/[a-zA-Z0-9+.-]+;base64,/.test(imageInput)) {
                    base64 = imageInput.replace(/^data:\w+\/[a-zA-Z0-9+.-]+;base64,/, '');
                }
                else if (fs_1.default.existsSync(imageInput)) {
                    const bin = fs_1.default.readFileSync(imageInput);
                    base64 = Buffer.from(bin).toString('base64');
                }
                else {
                    base64 = imageInput; // assume already a raw base64 string
                }
            }
            if (!base64 || base64.length === 0) {
                const error = new Error("Unable to derive base64 from provided image input");
                error.statusCode = 400;
                throw error;
            }
            const appSecret = config_1.default.e1688AppSecret || '';
            const access_token = config_1.default.e1688AccessToken || '';
            const apiBaseUrl = config_1.default.e1688ApiBaseUrl || 'https://gw.open.1688.com/openapi/';
            const uriPath = 'param2/1/com.alibaba.fenxiao.crossborder/product.image.upload/9077165';
            const uploadImageParamObj = {
                imageBase64: String(base64),
            };
            const uploadImageParam = JSON.stringify(uploadImageParamObj);
            const params = {
                access_token,
                uploadImageParam,
                _aop_timestamp: String(Date.now()),
            };
            const uploadResp = await e1688_1.default.call1688(apiBaseUrl, uriPath, params, appSecret);
            const imageId = ((uploadResp === null || uploadResp === void 0 ? void 0 : uploadResp.result) && (uploadResp.result.result || uploadResp.result.imageId))
                ? String(uploadResp.result.result || uploadResp.result.imageId)
                : undefined;
            console.log('Uploaded Image ID:--------------------------', imageId);
            if (!imageId) {
                const error = new Error("Image upload did not return an imageId");
                error.statusCode = 500;
                throw error;
            }
            const beginPage = Number((_b = payload === null || payload === void 0 ? void 0 : payload.beginPage) !== null && _b !== void 0 ? _b : 1);
            const pageSize = Number((_c = payload === null || payload === void 0 ? void 0 : payload.pageSize) !== null && _c !== void 0 ? _c : 20);
            const country = String((_d = payload === null || payload === void 0 ? void 0 : payload.country) !== null && _d !== void 0 ? _d : 'en');
            const offerQueryParamObj = {
                beginPage,
                country,
                pageSize,
                userId: Number((_e = payload === null || payload === void 0 ? void 0 : payload.userId) !== null && _e !== void 0 ? _e : 0),
            };
            if (payload === null || payload === void 0 ? void 0 : payload.imageAddress) {
                offerQueryParamObj.imageAddress = String(payload.imageAddress);
            }
            // Add optional filters to offerQueryParamObj (1688 API expects these inside offerQueryParam)
            if ((payload === null || payload === void 0 ? void 0 : payload.priceStart) !== undefined && (payload === null || payload === void 0 ? void 0 : payload.priceStart) !== null && (payload === null || payload === void 0 ? void 0 : payload.priceStart) !== '') {
                offerQueryParamObj.priceStart = payload.priceStart;
            }
            if ((payload === null || payload === void 0 ? void 0 : payload.priceEnd) !== undefined && (payload === null || payload === void 0 ? void 0 : payload.priceEnd) !== null && (payload === null || payload === void 0 ? void 0 : payload.priceEnd) !== '') {
                offerQueryParamObj.priceEnd = payload.priceEnd;
            }
            if ((payload === null || payload === void 0 ? void 0 : payload.categoryId) !== undefined && (payload === null || payload === void 0 ? void 0 : payload.categoryId) !== null && (payload === null || payload === void 0 ? void 0 : payload.categoryId) !== '') {
                offerQueryParamObj.categoryId = String(payload.categoryId);
            }
            if ((payload === null || payload === void 0 ? void 0 : payload.sort) !== undefined && (payload === null || payload === void 0 ? void 0 : payload.sort) !== null && (payload === null || payload === void 0 ? void 0 : payload.sort) !== '') {
                offerQueryParamObj.sort = payload.sort;
            }
            console.log('Offer Query Param Object before optional params:', offerQueryParamObj);
            // Include imageId inside offerQueryParam as well for API variants
            offerQueryParamObj.imageId = imageId;
            const offerQueryParam = JSON.stringify(offerQueryParamObj);
            const imageQueryParams = {
                access_token,
                offerQueryParam,
                imageId,
                beginPage: String(beginPage),
                pageSize: String(pageSize),
                country,
                _aop_timestamp: String(Date.now()),
            };
            // Optional filters
            if ((payload === null || payload === void 0 ? void 0 : payload.priceStart) !== undefined) {
                imageQueryParams.priceStart = String(payload.priceStart);
            }
            if ((payload === null || payload === void 0 ? void 0 : payload.priceEnd) !== undefined) {
                imageQueryParams.priceEnd = String(payload.priceEnd);
            }
            if ((payload === null || payload === void 0 ? void 0 : payload.categoryId) !== undefined) {
                imageQueryParams.categoryId = String(payload.categoryId);
            }
            if ((payload === null || payload === void 0 ? void 0 : payload.sort) !== undefined) {
                const sortVal = typeof payload.sort === 'string' ? payload.sort : JSON.stringify(payload.sort);
                imageQueryParams.sort = sortVal;
            }
            console.log('Image Query Params:', imageQueryParams);
            const imageQueryUriPath = 'param2/1/com.alibaba.fenxiao.crossborder/product.search.imageQuery/9077165';
            const searchData = await e1688_1.default.call1688(apiBaseUrl, imageQueryUriPath, imageQueryParams, appSecret);
            return searchData;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.ProductService = ProductService;
const productService = new ProductService(product_repository_1.default);
exports.default = productService;
