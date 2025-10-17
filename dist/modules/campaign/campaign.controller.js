"use strict";
// import { Request, Response, NextFunction } from 'express';
// import catchError from '../../middleware/errors/catchError';
// import { responseHandler } from '../../utils/responseHandler';
// import withTransaction from '../../middleware/transactions/withTransaction';
// import CampaignService from './campaign.service';
// class CampaignController {
//   // Create a campaign item
//   createCampaign = withTransaction(async (req: Request, res: Response, next: NextFunction, session: any) => {
//     const payload = {
//       name: req.body.name,
//       couponRef: req.body.couponRef,
//     };
//     const campaignResult = await CampaignService.createCampaign(payload, session);
//     const resDoc = responseHandler(
//       201,
//       'Campaign Created successfully',
//       campaignResult
//     );
//     res.status(resDoc.statusCode).json(resDoc);
//   });
//   getAllCampaign = catchError(async (req: Request, res: Response) => {
//     const campaignResult = await CampaignService.getAllCampaign();
//     const resDoc = responseHandler(200, 'Get All Campaigns', campaignResult);
//     res.status(resDoc.statusCode).json(resDoc);
//   });
//   getCampaignWithPagination = catchError(async (req: Request, res: Response) => {
//     let payload = {
//       limit: req.query.limit,
//       page: req.query.page,
//       order: req.query.order,
//     };
//     const campaign = await CampaignService.getCampaignWithPagination(payload);
//     const resDoc = responseHandler(200, 'Campaigns get successfully', campaign);
//     res.status(resDoc.statusCode).json(resDoc);
//   });
//   getSingleCampaign = catchError(async (req: Request, res: Response) => {
//     const id = req.params.id;
//     const campaignResult = await CampaignService.getSingleCampaign(id);
//     const resDoc = responseHandler(201, 'Single Campaign successfully', campaignResult);
//     res.status(resDoc.statusCode).json(resDoc);
//   });
//   updateCampaign = catchError(async (req: Request, res: Response) => {
//     const id = req.params.id;
//     const payload = {
//       name: req.body.name,
//       couponRef: req.body.couponRef,
//     };
//     await CampaignService.updateCampaign(id, payload);
//     const resDoc = responseHandler(201, 'Campaign Update successfully');
//     res.status(resDoc.statusCode).json(resDoc);
//   });
//   // Delete a campaign item
//   deleteCampaign = catchError(async (req: Request, res: Response) => {
//     const id = req.params.id;
//     await CampaignService.deleteCampaign(id);
//     const resDoc = responseHandler(200, 'Campaign Deleted successfully');
//     res.status(resDoc.statusCode).json(resDoc);
//   });
// }
// export default new CampaignController();
