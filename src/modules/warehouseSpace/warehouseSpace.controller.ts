import { Request, Response, NextFunction } from "express";

import { responseHandler } from "../../utils/responseHandler";
import withTransaction from "../../middleware/transactions/withTransaction";
import { WarehouseSpaceService } from "./warehouseSpace.repository";
import warehouseSpaceRepository from "./warehouseSpace.service";

const warehouseSpaceService = new WarehouseSpaceService(
  warehouseSpaceRepository,
);

class WarehouseSpaceController {
  // WarehouseSpace CRUD
  createWarehouseSpace = withTransaction(
    async (req: Request, res: Response, next: NextFunction, tx: any) => {
      try {
        const payload = req.body;
        const warehouseSpace =
          await warehouseSpaceService.createWarehouseSpace(payload);
        const resDoc = responseHandler(
          201,
          "Warehouse space created successfully",
          warehouseSpace,
        );
        res.status(resDoc.statusCode).json(resDoc);
      } catch (error) {
        next(error);
      }
    },
  );

  getAllWarehouseSpaces = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const filter = {
        warehouseId: req.query.warehouseId as string,
        search: req.query.search as string,
      };
      const warehouseSpaces =
        await warehouseSpaceService.getAllWarehouseSpaces(filter);
      const resDoc = responseHandler(
        200,
        "Warehouse spaces retrieved successfully",
        warehouseSpaces,
      );
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };

  getWarehouseSpaceById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      const warehouseSpace = await warehouseSpaceService.getWarehouseSpaceById(
        id as string,
      );
      const resDoc = responseHandler(
        200,
        "Warehouse space retrieved successfully",
        warehouseSpace,
      );
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };

  getWarehouseSpacesWithPagination = withTransaction(
    async (req: Request, res: Response, next: NextFunction, tx: any) => {
      try {
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 10;
        const filter = {
          page,
          limit,
          warehouseId: req.query.warehouseId as string,
          search: req.query.search as string,
        };
        const result =
          await warehouseSpaceService.getWarehouseSpacesWithPagination(
            filter,
            tx,
          );
        const resDoc = responseHandler(
          200,
          "Warehouse spaces retrieved successfully",
          result,
        );
        res.status(resDoc.statusCode).json(resDoc);
      } catch (error) {
        next(error);
      }
    },
  );

  updateWarehouseSpace = withTransaction(
    async (req: Request, res: Response, next: NextFunction, tx: any) => {
      try {
        const { id } = req.params;
        const payload = req.body;
        const updatedWarehouseSpace =
          await warehouseSpaceService.updateWarehouseSpace(
            id as string,
            payload,
            tx,
          );
        const resDoc = responseHandler(
          200,
          "Warehouse space updated successfully",
          updatedWarehouseSpace,
        );
        res.status(resDoc.statusCode).json(resDoc);
      } catch (error) {
        next(error);
      }
    },
  );

  deleteWarehouseSpace = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      await warehouseSpaceService.deleteWarehouseSpace(id as string);
      const resDoc = responseHandler(
        200,
        "Warehouse space deleted successfully",
        null,
      );
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };

  // Space CRUD
  createSpace = withTransaction(
    async (req: Request, res: Response, next: NextFunction, tx: any) => {
      try {
        const { warehouseSpaceId } = req.params;
        const payload = req.body;
        // console.log('Received createSpace request:', { warehouseSpaceId, payload });

        const space = await warehouseSpaceService.createSpace(
          warehouseSpaceId as string,
          payload,
          tx,
        );
        const resDoc = responseHandler(
          201,
          "Space created successfully",
          space,
        );
        res.status(resDoc.statusCode).json(resDoc);
      } catch (error) {
        next(error);
      }
    },
  );

  getAllSpaces = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { warehouseSpaceId } = req.params;
      const filter = {
        type: req.query.type as string,
        occupied: req.query.occupied
          ? req.query.occupied === "true"
          : undefined,
        search: req.query.search as string,
      };
      const spaces = await warehouseSpaceService.getAllSpaces(
        warehouseSpaceId as string,
        filter,
      );
      const resDoc = responseHandler(
        200,
        "Spaces retrieved successfully",
        spaces,
      );
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };

  getSpaceById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { spaceId } = req.params;
      const space = await warehouseSpaceService.getSpaceById(spaceId as string);
      const resDoc = responseHandler(
        200,
        "Space retrieved successfully",
        space,
      );
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };

  updateSpace = withTransaction(
    async (req: Request, res: Response, next: NextFunction, tx: any) => {
      try {
        const { spaceId } = req.params;
        const payload = req.body;
        const updatedSpace = await warehouseSpaceService.updateSpace(
          spaceId as string,
          payload,
          tx,
        );
        const resDoc = responseHandler(
          200,
          "Space updated successfully",
          updatedSpace,
        );
        res.status(resDoc.statusCode).json(resDoc);
      } catch (error) {
        next(error);
      }
    },
  );

  deleteSpace = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { spaceId } = req.params;
      await warehouseSpaceService.deleteSpace(spaceId as string);
      const resDoc = responseHandler(200, "Space deleted successfully", null);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };

  // Inventory CRUD
  createInventory = withTransaction(
    async (req: Request, res: Response, next: NextFunction, tx: any) => {
      try {
        const { warehouseSpaceId } = req.params;
        const payload = req.body;
        const inventory = await warehouseSpaceService.createInventory(
          warehouseSpaceId as string,
          payload,
          tx,
        );
        const resDoc = responseHandler(
          201,
          "Inventory created successfully",
          inventory,
        );
        res.status(resDoc.statusCode).json(resDoc);
      } catch (error) {
        next(error);
      }
    },
  );

  getAllInventories = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { warehouseSpaceId } = req.params;
      const filter = {
        type: req.query.type as string,
        occupied: req.query.occupied
          ? req.query.occupied === "true"
          : undefined,
        search: req.query.search as string,
      };
      const inventories = await warehouseSpaceService.getAllInventories(
        warehouseSpaceId as string,
        filter,
      );
      const resDoc = responseHandler(
        200,
        "Inventories retrieved successfully",
        inventories,
      );
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };

  getInventoryById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { inventoryId } = req.params;
      const inventory = await warehouseSpaceService.getInventoryById(
        inventoryId as string,
      );
      const resDoc = responseHandler(
        200,
        "Inventory retrieved successfully",
        inventory,
      );
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };

  updateInventory = withTransaction(
    async (req: Request, res: Response, next: NextFunction, tx: any) => {
      try {
        const { inventoryId } = req.params;
        const payload = req.body;
        const updatedInventory = await warehouseSpaceService.updateInventory(
          inventoryId as string,
          payload,
          tx,
        );
        const resDoc = responseHandler(
          200,
          "Inventory updated successfully",
          updatedInventory,
        );
        res.status(resDoc.statusCode).json(resDoc);
      } catch (error) {
        next(error);
      }
    },
  );

  deleteInventory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { inventoryId } = req.params;
      await warehouseSpaceService.deleteInventory(inventoryId as string);
      const resDoc = responseHandler(
        200,
        "Inventory deleted successfully",
        null,
      );
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };

  // Additional operations
  updateSpaceOccupancy = withTransaction(
    async (req: Request, res: Response, next: NextFunction, tx: any) => {
      try {
        const { spaceId } = req.params;
        const { occupied } = req.body;

        if (typeof occupied !== "boolean") {
          const error = new Error("Occupied must be a boolean value");
          (error as any).statusCode = 400;
          throw error;
        }

        const space = await warehouseSpaceService.updateSpaceOccupancy(
          spaceId as string,
          occupied,
          tx,
        );
        const resDoc = responseHandler(
          200,
          "Space occupancy updated successfully",
          space,
        );
        res.status(resDoc.statusCode).json(resDoc);
      } catch (error) {
        next(error);
      }
    },
  );

  updateInventoryOccupancy = withTransaction(
    async (req: Request, res: Response, next: NextFunction, tx: any) => {
      try {
        const { inventoryId } = req.params;
        const { occupied } = req.body;

        if (typeof occupied !== "boolean") {
          const error = new Error("Occupied must be a boolean value");
          (error as any).statusCode = 400;
          throw error;
        }

        const inventory = await warehouseSpaceService.updateInventoryOccupancy(
          inventoryId as string,
          occupied,
          tx,
        );
        const resDoc = responseHandler(
          200,
          "Inventory occupancy updated successfully",
          inventory,
        );
        res.status(resDoc.statusCode).json(resDoc);
      } catch (error) {
        next(error);
      }
    },
  );

  getSpacesByWarehouse = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { warehouseId } = req.params;
      const spaces = await warehouseSpaceService.getSpacesByWarehouse(
        warehouseId as string,
      );
      const resDoc = responseHandler(
        200,
        "Spaces retrieved successfully",
        spaces,
      );
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };

  getWarehouseSpaceStats = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { warehouseId } = req.params;
      const stats = await warehouseSpaceService.getWarehouseSpaceStats(
        warehouseId as string,
      );
      const resDoc = responseHandler(
        200,
        "Warehouse space statistics retrieved successfully",
        stats,
      );
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };

  getAvailableSpaces = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { warehouseId } = req.params;
      const type = req.query.type as string;
      const spaces = await warehouseSpaceService.getAvailableSpaces(
        warehouseId as string,
        type,
      );
      const resDoc = responseHandler(
        200,
        "Available spaces retrieved successfully",
        spaces,
      );
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };

  searchSpaces = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search, warehouseId } = req.query;
      if (!search) {
        const error = new Error("Search term is required");
        (error as any).statusCode = 400;
        throw error;
      }
      const spaces = await warehouseSpaceService.searchSpaces(
        search as string,
        warehouseId as string,
      );
      const resDoc = responseHandler(
        200,
        "Spaces retrieved successfully",
        spaces,
      );
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };
}

export default new WarehouseSpaceController();
