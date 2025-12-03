"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAopSignature = generateAopSignature;
exports.buildFinalUrl = buildFinalUrl;
exports.prepareCategoryRequest = prepareCategoryRequest;
exports.call1688 = call1688;
exports.callCategoryById = callCategoryById;
const axios_1 = __importDefault(require("axios"));
const crypto_js_1 = __importDefault(require("crypto-js"));
function generateAopSignature(uriPath, params, appSecret) {
    const sortedKeys = Object.keys(params).sort();
    let paramStr = '';
    sortedKeys.forEach((key) => {
        paramStr += key + params[key];
    });
    const stringToSign = uriPath + paramStr;
    const hash = crypto_js_1.default.HmacSHA1(stringToSign, appSecret);
    return hash.toString(crypto_js_1.default.enc.Hex).toUpperCase();
}
function buildFinalUrl(apiBaseUrl, uriPath, signature) {
    const base = apiBaseUrl.endsWith('/') ? apiBaseUrl : apiBaseUrl + '/';
    return `${base}${uriPath}?_aop_signature=${signature}`;
}
/**
 * Prepare a category-specific request (signature, finalUrl, body) similar to a Postman pre-request script.
 */
function prepareCategoryRequest(apiBaseUrl, uriPath, categoryId, access_token, appSecret, language = 'en') {
    const params = {
        access_token,
        categoryId: String(categoryId),
        language,
    };
    const signature = generateAopSignature(uriPath, params, appSecret);
    const finalUrl = buildFinalUrl(apiBaseUrl, uriPath, signature);
    const body = new URLSearchParams(params).toString();
    return { _aop_signature: signature, params, finalUrl, body };
}
/**
 * Generic call helper for 1688 APIs when caller builds params.
 */
async function call1688(apiBaseUrl, uriPath, params, appSecret) {
    const signature = generateAopSignature(uriPath, params, appSecret);
    const finalUrl = buildFinalUrl(apiBaseUrl, uriPath, signature);
    const body = new URLSearchParams(params).toString();
    const response = await axios_1.default.post(finalUrl, body, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 30000,
    });
    return response.data;
}
/**
 * Convenience wrapper to prepare and call the category translation API by categoryId.
 */
async function callCategoryById(apiBaseUrl, uriPath, categoryId, access_token, appSecret, language = 'en') {
    const req = prepareCategoryRequest(apiBaseUrl, uriPath, categoryId, access_token, appSecret, language);
    const response = await axios_1.default.post(req.finalUrl, req.body, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 30000,
    });
    return response.data;
}
exports.default = {
    generateAopSignature,
    buildFinalUrl,
    prepareCategoryRequest,
    call1688,
    callCategoryById,
};
