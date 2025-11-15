#!/usr/bin/env node
// scripts/fetch1688Category.js
// Usage: E1688_APP_SECRET=... E1688_ACCESS_TOKEN=... node scripts/fetch1688Category.js 10

const axios = require('axios');
const CryptoJS = require('crypto-js');

function generateAopSignature(uriPath, params, appSecret) {
  const sortedKeys = Object.keys(params).sort();
  let paramStr = '';
  sortedKeys.forEach((k) => {
    paramStr += k + params[k];
  });
  const stringToSign = uriPath + paramStr;
  const hash = CryptoJS.HmacSHA1(stringToSign, appSecret);
  return hash.toString(CryptoJS.enc.Hex).toUpperCase();
}

function buildFinalUrl(apiBaseUrl, uriPath, signature) {
  // ensure trailing slash handling
  const base = apiBaseUrl.endsWith('/') ? apiBaseUrl : apiBaseUrl + '/';
  // uriPath typically begins without a leading slash; keep as-is
  return `${base}${uriPath}?_aop_signature=${signature}`;
}

async function callCategoryById({ apiBaseUrl, uriPath, categoryId, access_token, appSecret }) {
  const params = {
    access_token,
    categoryId: Number(categoryId),
    language: 'en',
  };

  const signature = generateAopSignature(uriPath, params, appSecret);
  const finalUrl = buildFinalUrl(apiBaseUrl, uriPath, signature);
  const body = new URLSearchParams(params).toString();

  console.log('\nPrepared request:');
  console.log('_aop_signature:', signature);
  console.log('finalUrl:', finalUrl);
  console.log('body:', body);

  const res = await axios.post(finalUrl, body, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    timeout: 30000,
  });
  return res.data;
}

async function main() {
  const argv = process.argv.slice(2);
  const categoryIdArg = argv[0] || process.env.CATEGORY_ID || process.env.categoryID;
  if (!categoryIdArg) {
    console.error('Usage: node scripts/fetch1688Category.js <categoryId>');
    console.error('Or set CATEGORY_ID env var');
    process.exit(1);
  }

  const categoryId = categoryIdArg;
  const appSecret = process.env.E1688_APP_SECRET || process.env.E1688_APPSECRET || 'U1IH8T6UoQxf';
  const access_token = process.env.E1688_ACCESS_TOKEN || process.env.E1688_ACCESSTOKEN || '793b6857-359d-494b-bc2b-e3b37bc87c12';
  const apiBaseUrl = process.env.E1688_API_BASE_URL || 'https://gw.open.1688.com/openapi/';
  const uriPath = process.env.E1688_URI_PATH || 'param2/1/com.alibaba.fenxiao.crossborder/category.translation.getById/9077165';

  try {
    const result = await callCategoryById({ apiBaseUrl, uriPath, categoryId, access_token, appSecret });
    console.log('\n--- 1688 API Response (parsed JSON) ---');
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    if (err.response) {
      console.error('HTTP error status:', err.response.status);
      console.error('Response data:', err.response.data);
    } else {
      console.error('Request error:', err.message || err);
    }
    process.exit(2);
  }
}

if (require.main === module) main();
