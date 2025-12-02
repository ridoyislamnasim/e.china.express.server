import { Request, Response, NextFunction } from 'express';
import { WarehouseService } from './warehouse.service';
import warehouseRepository from './warehouse.repository';
import { responseHandler } from '../../utils/responseHandler';
import withTransaction from '../../middleware/transactions/withTransaction';

const warehouseService = new WarehouseService(warehouseRepository);

class WarehouseController {
  createWarehouse = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    try {
      const payload = req.body;
      const warehouse = await warehouseService.createWarehouse(payload);
      const resDoc = responseHandler(201, 'Warehouse created successfully', warehouse);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  });

  getAllWarehouses = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = {
        status: req.query.status as string,
        type: req.query.type as string,
        countryId: req.query.countryId ? parseInt(req.query.countryId as string) : undefined,
        search: req.query.search as string,
      };
      const warehouses = await warehouseService.getAllWarehouses(filter);
      const resDoc = responseHandler(200, 'Warehouses retrieved successfully', warehouses);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };

  getWarehouseById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const warehouse = await warehouseService.getWarehouseById(id);
      const resDoc = responseHandler(200, 'Warehouse retrieved successfully', warehouse);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };

  getWarehousesWithPagination = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const filter = {
        page,
        limit,
        status: req.query.status as string,
        type: req.query.type as string,
        countryId: req.query.countryId ? parseInt(req.query.countryId as string) : undefined,
        search: req.query.search as string,
      };
      const warehouses = await warehouseService.getWarehousesWithPagination(filter, tx);
      const resDoc = responseHandler(200, 'Warehouses retrieved successfully with pagination', warehouses);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  });

  updateWarehouse = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    try {
      const { id } = req.params;
      const payload = req.body;
      const updatedWarehouse = await warehouseService.updateWarehouse(id, payload, tx);
      const resDoc = responseHandler(200, `Warehouse with id ${id} updated successfully`, updatedWarehouse);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  });

  deleteWarehouse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await warehouseService.deleteWarehouse(id);
      const resDoc = responseHandler(200, `Warehouse with id ${id} deleted successfully`, null);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };

  updateWarehouseCapacity = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    try {
      const { id } = req.params;
      const { usedCapacity } = req.body;
      
      if (!usedCapacity && usedCapacity !== 0) {
        const error = new Error('usedCapacity is required');
        (error as any).statusCode = 400;
        throw error;
      }

      const warehouse = await warehouseService.updateWarehouseCapacity(id, usedCapacity, tx);
      const resDoc = responseHandler(200, 'Warehouse capacity updated successfully', warehouse);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  });

  getWarehouseStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await warehouseService.getWarehouseStats();
      const resDoc = responseHandler(200, 'Warehouse statistics retrieved successfully', stats);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };

  getWarehousesByManager = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { managerId } = req.params;
      const warehouses = await warehouseService.getWarehousesByManager(parseInt(managerId));
      const resDoc = responseHandler(200, 'Warehouses retrieved successfully', warehouses);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };

  getAvailableWarehouses = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const minAvailableCapacity = req.query.minAvailableCapacity 
        ? parseInt(req.query.minAvailableCapacity as string) 
        : 0;
      const warehouses = await warehouseService.getAvailableCapacityWarehouses(minAvailableCapacity);
      const resDoc = responseHandler(200, 'Available warehouses retrieved successfully', warehouses);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };

  searchWarehouses = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search } = req.query;
      if (!search) {
        const error = new Error('Search term is required');
        (error as any).statusCode = 400;
        throw error;
      }
      const warehouses = await warehouseService.searchWarehouses(search as string);
      const resDoc = responseHandler(200, 'Warehouses retrieved successfully', warehouses);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };

  changeWarehouseStatus = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status) {
        const error = new Error('Status is required');
        (error as any).statusCode = 400;
        throw error;
      }

      const warehouse = await warehouseService.changeWarehouseStatus(id, status);
      const resDoc = responseHandler(200, 'Warehouse status updated successfully', warehouse);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  });
}

export default new WarehouseController();