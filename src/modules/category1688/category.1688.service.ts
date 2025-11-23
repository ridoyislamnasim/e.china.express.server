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

  async getAllCategory1688() {
      return await this.repository.getAllCategory1688();
    }

  async getCategoryIdBySubcategory(payload: any): Promise<any> {
    const { categoryId } = payload;
    const subcategories = await this.repository.getCategoryIdBySubcategory(categoryId);
    if (!subcategories) {
      throw new NotFoundError(`No subcategories found for categoryId ${categoryId}`);
    }
    return subcategories;
  }
  async addCategoryForRateCalculation(payload: any): Promise<any> {
    const { categoryId } = payload;
    const category = await this.repository.getCategoryByCategoryId(categoryId); 
    if (!category) {
      throw new NotFoundError(`Category with categoryId ${categoryId} not found`);
    }
    // Update the isRateCategory flag to true
    const updatedCategory = await this.repository.updateCategoryRateFlagToggle(categoryId, !category.isRateCategory);
    return updatedCategory;
  }

  async getAllCategory1688ForRateCalculation(): Promise<any> {
    return await this.repository.getCategoriesForRateCalculation();
  }

  // HS Code Entry Services
  async createHsCodeEntryByCategoryId(payload: any): Promise<any> {
    const { id, globalHsCodes, chinaHsCodes, globalMaterialComment, countryHsCode } = payload;
    const category = await this.repository.getCategoryById(id); 
    console.log('Fetched category:', category);
    if (!category) {
      throw new NotFoundError(`Category with categoryId ${id} not found`);
    }
    // Create HS Code Entry
    const hsCodeEntry = await this.repository.createHsCodeEntry(id, globalHsCodes, chinaHsCodes, globalMaterialComment);
    console.log('Created HS Code Entry:', countryHsCode);

    for (const countryCode of countryHsCode) {
      await this.repository.createCountryHsCodeEntry(id, countryCode.countryId, countryCode.hsCodes);
    }
    return hsCodeEntry;
  }

  async getHsCodeEntryByCategoryId(payload: any): Promise<any> {
    const { id } = payload;
    const hsCodeEntry = await this.repository.getHsCodeEntryByCategoryId(id);
    if (!hsCodeEntry) {
      throw new NotFoundError(`HS Code Entry for Category ID ${id} not found`);
    }
    return hsCodeEntry;
  }
}

export default new Category1688Service(category1688Repository);
