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
}
exports.ProductService = ProductService;
const productService = new ProductService(product_repository_1.default);
exports.default = productService;
