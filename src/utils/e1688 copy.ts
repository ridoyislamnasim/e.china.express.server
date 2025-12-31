import axios from 'axios';
import CryptoJS from 'crypto-js';

export function generateAopSignature(uriPath: string, params: Record<string, string>, appSecret: string) {
  const sortedKeys = Object.keys(params).sort();
  let paramStr = '';
  sortedKeys.forEach((key) => {
    paramStr += key + params[key];
  });
  const stringToSign = uriPath + paramStr;
  const hash = CryptoJS.HmacSHA1(stringToSign, appSecret);
  return hash.toString(CryptoJS.enc.Hex).toUpperCase();
}

export function buildFinalUrl(apiBaseUrl: string, uriPath: string, signature: string) {
  return `${apiBaseUrl}${uriPath}?_aop_signature=${signature}`;
}

export async function call168822(apiBaseUrl: string, uriPath: string, params: Record<string, string>, appSecret: string) {
  const signature = generateAopSignature(uriPath, params, appSecret);
  const finalUrl = buildFinalUrl(apiBaseUrl, uriPath, signature);
  // Build URL-encoded body (1688 expects form-urlencoded)
  const body = new URLSearchParams(params as Record<string, string>).toString();
  // Debug logs (can be removed in production)
  // eslint-disable-next-line no-console
  // console.log('1688 call', { finalUrl, signature, params, body });
  const response = await axios.post(finalUrl, body, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  // console.log('1688 response data:', response.data?.result?.result);
  return response.data?.result?.result;
}

export default {
  generateAopSignature,
  buildFinalUrl,
  call168822,
};
