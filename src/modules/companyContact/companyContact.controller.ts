import { NextFunction, Request, Response } from "express";
import catchError from "../../middleware/errors/catchError";
import companyContactService from "./companyContact.service";
import { ContactMessage } from "../../types/contact-us.interface";
import { responseHandler } from "../../utils/responseHandler";

class CompanyContactController {
  private companyContactService = new companyContactService();

  createCompanyContact = catchError(async (req: Request, res: Response, next: NextFunction) => {
    try {

      const { id, phones, email, businessHourStart, businessHourEnd, emergencyHotlines, facebook, twitter, linkedin, instagram, youtube,tiktok } = req.body;
      console.log("🚀 ~ companyContact.controller.ts:14 ~ CompanyContactController ~ req.body:", req.body)
      if (!email) {
        return res.status(400).json({
          message: "Email is required",
        });
      }

      if (!phones ) {
        return res.status(400).json({
          message: "At least one phone number is required",
        });
      }

      if (!businessHourStart || !businessHourEnd) {
        return res.status(400).json({
          message: "Business hour start and end time are required",
        });
      }

      if (!emergencyHotlines ) {
        return res.status(400).json({
          message: "At least one emergency hotline is required",
        });
      }

      const payload = {
        phones,
        email,
        businessHourStart,
        businessHourEnd,
        emergencyHotlines,
        facebook,
        twitter,
        linkedin,
        instagram,
        youtube,tiktok,
        id
      };

      const savedContact = await this.companyContactService.createCompanyContact(payload);

      res.status(201).json({
        message: "Company contact information saved successfully",
        data: savedContact,
      });
    } catch (error) {
      next(error);
    }
  });

  createContactUsRequest = catchError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("🚀 ~ contactUs.controller.ts ~ req.body:", req.body);

      const { name, email, phone, subject, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({
          message: "Name, email, and message are required",
        });
      }

      const payload = {
        name,
        email,
        phone,
        subject,
        message,
        isChecked: false,
      };

      const savedContactRequest = await this.companyContactService.createContactUsRequest(payload as ContactMessage);

      res.status(201).json({
        message: "Contact request saved successfully",
        data: savedContactRequest,
      });
    } catch (error) {
      next(error);
    }
  });

  getAllContactRequests = catchError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const resDoc = await this.companyContactService.getAllContactRequestsService(page, limit);

      const result = responseHandler(200, "Contact requests fetched successfully", resDoc);

      res.status(result.statusCode).json(result);
    } catch (error) {
      next(error);
    }
  });

  getSingleContactRequestById = catchError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paramsId = req.params;
      const { id } = paramsId;
      const resDoc = await this.companyContactService.getSingleContactRequestByIdService(id);

      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  });

  markContactAsChecked = catchError(async (req: Request, res: Response) => {
    const { id } = req.params;

    const resDoc = await this.companyContactService.markContactAsCheckedService(id);

    res.status(resDoc.statusCode).json(resDoc);
  });

  deleteSingleContactRequest = catchError(async (req: Request, res: Response) => {
    const { id } = req.params;

    const resDoc = await this.companyContactService.deleteSingleContactRequestService(id);

    res.status(resDoc.statusCode).json(resDoc);
  });


  
    getCompanyContact = catchError(async (req: Request, res: Response, next: NextFunction) => {
    try {
     
      const resDoc = await this.companyContactService.getCompanyContactService();

      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  });

}

export default new CompanyContactController();
