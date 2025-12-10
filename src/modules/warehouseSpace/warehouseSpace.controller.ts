import { Request, Response, NextFunction } from 'express';
import { WarehouseSpaceService } from './warehouseSpace.service';
import warehouseSpaceRepository from './warehouseSpace.repository';
import { responseHandler } from '../../utils/responseHandler';
import withTransaction from '../../middleware/transactions/withTransaction';

const warehouseSpaceService = new WarehouseSpaceService(warehouseSpaceRepository);

class WarehouseSpaceController {
  createWarehouseSpace = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    try {
      const payload = req.body;
      const warehouseSpace = await warehouseSpaceService.createWarehouseSpace(payload);
      const resDoc = responseHandler(201, 'Warehouse space created successfully', warehouseSpace);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  });

  getAllWarehouseSpaces = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = {
        warehouseId: req.query.warehouseId as string,
        search: req.query.search as string,
      };
      const warehouseSpaces = await warehouseSpaceService.getAllWarehouseSpaces(filter);
      const resDoc = responseHandler(200, 'Warehouse spaces retrieved successfully', warehouseSpaces);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };

  getWarehouseSpaceById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const warehouseSpace = await warehouseSpaceService.getWarehouseSpaceById(id);
      const resDoc = responseHandler(200, 'Warehouse space retrieved successfully', warehouseSpace);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };

  getSpacesByWarehouse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { warehouseId } = req.params;
      const spaces = await warehouseSpaceService.getSpacesByWarehouse(warehouseId);
      const resDoc = responseHandler(200, 'Warehouse spaces retrieved successfully', spaces);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };

  getWarehouseSpacesWithPagination = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const filter = {
        page,
        limit,
        warehouseId: req.query.warehouseId as string,
        search: req.query.search as string,
      };
      const warehouseSpaces = await warehouseSpaceService.getWarehouseSpacesWithPagination(filter, tx);
      const resDoc = responseHandler(200, 'Warehouse spaces retrieved successfully with pagination', warehouseSpaces);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  });

  updateWarehouseSpace = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    try {
      const { id } = req.params;
      const payload = req.body;
      const updatedWarehouseSpace = await warehouseSpaceService.updateWarehouseSpace(id, payload, tx);
      const resDoc = responseHandler(200, `Warehouse space with id ${id} updated successfully`, updatedWarehouseSpace);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  });

  deleteWarehouseSpace = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await warehouseSpaceService.deleteWarehouseSpace(id);
      const resDoc = responseHandler(200, `Warehouse space with id ${id} deleted successfully`, null);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };

  // Sub-space methods
  createAirSpace = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    try {
      const { spaceId } = req.params;
      const payload = req.body;
      const airSpace = await warehouseSpaceService.createAirSpace(spaceId, payload, tx);
      const resDoc = responseHandler(201, 'Air space created successfully', airSpace);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  });

  createSeaSpace = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    try {
      const { spaceId } = req.params;
      const payload = req.body;
      const seaSpace = await warehouseSpaceService.createSeaSpace(spaceId, payload, tx);
      const resDoc = responseHandler(201, 'Sea space created successfully', seaSpace);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  });

  createExpressSpace = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    try {
      const { spaceId } = req.params;
      const payload = req.body;
      const expressSpace = await warehouseSpaceService.createExpressSpace(spaceId, payload, tx);
      const resDoc = responseHandler(201, 'Express space created successfully', expressSpace);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  });

  createInventory = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    try {
      const { spaceId } = req.params;
      const payload = req.body;
      const inventory = await warehouseSpaceService.createInventory(spaceId, payload, tx);
      const resDoc = responseHandler(201, 'Inventory created successfully', inventory);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  });

  getAirSpaces = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { spaceId } = req.params;
      const filter = {
        occupied: req.query.occupied ? req.query.occupied === 'true' : undefined,
      };
      const airSpaces = await warehouseSpaceService.getAirSpaces(spaceId, filter);
      const resDoc = responseHandler(200, 'Air spaces retrieved successfully', airSpaces);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };

  getSeaSpaces = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { spaceId } = req.params;
      const filter = {
        occupied: req.query.occupied ? req.query.occupied === 'true' : undefined,
      };
      const seaSpaces = await warehouseSpaceService.getSeaSpaces(spaceId, filter);
      const resDoc = responseHandler(200, 'Sea spaces retrieved successfully', seaSpaces);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };

  getExpressSpaces = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { spaceId } = req.params;
      const filter = {
        occupied: req.query.occupied ? req.query.occupied === 'true' : undefined,
      };
      const expressSpaces = await warehouseSpaceService.getExpressSpaces(spaceId, filter);
      const resDoc = responseHandler(200, 'Express spaces retrieved successfully', expressSpaces);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };

  getInventory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { spaceId } = req.params;
      const inventory = await warehouseSpaceService.getInventory(spaceId);
      const resDoc = responseHandler(200, 'Inventory retrieved successfully', inventory);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };

  updateSpaceCapacity = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    try {
      const { spaceId } = req.params;
      const { totalCapacity } = req.body;
      
      if (!totalCapacity) {
        const error = new Error('totalCapacity is required');
        (error as any).statusCode = 400;
        throw error;
      }

      const space = await warehouseSpaceService.updateSpaceCapacity(spaceId, totalCapacity, tx);
      const resDoc = responseHandler(200, 'Space capacity updated successfully', space);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  });

  getAvailableSpacesByWarehouse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { warehouseId } = req.params;
      const { spaceType } = req.query;
      const availableSpaces = await warehouseSpaceService.getAvailableSpacesByWarehouse(
        warehouseId,
        spaceType as string
      );
      const resDoc = responseHandler(200, 'Available spaces retrieved successfully', availableSpaces);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };

  getSpaceStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { spaceId } = req.params;
      const stats = await warehouseSpaceService.getSpaceStats(spaceId);
      const resDoc = responseHandler(200, 'Space statistics retrieved successfully', stats);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };
}

export default new WarehouseSpaceController();