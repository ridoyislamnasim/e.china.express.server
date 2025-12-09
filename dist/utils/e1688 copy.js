"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAopSignature = generateAopSignature;
exports.buildFinalUrl = buildFinalUrl;
exports.call168822 = call168822;
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
    return `${apiBaseUrl}${uriPath}?_aop_signature=${signature}`;
}
async function call168822(apiBaseUrl, uriPath, params, appSecret) {
    var _a, _b, _c, _d;
    const signature = generateAopSignature(uriPath, params, appSecret);
    const finalUrl = buildFinalUrl(apiBaseUrl, uriPath, signature);
    // Build URL-encoded body (1688 expects form-urlencoded)
    const body = new URLSearchParams(params).toString();
    // Debug logs (can be removed in production)
    // eslint-disable-next-line no-console
    // console.log('1688 call', { finalUrl, signature, params, body });
    const response = await axios_1.default.post(finalUrl, body, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
    console.log('1688 response data:', (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.result) === null || _b === void 0 ? void 0 : _b.result);
    return (_d = (_c = response.data) === null || _c === void 0 ? void 0 : _c.result) === null || _d === void 0 ? void 0 : _d.result;
}
exports.default = {
    generateAopSignature,
    buildFinalUrl,
    call168822,
};
