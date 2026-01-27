// AuthController (TypeScript version)
import { Request, Response, NextFunction } from 'express';
import { ShipRouteService } from './ship.route.service';
import shipRouteRepository from './ship.route.repository';
import { responseHandler } from '../../utils/responseHandler';
import withTransaction from '../../middleware/transactions/withTransaction';
import catchError from '../../middleware/errors/catchError';
const shipRouteService = new ShipRouteService(shipRouteRepository);

class ShipRouteController {
  createShipRoute = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    try {
      const { shipId, fromPortId, toPortId, shipScheduleId } = req.body;
      const payload = {
        shipId,
        fromPortId,
        toPortId,
        shipScheduleId
      };
      const shipRoute = await shipRouteService.createShipRoute(payload);
      const resDoc = responseHandler(201, 'ShipRoute Created successfully', shipRoute);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  });

  getAllShipRoutes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const shipRoutes = await shipRouteService.getAllShipRoutes();
      const resDoc = responseHandler(200, 'ShipRoutes retrieved successfully', shipRoutes);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };

  

  getShipRouteWithPagination = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const payload = { page, limit };
      const countries = await shipRouteService.getShipRouteWithPagination(payload, tx);
      const resDoc = responseHandler(200, 'Countries retrieved successfully with pagination', countries);
      res.status(resDoc.statusCode).json(resDoc);
  });

  updateShipRoute = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { shipId, fromPortId, toPortId, shipScheduleId } = req.body;
      const payload = {
        shipId,
        fromPortId,
        toPortId,
        shipScheduleId
      };
      // Implement update logic here using shipRouteService
      const updatedShipRoute = await shipRouteService.updateShipRoute(id, payload, tx);
      const resDoc = responseHandler(200, `ShipRoute with id ${id} updated successfully`, updatedShipRoute);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  });

  getSingleShipRoute = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id, 10);
    const shipRoute = await shipRouteService.getShipRouteById(id);
    const resDoc = responseHandler(200, 'ShipRoute retrieved successfully', shipRoute);
    res.status(resDoc.statusCode).json(resDoc);
  });

  deleteShipRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      // Implement delete logic here using shipRouteService
      await shipRouteService.deleteShipRoute(id);
      const resDoc = responseHandler(200, `ShipRoute with id ${id} deleted successfully`, null);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };
}
export default new ShipRouteController();