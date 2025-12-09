import { NextFunction, Request, Response } from "express";
import policiesService from "./policies.service";
import { responseHandler } from "../../utils/responseHandler";
import catchError from "../../middleware/errors/catchError";
import withTransaction from "../../middleware/transactions/withTransaction";

export default new class PoliciesController {



  getAllPolicyTitles = catchError(async (req: Request, res: Response) => {
    const getAllPolicies = await policiesService.getAllPolicyTitles();
    // res.send(getAllPolicies);
    const resDoc = responseHandler(201, 'All policies fetched successfully.', getAllPolicies);
    res.status(resDoc.statusCode).json(resDoc);
  });

getPolicyById = catchError(async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const policy = await policiesService.getPolicyById(slug);

  const resDoc = responseHandler(200, 'Policy fetched successfully.', policy);
  res.status(resDoc.statusCode).json(resDoc);
});

createPolicy = catchError(async (req: Request, res: Response) => {
  const newPolicy = await policiesService.createPolicy(req.body);

  const resDoc = responseHandler(201, 'New policy created successfully.', newPolicy);
  res.status(resDoc.statusCode).json(resDoc);
});

createPolicyType = catchError(async (req: Request, res: Response) => {
  const newPolicyType = await policiesService.createPolicyType(req.body);

  const resDoc = responseHandler(201, 'New policy type created successfully.', newPolicyType);
  res.status(resDoc.statusCode).json(resDoc);
});

updatePolicy = catchError(async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const updated = await policiesService.updatePolicy(slug, req.body);

  const resDoc = responseHandler(200, 'Policy updated successfully.', updated);
  res.status(resDoc.statusCode).json(resDoc);
});

deletePolicy = catchError(async (req: Request, res: Response) => {
  const id = req.params.slug;
  await policiesService.deletePolicy(id);

  const resDoc = responseHandler(200, `Policy with id ${id} deleted successfully.`, null);
  res.status(resDoc.statusCode).json(resDoc);
});

getPolicesWithPagination = withTransaction(
  async (req: Request, res: Response, next: NextFunction, tx: any) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await policiesService.getPolicesWithPagination({ page, limit }, tx);

    const resDoc = responseHandler(200, 'Policies retrieved successfully with pagination.', result);
    res.status(resDoc.statusCode).json(resDoc);
  }
);


addHelpfulCount = catchError(async(req:Request,res:Response)=>{
  const {id} = req.body
  // res.send(id)
    const result = await policiesService.addHelpfulCount(id);

    const resDoc = responseHandler(200, 'Policy Counted as helpful.', result);
    res.status(resDoc.statusCode).json(resDoc);

})

addUnhelpfulCount = catchError(async (req: Request, res: Response) => {
  const { id } = req.body
  // res.send(id)
  const result = await policiesService.addUnhelpfulCount(id);

  const resDoc = responseHandler(200, 'Policy Counted as unhelpful.', result);
  res.status(resDoc.statusCode).json(resDoc);
})



};
