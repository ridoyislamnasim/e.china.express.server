"use strict";
// import { NotFoundError } from '../../utils/errors';
// import { BaseService } from '../base/base.service';
// import childCategoryRepository from './child.category.repository';
// import { removeUploadFile } from '../../middleware/upload/removeUploadFile';
// import ImgUploader from '../../middleware/upload/ImgUploder';
// export class ChildCategoryService extends BaseService<typeof childCategoryRepository> {
//   private repository: typeof childCategoryRepository;
//   constructor(repository: typeof childCategoryRepository, serviceName: string) {
//     super(repository, serviceName);
//     this.repository = repository;
//   }
//   async createChildCategory(payloadFiles: any, payload: any, session?: any) {
//     const { files } = payloadFiles;
//     if (files?.length) {
//       const images = await ImgUploader(files);
//       for (const key in images) {
//         payload[key] = images[key];
//       }
//     }
//     const childCategoryData = await this.repository.createChildCategory(payload, session);
//     return childCategoryData;
//   }
//   async getAllChildCategory(payload: any) {
//     return await this.repository.getAllChildCategory(payload);
//   }
//   async getChildCategoryWithPagination(payload: any) {
//     const childCategory = await this.repository.getChildCategoryWithPagination(payload);
//     return childCategory;
//   }
//   async getSingleChildCategory(id: string) {
//     const childCategoryData = await this.repository.findById(id, ['subCategoryRef']);
//     if (!childCategoryData) throw new NotFoundError('ChildCategory Not Find');
//     return childCategoryData;
//   }
//   async getSingleChildCategoryWithSlug(slug: string) {
//     const childCategoryData = await this.repository.findOne({ slug: slug }, ['subCategoryRef']);
//     if (!childCategoryData) throw new NotFoundError('ChildCategory Not Find');
//     return childCategoryData;
//   }
//   async updateChildCategory(id: string, payloadFiles: any, payload: any, session?: any) {
//     const { files } = payloadFiles;
//     if (files?.length) {
//       const images = await ImgUploader(files);
//       for (const key in images) {
//         payload[key] = images[key];
//       }
//     }
//     // Update the database with the new data
//     const childCategoryData = await this.repository.updateChildCategory(id, payload, session);
//     // Remove old files if they’re being replaced
//     if (files?.length && childCategoryData.image) {
//       // console.log('run thoids upload reload', childCategoryData?.image);
//       await removeUploadFile(childCategoryData?.image);
//     }
//     return childCategoryData;
//   }
//   async updateChildCategoryStatus(id: string, status: any) {
//     if (!status) throw new NotFoundError('Status is required');
//     const boolStatus = status === true || status === 'true';
//     const childCategory = await this.repository.updateChildCategoryStatus(id, { status: boolStatus });
//     if (!childCategory) throw new NotFoundError('ChildCategory not found');
//     return childCategory;
//   }
//   async deleteChildCategory(id: string) {
//     const childCategory = await this.repository.findById(id);
//     if (!childCategory) throw new NotFoundError('ChildCategory not found');
//     const deletedChildCategory = await this.repository.deleteById(id);
//     // if (deletedChildCategory) {
//     //   await removeUploadFile(childCategory?.image);
//     // }
//     return deletedChildCategory;
//   }
// }
// export default new ChildCategoryService(childCategoryRepository, 'childCategory');
