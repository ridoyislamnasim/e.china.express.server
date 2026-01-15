import { Router } from "express";
import { upload } from "../../middleware/upload/upload";
import teamManagementController from "../../modules/teamManagement/teamManagement.controller";

const teamManagementRoute = Router();


teamManagementRoute
  .route("/create-team-member")
  .post(upload, teamManagementController.createTeamMember);


teamManagementRoute
  .route("/get-all-team-members")
  .get(teamManagementController.getAllTeamMembers);

teamManagementRoute
  .route("/get-all-team-members-pagination")
  .get(teamManagementController.getAllTeamMembersPagination);


/* ==============================
   Single Team Member Operations
================================ */
teamManagementRoute
  .route("/team-member/:id")
  .get(teamManagementController.getSingleTeamMemberById)
  .put(upload, teamManagementController.updateTeamMember)
  .delete(teamManagementController.deleteTeamMember);

export default teamManagementRoute;
