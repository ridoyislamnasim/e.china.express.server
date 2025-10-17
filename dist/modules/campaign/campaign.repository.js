"use strict";
// import { Model, Document, ClientSession } from 'mongoose';
// import { pagination } from '../../utils/pagination';
// import { BaseRepository } from '../base/base.repository';
// export interface CampaignDoc extends Document {
//   name: string;
//   couponRef: string;
//   userRef?: string;
//   productRef?: string;
//   inventoryRef?: string;
//   quantity?: number;
//   // add other fields as needed
// }
// class CampaignRepository extends BaseRepository<CampaignDoc> {
//   private model: Model<CampaignDoc>;
//   constructor(model: Model<CampaignDoc>) {
//     super(model);
//     this.model = model;
//   }
//   async createCampaign(payload: Partial<CampaignDoc>, session?: ClientSession) {
//     const newCampaign = await this.model.create([payload], { session });
//     return newCampaign;
//   }
//   async findCampaignByUserAndProduct(userRef: string, productRef: string, inventoryRef: string) {
//     return await this.model.findOne({ userRef, productRef, inventoryRef });
//   }
//   async updateCampaign(id: string, payload: Partial<CampaignDoc>) {
//     const updatedCampaign = await this.model.findByIdAndUpdate(id, payload);
//     if (!updatedCampaign) {
//       throw new Error('campaign not found');
//     }
//     return updatedCampaign;
//   }
//   async updateCampaignQuantity(campaignId: string, quantity: number) {
//     return await this.model.findByIdAndUpdate(
//       campaignId,
//       { $set: { quantity } },
//       { new: true }
//     );
//   }
//   async getCampaignWithPagination(payload: any) {
//     try {
//       const campaigns = await pagination(
//         payload,
//         async (limit: number, offset: number, sortOrder: any) => {
//           const campaigns = await this.model
//             .find({ userRef: payload.userId })
//             .sort({ createdAt: sortOrder })
//             .skip(offset)
//             .limit(limit)
//             .populate('couponRef');
//           const totalCampaign = await this.model.countDocuments();
//           return { doc: campaigns, totalDoc: totalCampaign };
//         }
//       );
//       return campaigns;
//     } catch (error) {
//       console.error('Error getting campaigns with pagination:', error);
//       throw error;
//     }
//   }
// }
// // You must import your CampaignSchema from the correct path
// import { CampaignSchema } from '../../models/index';
// import mongoose from 'mongoose';
// const CampaignModel = mongoose.model<CampaignDoc>('Campaign', CampaignSchema);
// export default new CampaignRepository(CampaignModel);
