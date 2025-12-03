"use strict";
// import config from '../../config/config';
// import e1688 from '../../utils/e1688';
// export async function search1688Products(payload: { q?: string; page?: any; limit?: any }) {
//   try {
//     const q = String(payload.q ?? '');
//     const page = Number(payload.page ?? 1);
//     const limit = Number(payload.limit ?? 20);
//     const appSecret = config.e1688AppSecret || '';
//     const access_token = config.e1688AccessToken || '';
//     const apiBaseUrl = config.e1688ApiBaseUrl || 'https://gw.open.1688.com/openapi/';
//     const uriPath = config.e1688UriPath || 'param2/1/com.alibaba.fenxiao.crossborder/product.search.queryProductDetail/9077165';
//     const searchParamObj: Record<string, string> = {
//       access_token,
//       keywords: q,
//       page: String(page),
//       pageSize: String(limit),
//     };
//     console.log('1688 Search Params:', searchParamObj);
//     console.log('Using 1688 API Base URL:', apiBaseUrl);
//     console.log('Using 1688 URI Path:', uriPath);
//     console.log('Using 1688 App Secret:', appSecret);
//     const data = await e1688.call1688(apiBaseUrl, uriPath, searchParamObj, appSecret);
//     return { page, limit, data };
//   } catch (error) {
//     throw error;
//   }
// }
// export default { search1688Products };
