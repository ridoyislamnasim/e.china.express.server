import { Request, Response } from "express";
import policiesService from "./policies.service";

export default new (class PoliciesController {
  
  
  
  
  
  
  
  
  
  
  
  
  getAllPolicies = async (req: Request, res: Response) => {
    const getAllPolicies = await policiesService.getAllPolicies();
    res.send(getAllPolicies);
  };











  getPolicyById = async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const policy = await policiesService.getPolicyById(slug);
    res.send(policy);
  }















  createPolicy = async (req: Request, res: Response) => {
    res.send("Create a new policy");
  };














  updatePolicy = async (req: Request, res: Response) => {
    const id = req.params.id;
    res.send(`Update policy with ID: ${id}`);
  };













  deletePolicy = async (req: Request, res: Response) => {
    const id = req.params.id;
    res.send(`Delete policy with ID: ${id}`);
  };
})();
