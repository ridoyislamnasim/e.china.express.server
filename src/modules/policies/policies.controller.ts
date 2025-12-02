import { Request, Response } from "express";
import policiesService from "./policies.service";

export default new class PoliciesController {
  
  
  
  
  
  
  
  
  
  
  
  
  getAllPolicyTitles = async (req: Request, res: Response) => {
    const getAllPolicies = await policiesService.getAllPolicyTitles();
    res.send(getAllPolicies);
  };








  getPolicyById = async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const policy = await policiesService.getPolicyById(slug);
    res.send(policy);
  }















  createPolicy = async (req: Request, res: Response) => {
    const newPolicy = await policiesService.createPolicy(req.body);
    res.send("Create a new policy");
  };














  updatePolicy = async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const body = req.body;
    const updatedPolicy = await policiesService.updatePolicy(slug,body);
    res.send(updatedPolicy);
  };













  deletePolicy = async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const deletedPolicy = await policiesService.deletePolicy(slug);
    res.send(deletedPolicy);
  };



};
