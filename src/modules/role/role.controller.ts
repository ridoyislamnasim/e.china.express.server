import { Request, Response, NextFunction } from "express";
import catchError from "../../middleware/errors/catchError";
import { responseHandler } from "../../utils/responseHandler";
import withTransaction from "../../middleware/transactions/withTransaction";
import RoleService from "./role.service";

class RoleController {
  createRole = withTransaction(async (req: Request, res: Response, next: NextFunction, session: any) => {
    const payload = {
      role: req?.body?.role,
    };
    const roleResult = await RoleService.createRole(payload, session);
    const resDoc = responseHandler(201, "Role Created successfully", roleResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllRole = catchError(async (req: Request, res: Response, next: NextFunction) => {
    // ip address logging
    const ip = (typeof req.headers["x-forwarded-for"] === "string" ? req.headers["x-forwarded-for"].split(",")[0] : Array.isArray(req.headers["x-forwarded-for"]) ? req.headers["x-forwarded-for"][0] : req.socket.remoteAddress || req.ip || "").replace(/^.*:/, ""); // Clean IPv6 prefix if present

    console.log("Extracted IP -------------- :", ip);

    let payload = {
      roleType: req.query.roleType,
    };
    const roleResult = await RoleService.getAllRole(payload);
    const resDoc = responseHandler(200, "Get All Roles", roleResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getRoleWithPagination = catchError(async (req: Request, res: Response, next: NextFunction) => {
    let payload = {
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      order: req.query.order,
    };
    const role = await RoleService.getRoleWithPagination(payload);
    const resDoc = responseHandler(200, "Roles get successfully", { ...role });
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSingleRole = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const roleResult = await RoleService.getSingleRole(id);
    const resDoc = responseHandler(201, "Single Role successfully", roleResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateRole = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const payload = {
      role: req?.body?.role,
    };
    const roleResult = await RoleService.updateRole(id, payload );
    const resDoc = responseHandler(201, "Role Update successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });
  deleteRole = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const roleResult = await RoleService.deleteRole(id);
    const resDoc = responseHandler(200, "Role Deleted successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });
}

export default new RoleController();
