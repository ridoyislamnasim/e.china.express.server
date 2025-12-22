import { NextFunction, Request, Response } from "express";
import policiesService from "./policies.service";
import { responseHandler } from "../../utils/responseHandler";
import catchError from "../../middleware/errors/catchError";
import withTransaction from "../../middleware/transactions/withTransaction";

export default new (class PoliciesController {
  getAllPolicyTitles = catchError(async (req: Request, res: Response) => {
    const getAllPolicies = await policiesService.getAllPolicyTitles();
    const getAllPoliciesCount = await policiesService.getAllPoliciesCount();
    const resDoc = responseHandler(201, "All policies fetched successfully.", { data: getAllPolicies, count: getAllPoliciesCount });
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllPolicyTableView = catchError(async (req: Request, res: Response) => {
    const payload = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      order: (req.query.order as "asc" | "desc") || "desc",
    };

    const policies = await policiesService.getAllPolicyTableView(payload);

    const resDoc = responseHandler(200, "All policies fetched successfully.", policies);

    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllPolicyTypes = catchError(async (req: Request, res: Response) => {
    const allPolicyTypes = await policiesService.getAllPolicyTypes();
    const resDoc = responseHandler(201, "All policy types fetched successfully.", allPolicyTypes);
    res.status(resDoc.statusCode).json(resDoc);
  });


  deletePolicyType = catchError(async(req:Request,res:Response)=>{
    const slug = req.params.slug;
    const result = await policiesService.deletePolicyType(slug);
    
    const resDoc = responseHandler(200, "Policy fetched successfully.", result);
    res.status(resDoc.statusCode).json(resDoc);
  })













  getPolicyById = catchError(async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const policy = await policiesService.getPolicyById(slug);

    const resDoc = responseHandler(200, "Policy fetched successfully.", policy);
    res.status(resDoc.statusCode).json(resDoc);
  });

  createPolicy = catchError(async (req: Request, res: Response) => {
    const newPolicy = await policiesService.createPolicy(req.body);

    const resDoc = responseHandler(201, "New policy created successfully.", newPolicy);
    res.status(resDoc.statusCode).json(resDoc);
  });

  createPolicyType = catchError(async (req: Request, res: Response) => {
    const newPolicyType = await policiesService.createPolicyType(req.body);

    const resDoc = responseHandler(201, "New policy type created successfully.", newPolicyType);
    res.status(resDoc.statusCode).json(resDoc);
  });

  updatePolicy = catchError(async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const { title, description, policyTypeId, policyTypeTitle, id } = req.body;
    const payload = { title, description, policyTypeId, policyTypeTitle, id };
    const updated = await policiesService.updatePolicy(slug, payload);

    const resDoc = responseHandler(200, "Policy updated successfully.", updated);
    res.status(resDoc.statusCode).json(resDoc);
  });

  deletePolicy = catchError(async (req: Request, res: Response) => {
    const id = req.params.slug;
    await policiesService.deletePolicy(id);

    const resDoc = responseHandler(200, `Policy with id ${id} deleted successfully.`, null);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getPolicesWithPagination = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const data = await policiesService.getPolicesWithPagination({ page, limit }, tx);

    const resDoc = responseHandler(200, "Policies retrieved successfully with pagination.", data);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getPolicyTypesWithPagination = withTransaction(async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const data = await policiesService.getPolicyTypesWithPagination({ page, limit });

    const resDoc = responseHandler(200, "Policy types retrieved successfully with pagination.", data);
    res.status(resDoc.statusCode).json(resDoc);
  });

  addHelpfulCount = catchError(async (req: Request, res: Response) => {
    const { id } = req.body;
    // res.send(id)
    const result = await policiesService.addHelpfulCount(id);

    const resDoc = responseHandler(200, "Policy Counted as helpful.", result);
    res.status(resDoc.statusCode).json(resDoc);
  });

  addUnhelpfulCount = catchError(async (req: Request, res: Response) => {
    const { id } = req.body;
    // res.send(id)
    const result = await policiesService.addUnhelpfulCount(id);

    const resDoc = responseHandler(200, "Policy Counted as unhelpful.", result);
    res.status(resDoc.statusCode).json(resDoc);
  });
})();
