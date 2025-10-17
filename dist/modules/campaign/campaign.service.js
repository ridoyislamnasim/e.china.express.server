"use strict";
// import { NotFoundError } from '../../utils/errors';
// import { BaseService } from '../base/base.service';
// import campaignRepository from './campaign.repository';
// export class CampaignService extends BaseService<typeof campaignRepository> {
//   private repository: typeof campaignRepository;
//   constructor(repository: typeof campaignRepository, serviceName: string) {
//     super(repository, serviceName);
//     this.repository = repository;
//   }
//   async createCampaign(payload: any, session?: any) {
//     const { name, couponRef } = payload;
//     if (!name || !couponRef) {
//       throw new Error('Name and coupon are required fields.');
//     }
//     let campaignData = await this.repository.createCampaign(payload, session);
//     return campaignData;
//   }
//   async getAllCampaign() {
//     return await this.repository.findAll({}, ['couponRef']);
//   }
//   async getCampaignWithPagination(payload: any) {
//     const campaign = await this.repository.getCampaignWithPagination(payload);
//     return campaign;
//   }
//   async getSingleCampaign(id: string) {
//     const campaignData = await this.repository.findById(id, ['couponRef']);
//     if (!campaignData) throw new NotFoundError('Campaign Not Find');
//     return campaignData;
//   }
//   async updateCampaign(id: string, payload: any) {
//     const { name, couponRef } = payload;
//     if (!name || !couponRef) {
//       throw new Error('Name and coupon are required fields.');
//     }
//     const campaignData = await this.repository.updateCampaign(id, payload);
//     return campaignData;
//   }
//   async deleteCampaign(id: string) {
//     const campaign = await this.repository.findById(id);
//     if (!campaign) throw new NotFoundError('Campaign not found');
//     const deletedCampaign = await this.repository.deleteById(id);
//     return deletedCampaign;
//   }
// }
// export default new CampaignService(campaignRepository, 'campaign');
