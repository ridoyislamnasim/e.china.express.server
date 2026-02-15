// AuthController (TypeScript version)
import { Request, Response, NextFunction } from "express";
import { ShipScheduleService } from "./ship.schedule.service";
import shipScheduleRepository from "./ship.schedule.repository";
import { responseHandler } from "../../utils/responseHandler";
import withTransaction from "../../middleware/transactions/withTransaction";
import catchError from "../../middleware/errors/catchError";
const shipScheduleService = new ShipScheduleService(shipScheduleRepository);

class ShipScheduleController {
  createShipSchedule = withTransaction(
    async (req: Request, res: Response, next: NextFunction, tx: any) => {
      try {
        const { sailingDate, arrivalDate } = req.body;
        const payload = {
          sailingDate,
          arrivalDate,
        };
        const shipSchedule =
          await shipScheduleService.createShipSchedule(payload);
        const resDoc = responseHandler(
          201,
          "ShipSchedule Created successfully",
          shipSchedule,
        );
        res.status(resDoc.statusCode).json(resDoc);
      } catch (error) {
        next(error);
      }
    },
  );

  getAllShipSchedules = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const shipSchedules = await shipScheduleService.getAllShipSchedules();
      const resDoc = responseHandler(
        200,
        "ShipSchedules retrieved successfully",
        shipSchedules,
      );
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };

  getShipScheduleWithPagination = withTransaction(
    async (req: Request, res: Response, next: NextFunction, tx: any) => {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const payload = { page, limit };
      const shipSchedules =
        await shipScheduleService.getShipScheduleWithPagination(payload, tx);
      const resDoc = responseHandler(
        200,
        "ShipSchedules retrieved successfully with pagination",
        shipSchedules,
      );
      res.status(resDoc.statusCode).json(resDoc);
    },
  );

  updateShipSchedule = withTransaction(
    async (req: Request, res: Response, next: NextFunction, tx: any) => {
      try {
        const id = parseInt(req.params.id as string, 10);
        const { sailingDate, arrivalDate } = req.body;
        const payload = {
          sailingDate,
          arrivalDate,
        };
        // Implement update logic here using shipScheduleService
        const updatedShipSchedule =
          await shipScheduleService.updateShipSchedule(id, payload, tx);
        const resDoc = responseHandler(
          200,
          `ShipSchedule with id ${id} updated successfully`,
          updatedShipSchedule,
        );
        res.status(resDoc.statusCode).json(resDoc);
      } catch (error) {
        next(error);
      }
    },
  );

  getSingleShipSchedule = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = parseInt(req.params.id as string, 10);
      const shipSchedule = await shipScheduleService.getShipScheduleById(id);
      const resDoc = responseHandler(
        200,
        "ShipSchedule retrieved successfully",
        shipSchedule,
      );
      res.status(resDoc.statusCode).json(resDoc);
    },
  );

  deleteShipSchedule = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = parseInt(req.params.id as string, 10);
      // Implement delete logic here using shipScheduleService
      await shipScheduleService.deleteShipSchedule(id);
      const resDoc = responseHandler(
        200,
        `ShipSchedule with id ${id} deleted successfully`,
        null,
      );
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };
}
export default new ShipScheduleController();
