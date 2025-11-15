import axios from 'axios';
import CryptoJS from 'crypto-js';

export function generateAopSignature(uriPath: string, params: Record<string, string>, appSecret: string): string {
	const sortedKeys = Object.keys(params).sort();
	let paramStr = '';
	sortedKeys.forEach((key) => {
		paramStr += key + params[key];
	});
	const stringToSign = uriPath + paramStr;
	const hash = CryptoJS.HmacSHA1(stringToSign, appSecret);
	return hash.toString(CryptoJS.enc.Hex).toUpperCase();
}

export function buildFinalUrl(apiBaseUrl: string, uriPath: string, signature: string): string {
	const base = apiBaseUrl.endsWith('/') ? apiBaseUrl : apiBaseUrl + '/';
	return `${base}${uriPath}?_aop_signature=${signature}`;
}

/**
 * Prepare a category-specific request (signature, finalUrl, body) similar to a Postman pre-request script.
 */
export function prepareCategoryRequest(
	apiBaseUrl: string,
	uriPath: string,
	categoryId:number,
	access_token: string,
	appSecret: string,
	language = 'en'
): { _aop_signature: string; params: Record<string, string>; finalUrl: string; body: string } {
	const params: Record<string, string> = {
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
export async function call1688(apiBaseUrl: string, uriPath: string, params: Record<string, string>, appSecret: string) {
	const signature = generateAopSignature(uriPath, params, appSecret);
	const finalUrl = buildFinalUrl(apiBaseUrl, uriPath, signature);
	const body = new URLSearchParams(params).toString();
	const response = await axios.post(finalUrl, body, {
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
export async function callCategoryById(
	apiBaseUrl: string,
	uriPath: string,
	categoryId:  number,
	access_token: string,
	appSecret: string,
	language = 'en'
): Promise<any> {
	const req = prepareCategoryRequest(apiBaseUrl, uriPath, categoryId, access_token, appSecret, language);
	const response = await axios.post(req.finalUrl, req.body, {
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		timeout: 30000,
	});
	return response.data;
}

export default {
	generateAopSignature,
	buildFinalUrl,
	prepareCategoryRequest,
	call1688,
	callCategoryById,
};
