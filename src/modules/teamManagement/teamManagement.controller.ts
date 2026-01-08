import { NextFunction, Request, Response } from "express";
import catchError from "../../middleware/errors/catchError";
import { responseHandler } from "../../utils/responseHandler";
import TeamManagementService from "./teamManagement.service";
import { TeamMember } from "../../types/team-management.interface";

class TeamManagementController {
  private teamManagementService = new TeamManagementService();

  /* ==============================
     Create Team Member
  ================================ */
  createTeamMember = catchError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, rating,  location, language } = req.body;

      if (!name || !email) {
        return res.status(400).json({
          message: "Name and email are required",
        });
      }

      const payload = {
        name,
        email,
        avatar: req.file?.path,
        rating: Number(rating) || 0,
        
        location,
        language,
      };

    const payloadFiles = {
      files: req.files,
    };

      const savedMember = await this.teamManagementService.createTeamMemberService(payloadFiles,payload as TeamMember);

      res.status(201).json({
        message: "Team member created successfully",
        data: savedMember,
      });
    } catch (error) {
      next(error);
    }
  });

  /* ==============================
     Get All Team Members
  ================================ */
  getAllTeamMembers = catchError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resDoc = await this.teamManagementService.getAllTeamMembersService();

      const result = responseHandler(200, "Team members fetched successfully", resDoc);

      res.status(result.statusCode).json(result);
    } catch (error) {
      next(error);
    }
  });


  getAllTeamMembersPagination = catchError(async (req: Request, res: Response, next: NextFunction) => {


    let payload = {
      page: req.query.page,
      limit: req.query.limit,
    };

    try {
      const resDoc = await this.teamManagementService.getAllTeamMembersPaginationService(payload);

      const result = responseHandler(200, "Team members fetched successfully", resDoc);

      res.status(result.statusCode).json(result);
    } catch (error) {
      next(error);
    }
  });

  /* ==============================
     Get Single Team Member
  ================================ */
  getSingleTeamMemberById = catchError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const resDoc = await this.teamManagementService.getSingleTeamMemberByIdService(id);

      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  });

  /* ==============================
     Update Team Member
  ================================ */
  updateTeamMember = catchError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const payload = {
        ...req.body,
      };
    const payloadFiles = {
      files: req.files,
    };


      const resDoc = await this.teamManagementService.updateTeamMemberService(id, payload,payloadFiles);

      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  });

  /* ==============================
     Delete Team Member
  ================================ */
  deleteTeamMember = catchError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const resDoc = await this.teamManagementService.deleteTeamMemberService(id);

      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  });
}

export default new TeamManagementController();
