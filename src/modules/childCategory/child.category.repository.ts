// import { Model, Document, ClientSession } from 'mongoose';
// import { pagination } from '../../utils/pagination';
// import { BaseRepository } from '../base/base.repository';

// export interface ChildCategoryDoc extends Document {
//   name: string;
//   status: boolean;
//   slug: string;
//   viewType?: string;
//   subCategoryRef: string;
//   // add other fields as needed
// }

// const validViewTypes = ['top', 'middle', 'lowerMiddle', 'buttom'];

// class ChildCategoryRepository extends BaseRepository<ChildCategoryDoc> {
//   private model: Model<ChildCategoryDoc>;
//   constructor(model: Model<ChildCategoryDoc>) {
//     super(model);
//     this.model = model;
//   }

//   async createChildCategory(payload: Partial<ChildCategoryDoc>, session?: ClientSession) {
//     const { viewType } = payload;
//     if (viewType) {
//       // Uncomment to enforce viewType validation
//       // if (!validViewTypes.includes(viewType)) {
//       //   throw new Error('Invalid viewType provided');
//       // }
//       // await this.model.findOneAndUpdate(
//       //   { viewType },
//       //   { viewType: '' },
//       //   { new: true, session }
//       // );
//     }
//     const newChildCategory = await this.model.create([payload], { session });
//     return newChildCategory;
//   }

//   async updateChildCategory(id: string, payload: Partial<ChildCategoryDoc>, session?: ClientSession) {
//     const { viewType } = payload;
//     if (viewType) {
//       if (!validViewTypes.includes(viewType)) {
//         throw new Error('Invalid viewType provided');
//       }
//       // await this.model.findOneAndUpdate(
//       //   { viewType },
//       //   { viewType: '' },
//       //   { new: true, session }
//       // );
//     }
//     const updatedChildCategory = await this.model.findByIdAndUpdate(
//       id,
//       payload
//     );
//     if (!updatedChildCategory) {
//       throw new Error('Child Category not found By Id');
//     }
//     return updatedChildCategory;
//   }

//   async getAllChildCategory(payload: any) {
//     const { viewType, limit } = payload;
//     let query: any = {};
//     if (viewType) {
//       if (!validViewTypes.includes(viewType)) {
//         throw new Error('Invalid viewType provided');
//       }
//       query = { viewType };
//     }
//     const childCategorys = await this.model
//       .find(query)
//       .limit(limit)
//       .sort({ createdAt: -1 })
//       .populate('subCategoryRef');
//     return childCategorys;
//   }

//   async getChildCategoryWithPagination(payload: any) {
//     try {
//       const childCategorys = await pagination(
//         payload,
//         async (limit: number, offset: number, sortOrder: any) => {
//           const childCategorys = await this.model
//             .find({})
//             .sort({ createdAt: sortOrder })
//             .skip(offset)
//             .limit(limit)
//             .populate('subCategoryRef');
//           const totalChildCategory = await this.model.countDocuments();
//           return { doc: childCategorys, totalDoc: totalChildCategory };
//         }
//       );
//       return childCategorys;
//     } catch (error) {
//       console.error('Error getting childCategorys with pagination:', error);
//       throw error;
//     }
//   }
// }

// // You must import your ChildCategorySchema from the correct path
// import { ChildCategorySchema } from '../../models/index';
// import mongoose from 'mongoose';

// const ChildCategoryModel = mongoose.model<ChildCategoryDoc>('ChildCategory', ChildCategorySchema);

// export default new ChildCategoryRepository(ChildCategoryModel);
