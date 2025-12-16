import { WarehouseSpaceRepository } from './warehouseSpace.service';
import { 
  WarehouseSpacePayload, 
  SpacePayload, 
  InventoryPayload, 
  WarehouseSpaceFilter,
  SpaceStats
} from './warehouseSpace.type';

export class WarehouseSpaceService {
  private repository: WarehouseSpaceRepository;

  constructor(repository: WarehouseSpaceRepository) {
    this.repository = repository;
  }

  async createWarehouseSpace(payload: WarehouseSpacePayload): Promise<any> {
    const { warehouseId, totalCapacity, name } = payload;

    if (!warehouseId || !totalCapacity || !name) {
      const error = new Error('Required fields are missing');
      (error as any).statusCode = 400;
      throw error;
    }

    const warehouse = await this.repository.getWarehouseById(warehouseId);
    if (!warehouse) {
      const error = new Error('Warehouse not found');
      (error as any).statusCode = 404;
      throw error;
    }

    const existingWarehouseSpace = await this.repository.getWarehouseSpaceByWarehouse(warehouseId);
    if (existingWarehouseSpace) {
      const error = new Error('Warehouse space already exists for this warehouse');
      (error as any).statusCode = 409;
      throw error;
    }

    return await this.repository.createWarehouseSpace(payload);
  }

  async getAllWarehouseSpaces(filter: WarehouseSpaceFilter = {}): Promise<any> {
    return await this.repository.getAllWarehouseSpaces(filter);
  }

  async getWarehouseSpaceById(id: string): Promise<any> {
    const warehouseSpace = await this.repository.getWarehouseSpaceById(id);
    if (!warehouseSpace) {
      const error = new Error('Warehouse space not found');
      (error as any).statusCode = 404;
      throw error;
    }
    return warehouseSpace;
  }

  async getWarehouseSpacesWithPagination(filter: WarehouseSpaceFilter, tx?: any): Promise<any> {
    return await this.repository.getWarehouseSpacesWithPagination(filter, tx);
  }

  async updateWarehouseSpace(id: string, payload: any, tx?: any): Promise<any> {
    const existingWarehouseSpace = await this.repository.getWarehouseSpaceById(id);
    if (!existingWarehouseSpace) {
      const error = new Error('Warehouse space not found');
      (error as any).statusCode = 404;
      throw error;
    }

    return await this.repository.updateWarehouseSpace(id, payload, tx);
  }

  async deleteWarehouseSpace(id: string): Promise<void> {
    const warehouseSpace = await this.repository.getWarehouseSpaceById(id);
    if (!warehouseSpace) {
      const error = new Error('Warehouse space not found');
      (error as any).statusCode = 404;
      throw error;
    }

    if (warehouseSpace.spaces.length > 0 || warehouseSpace.inventories.length > 0) {
      const error = new Error('Cannot delete warehouse space with existing spaces or inventories');
      (error as any).statusCode = 400;
      throw error;
    }

    await this.repository.deleteWarehouseSpace(id);
  }

  async createSpace(warehouseSpaceId: string, payload: SpacePayload, tx?: any): Promise<any> {
    const { spaceId, type, name, capacity, spaceNumber } = payload;

    if (!spaceId || !type || !name || !capacity) {
      const error = new Error('Required fields are missing');
      (error as any).statusCode = 400;
      throw error;
    }

    const warehouseSpace = await this.repository.getWarehouseSpaceById(warehouseSpaceId);
    if (!warehouseSpace) {
      const error = new Error('Warehouse space not found');
      (error as any).statusCode = 404;
      throw error;
    }

    const existingSpace = await this.repository.getSpaceBySpaceIdAndType(warehouseSpaceId, spaceId, type);
    if (existingSpace) {
      const error = new Error('Space with this ID and type already exists');
      (error as any).statusCode = 409;
      throw error;
    }

    if (spaceNumber) {
      const spaceWithNumber = await this.repository.getSpaceByNumber(warehouseSpaceId, type, spaceNumber);
      if (spaceWithNumber) {
        const error = new Error('Space number already exists for this type');
        (error as any).statusCode = 409;
        throw error;
      }
    }

    return await this.repository.createSpace(warehouseSpaceId, payload, tx);
  }

  async getAllSpaces(warehouseSpaceId: string, filter: any = {}): Promise<any> {
    return await this.repository.getAllSpaces(warehouseSpaceId, filter);
  }

  async getSpaceById(id: string): Promise<any> {
    const space = await this.repository.getSpaceById(id);
    if (!space) {
      const error = new Error('Space not found');
      (error as any).statusCode = 404;
      throw error;
    }
    return space;
  }

  async updateSpace(id: string, payload: any, tx?: any): Promise<any> {
    const existingSpace = await this.repository.getSpaceById(id);
    if (!existingSpace) {
      const error = new Error('Space not found');
      (error as any).statusCode = 404;
      throw error;
    }

    if (payload.spaceNumber && payload.spaceNumber !== existingSpace.spaceNumber) {
      const spaceWithNumber = await this.repository.getSpaceByNumber(
        existingSpace.warehouseSpaceId, 
        existingSpace.type, 
        payload.spaceNumber
      );
      if (spaceWithNumber && spaceWithNumber.id !== id) {
        const error = new Error('Space number already exists for this type');
        (error as any).statusCode = 409;
        throw error;
      }
    }

    return await this.repository.updateSpace(id, payload, tx);
  }

  async deleteSpace(id: string): Promise<void> {
    const space = await this.repository.getSpaceById(id);
    if (!space) {
      const error = new Error('Space not found');
      (error as any).statusCode = 404;
      throw error;
    }

    await this.repository.deleteSpace(id);
  }

  async createInventory(warehouseSpaceId: string, payload: InventoryPayload, tx?: any): Promise<any> {
    const { type, capacity, code } = payload;

    if (!type || !capacity || !code) {
      const error = new Error('Required fields are missing');
      (error as any).statusCode = 400;
      throw error;
    }

    const warehouseSpace = await this.repository.getWarehouseSpaceById(warehouseSpaceId);
    if (!warehouseSpace) {
      const error = new Error('Warehouse space not found');
      (error as any).statusCode = 404;
      throw error;
    }

    // const existingInventory = await this.repository.getInventoryByType(warehouseSpaceId, type);
    // if (existingInventory) {
    //   const error = new Error('Inventory with this type already exists');
    //   (error as any).statusCode = 409;
    //   throw error;
    // }

    return await this.repository.createInventory(warehouseSpaceId, payload, tx);
  }

  async getAllInventories(warehouseSpaceId: string, filter: any = {}): Promise<any> {
    return await this.repository.getAllInventories(warehouseSpaceId, filter);
  }

  async getInventoryById(id: string): Promise<any> {
    const inventory = await this.repository.getInventoryById(id);
    if (!inventory) {
      const error = new Error('Inventory not found');
      (error as any).statusCode = 404;
      throw error;
    }
    return inventory;
  }

  async updateInventory(id: string, payload: any, tx?: any): Promise<any> {
    const existingInventory = await this.repository.getInventoryById(id);
    if (!existingInventory) {
      const error = new Error('Inventory not found');
      (error as any).statusCode = 404;
      throw error;
    }

    return await this.repository.updateInventory(id, payload, tx);
  }

  async deleteInventory(id: string): Promise<void> {
    const inventory = await this.repository.getInventoryById(id);
    if (!inventory) {
      const error = new Error('Inventory not found');
      (error as any).statusCode = 404;
      throw error;
    }

    await this.repository.deleteInventory(id);
  }

  async updateSpaceOccupancy(id: string, occupied: boolean, tx?: any): Promise<any> {
    const space = await this.repository.getSpaceById(id);
    if (!space) {
      const error = new Error('Space not found');
      (error as any).statusCode = 404;
      throw error;
    }

    return await this.repository.updateSpaceOccupancy(id, occupied, tx);
  }

  async updateInventoryOccupancy(id: string, occupied: boolean, tx?: any): Promise<any> {
    const inventory = await this.repository.getInventoryById(id);
    if (!inventory) {
      const error = new Error('Inventory not found');
      (error as any).statusCode = 404;
      throw error;
    }

    return await this.repository.updateInventoryOccupancy(id, occupied, tx);
  }

  async getSpacesByWarehouse(warehouseId: string): Promise<any> {
    return await this.repository.getSpacesByWarehouse(warehouseId);
  }

  async getWarehouseSpaceStats(warehouseId: string): Promise<SpaceStats> {
    return await this.repository.getWarehouseSpaceStats(warehouseId);
  }

  async getAvailableSpaces(warehouseId: string, type?: string): Promise<any> {
    return await this.repository.getAvailableSpaces(warehouseId, type);
  }

  async searchSpaces(searchTerm: string, warehouseId?: string): Promise<any> {
    return await this.repository.searchSpaces(searchTerm, warehouseId);
  }
}