import { NextFunction, Request, Response } from "express";
import policiesService from "./policies.service";
import { responseHandler } from "../../utils/responseHandler";
import catchError from "../../middleware/errors/catchError";
import withTransaction from "../../middleware/transactions/withTransaction";

export default new class PoliciesController {

  


  getAllPolicyTitles = catchError(async (req: Request, res: Response) => {
    const getAllPolicies = await policiesService.getAllPolicyTitles();
    res.send(getAllPolicies);
  });

  getPolicyById = catchError(async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const policy = await policiesService.getPolicyById(slug);
    res.send(policy);
  });

  createPolicy = catchError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newPolicy = await policiesService.createPolicy(req.body);
      const resDoc = responseHandler(201, "New Policy Created Successfully.", newPolicy);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  });

  createPolicyType = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const newPolicyType = await policiesService.createPolicyType(req.body);
    const resDoc = responseHandler(201, "New Policy Type Created Successfully.", newPolicyType);
    res.status(resDoc.statusCode).json(resDoc);
  });

  updatePolicy = catchError(async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const body = req.body;
    const updatedPolicy = await policiesService.updatePolicy(slug, body);
    const resDoc = responseHandler(201, "Policy Updated Successfully.", updatedPolicy);
    res.status(resDoc.statusCode).json(resDoc);
  });

  deletePolicy = catchError(async (req: Request, res: Response) => {
    const id = req.params.slug;

    await policiesService.deletePolicy(id);
    const resDoc = responseHandler(200, `Policy with id ${id} deleted successfully`, null);
    res.status(resDoc.statusCode).json(resDoc);
  });


  getPolicesWithPagination = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const payload = { page, limit };
      const countries = await policiesService.getPolicesWithPagination(payload, tx);
      const resDoc = responseHandler(200, 'Countries retrieved successfully with pagination', countries);
      res.status(resDoc.statusCode).json(resDoc);
  });


};
