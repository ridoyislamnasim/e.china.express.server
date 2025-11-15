import { NotFoundError } from '../../utils/errors';
// import { BaseService } from '../base/base.service';
import category1688Repository from './category.1688.repository';
import ImgUploader from '../../middleware/upload/ImgUploder';
import { slugGenerate } from '../../utils/slugGenerate';
import e1688 from '../../utils/e1688Category';
import config from '../../config/config';
import { process1688ProductDetailTest } from '../../utils/1688ProcessedataTest';


// import { removeUploadFile } from '../../middleware/upload/removeUploadFile';

export class Category1688Service {
  private repository: typeof category1688Repository;
  constructor(repository: typeof category1688Repository) {
    this.repository = repository;
  }

  async createCategory1688() {
    const cid = Number(0);
    const appSecret = config.e1688AppSecret || 'U1IH8T6UoQxf';
    const access_token = config.e1688AccessToken || '793b6857-359d-494b-bc2b-e3b37bc87c12';

    const apiBaseUrl = config.e1688ApiBaseUrl || 'https://gw.open.1688.com/openapi/';
    const uriPath = 'param2/1/com.alibaba.fenxiao.crossborder/category.translation.getById/9077165';

    // Use the category-specific helper to prepare and call the API
    const responseData = await e1688.callCategoryById(apiBaseUrl, uriPath, cid, access_token, appSecret);

    // Response shape varies; try common locations
    const results = responseData?.result?.result?.children;
    for (const result of results) {
      const categoryIdChild = result?.categoryId;
      await this.repository.createOrUpdateCategory1688From1688Data(result);
      const responseData = await e1688.callCategoryById(apiBaseUrl, uriPath, categoryIdChild, access_token, appSecret);
      const resultsChild = responseData?.result?.result?.children;
      // af first check is array  resultsChild
      if (Array.isArray(resultsChild)) {
        for (const resultChild of resultsChild) {

          const categoryIdSubChild = resultChild?.categoryId;
          // console.log('Processing child categoryId:', categoryIdChild);
          await this.repository.createOrUpdateCategory1688From1688Data(resultChild);
          const responseDataSubChild = await e1688.callCategoryById(apiBaseUrl, uriPath, categoryIdSubChild, access_token, appSecret);
          const resultsSubChild = responseDataSubChild?.result?.result?.children;
          // check aarray  resultsSubChild
          if (Array.isArray(resultsSubChild)) {
            for (const resultSubChild of resultsSubChild) {
              await this.repository.createOrUpdateCategory1688From1688Data(resultSubChild);
            }
          }
        }
      }  
    }
     return results;
    }


      // async process1688ProductDetailTest(payload: any) {
      //   try {
      //     const categoryId = 0; // your product / offer ID
      //     console.log('Fetching 1688 product details for categoryId:', categoryId);
      //     // === Setup Required Values (from config with sensible fallbacks) ===
      //     const appSecret = config.e1688AppSecret || "U1IH8T6UoQxf";
      //     const access_token = config.e1688AccessToken || "793b6857-359d-494b-bc2b-e3b37bc87c12";
      //     const offerId = categoryId || config.e1688DefaultOfferId || "714232053871";

      //     // === API endpoint & URI path ===
      //     const apiBaseUrl = config.e1688ApiBaseUrl || "https://gw.open.1688.com/openapi/";
      //     const uriPath = config.e1688UriPath || "param2/1/com.alibaba.fenxiao.crossborder/product.search.queryProductDetail/9077165";

      //     // === Request parameters ===
      //     const offerDetailParam = JSON.stringify({
      //       offerId,
      //       country: "en",
      //     });

      //     const params: Record<string, string> = {
      //       access_token,
      //       offerDetailParam,
      //     };

      //     // Use shared util to call 1688 API (generates signature and sends request)
      //     const responseData = await e1688.call1688(apiBaseUrl, uriPath, params, appSecret);

  async getAllCategory1688() {
      return await this.repository.getAllCategory1688();
    }

  async getCategory1688WithPagination(payload: any) {
      return await this.repository.getCategory1688WithPagination(payload);
    }

  async getSingleCategory1688(slug: string) {
      const category1688Data = await this.repository.getCategory1688ById(slug);
      // if (!category1688Data) throw new NotFoundError('Category1688 Not Found');
      return category1688Data;
    }

  async getSingleCategory1688WithSlug(slug: string) {
      const category1688Data = await this.repository.getCategory1688BySlug(slug);
      // if (!category1688Data) throw new NotFoundError('Category1688 Not Found');
      return category1688Data;
    }

  async getNavBar() {
      console.log('Fetching Navbar Data...');
      const navbarData = await this.repository.getNavBar();
      console.log('Navbar Data:', navbarData);
      // if (!navbarData) throw new NotFoundError('Navbar Not Found');
      return navbarData;
    }

  // Fetch raw category data from 1688 without DB upsert
  async fetchCategoryFrom1688(categoryId ?: number) {
      // const cid = Number(categoryId ?? 10);
      // const appSecret = config.e1688AppSecret || 'U1IH8T6UoQxf';
      // const access_token = config.e1688AccessToken || '793b6857-359d-494b-bc2b-e3b37bc87c12';
      // const apiBaseUrl = config.e1688ApiBaseUrl || 'https://gw.open.1688.com/openapi/';
      // const uriPath = config.e1688UriPath || 'param2/1/com.alibaba.fenxiao.crossborder/category.translation.getById/9077165';
      // // Prepare signature and body (mirrors Postman pre-request)
      // const prepared = e1688.prepareCategoryRequest(apiBaseUrl, uriPath, cid, access_token, appSecret);

      // // Perform the POST using the prepared body/finalUrl so we can return both prepared and response
      // const axios = require('axios');
      // const response = await axios.post(prepared.finalUrl, prepared.body, {
      //   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      //   timeout: 30000,
      // });

      // return { prepared, response: response.data };
    }

  async updateCategory1688(slug: string, payloadFiles: any, payload: any) {
      const { files } = payloadFiles || {};
      let oldCategory1688 = null;
      if (files?.length) {
        oldCategory1688 = await this.repository.getCategory1688ById(slug);
        const images = await ImgUploader(files);
        for (const key in images) {
          payload[key] = images[key];
        }
      }
      const category1688Data = await this.repository.updateCategory1688(slug, payload);
      // Remove old files if replaced
      if (files?.length && oldCategory1688) {
        // await removeUploadFile(oldCategory1688.image);
      }
      return category1688Data;
    }

  async updateCategory1688Status(slug: string, status: any) {
      if (!status) throw new NotFoundError('Status is required');
      // status = status === 'true';
      return await this.repository.updateCategory1688(slug, { status });
    }

  async deleteCategory1688(slug: string) {
      // TODO: Remove files if needed
      return await this.repository.deleteCategory1688(slug); // Or use a delete method
    }
  }

export default new Category1688Service(category1688Repository);
