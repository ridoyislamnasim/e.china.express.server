import { NotFoundError } from '../../utils/errors';
import BaseService from '../base/base.service';
import subCategoryRepository from './sub.category.repository';
// import { removeUploadFile } from '../../middleware/upload/removeUploadFile';
import ImgUploader from '../../middleware/upload/ImgUploder';
import { slugGenerate } from '../../utils/slugGenerate';

export class SubCategoryService  {
  protected repository: typeof subCategoryRepository;
  constructor(repository: typeof subCategoryRepository) {
    this.repository = repository;
  }

  async createSubCategory(payloadFiles: any, payload: any, tx?: any) {
    const { files } = payloadFiles;
    // file is required for subCategory creation
    if (!files || !files.length) {
      const error = new Error('Files are required for subCategory creation');
      (error as any).statusCode = 400;
      throw error;
    }
    // name and categoryRef are required
    if (!payload.name || !payload.categoryRef) {
      const error = new Error('Name and categoryRef are required');
      (error as any).statusCode = 400;
      throw error;
    }
    if (files?.length) {
      const images = await ImgUploader(files);
      for (const key in images) {
        payload[key] = images[key];
      }
    }
    payload.slug = slugGenerate(payload.name);
    const subCategoryData = await this.repository.createSubCategory(payload, tx);
    return subCategoryData;
  }

  async getAllSubCategory() {
    return await this.repository.getAllSubCategory();
  }

  async getSubCategoryWithPagination(payload: any) {
    const subCategory = await this.repository.getSubCategoryWithPagination(payload);
    return subCategory;
  }

  async getSingleSubCategory(slug: string) {
    const subCategoryData = await this.repository.getSingleSubCategory(slug, { categoryRef: true });
    if (!subCategoryData) {
      const error = new Error('SubCategory Not Find');
      (error as any).statusCode = 404;
      throw error;
    }
    return subCategoryData;
  }

//   async getSingleSubCategoryWithSlug(slug: string) {
//     const subCategoryData = await this.repository.findOne({ slug: slug }, ['categoryRef']);
//     if (!subCategoryData) throw new NotFoundError('SubCategory Not Find');
//     return subCategoryData;
//   }

  async updateSubCategory(slug: string, payloadFiles: any, payload: any, tx?: any) {
    const { files } = payloadFiles;
    if (files?.length) {
      const images = await ImgUploader(files);
      for (const key in images) {
        payload[key] = images[key];
      }
    }
    // Update the database with the new data
    if (payload.name) {
      payload.slug = slugGenerate(payload.name);
    }
    const subCategoryData = await this.repository.updateSubCategory(slug, payload, tx);
    // Remove old files if they’re being replaced
    if (files?.length && subCategoryData) {
      // console.log('run thoids upload reload', subCategoryData?.image);
    //   await removeUploadFile(subCategoryData?.image);
    }
    return subCategoryData;
  }

//   async updateSubCategoryStatus(slug: string, status: any) {
//     if (!status) throw new NotFoundError('Status is required');
//     const boolStatus = status === true || status === 'true';
//     const subCategory = await this.repository.updateSubCategoryStatus(slug, { status: boolStatus });
//     console.log('subCategory', subCategory);
//     if (!subCategory) throw new NotFoundError('SubCategory not found');
//     return subCategory;
//   }

  async deleteSubCategory(slug: string) {
    const deletedSubCategory = await this.repository.deleteSubCategory(slug);

    if (deletedSubCategory ) {
    //   await removeUploadFile(subCategory?.image);
    }
    return deletedSubCategory;
  }
}

export default new SubCategoryService(subCategoryRepository);
