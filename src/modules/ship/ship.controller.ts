// AuthController (TypeScript version)
import { Request, Response, NextFunction } from 'express';
import { ShipService } from './ship.service';
import shipRepository from './ship.repository';
import { responseHandler } from '../../utils/responseHandler';
import withTransaction from '../../middleware/transactions/withTransaction';
import catchError from '../../middleware/errors/catchError';
const shipService = new ShipService(shipRepository);

class ShipController {
  createShip = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    try {
    //   name      String
    // code      String
    // status    Boolean     @default(true)

      const { name, code, status } = req.body;
      const payload = {
        name, code, status
      };
      const ship = await shipService.createShip(payload);
      const resDoc = responseHandler(201, 'Ship Created successfully', ship);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  });

  getAllShips = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ships = await shipService.getAllShips();
      const resDoc = responseHandler(200, 'Ships retrieved successfully', ships);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };

  

  getShipWithPagination = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const payload = { page, limit };
      const countries = await shipService.getShipWithPagination(payload, tx);
      const resDoc = responseHandler(200, 'Countries retrieved successfully with pagination', countries);
      res.status(resDoc.statusCode).json(resDoc);
  });

  updateShip = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { name, code, status } = req.body;
      const payload = {
        name, code, status
      };
      // Implement update logic here using shipService
      const updatedShip = await shipService.updateShip(id, payload, tx);
      const resDoc = responseHandler(200, `Ship with id ${id} updated successfully`, updatedShip);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  });

  getSingleShip = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id, 10);
    const ship = await shipService.getShipById(id);
    const resDoc = responseHandler(200, 'Ship retrieved successfully', ship);
    res.status(resDoc.statusCode).json(resDoc);
  });

  deleteShip = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      // Implement delete logic here using shipService
      await shipService.deleteShip(id);
      const resDoc = responseHandler(200, `Ship with id ${id} deleted successfully`, null);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };
}
export default new ShipController();