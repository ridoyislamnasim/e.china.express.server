import {
  WarehouseSpacePayload,
  WarehouseSpaceUpdatePayload,
  WarehouseSpaceFilter,
  AirSpacePayload,
  SeaSpacePayload,
  ExpressSpacePayload,
  InventoryPayload,
  SubSpaceFilter
} from './warehouseSpace.type';
import warehouseSpaceRepository, { WarehouseSpaceRepository } from './warehouseSpace.repository';

export class WarehouseSpaceService {
  private repository: WarehouseSpaceRepository;

  constructor(repository: WarehouseSpaceRepository = warehouseSpaceRepository) {
    this.repository = repository;
  }

  async createWarehouseSpace(payload: WarehouseSpacePayload): Promise<any> {
    const {
      name,
      warehouseId,
      totalCapacity,
      description,
    } = payload;

    // Validate required fields
    if (!name || !warehouseId || !totalCapacity) {
      const error = new Error('Required fields: name, warehouseId, totalCapacity are missing');
      (error as any).statusCode = 400;
      throw error;
    }

    // Check if warehouse exists
    const warehouse = await this.repository.getWarehouseById(warehouseId);
    if (!warehouse) {
      const error = new Error('Warehouse not found');
      (error as any).statusCode = 404;
      throw error;
    }

    // Check if space name already exists in this warehouse
    const existingSpace = await this.repository.getSpaceByNameAndWarehouse(name, warehouseId);
    if (existingSpace) {
      const error = new Error('Space name already exists in this warehouse');
      (error as any).statusCode = 409;
      throw error;
    }

    const warehouseSpaceData: any = {
      name,
      warehouseId,
      totalCapacity,
      description,
    };

    return await this.repository.createWarehouseSpace(warehouseSpaceData);
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

  async getSpacesByWarehouse(warehouseId: string): Promise<any> {
    return await this.repository.getSpacesByWarehouse(warehouseId);
  }

  async getWarehouseSpacesWithPagination(filter: WarehouseSpaceFilter, tx?: any): Promise<any> {
    return await this.repository.getWarehouseSpacesWithPagination(filter, tx);
  }

  async updateWarehouseSpace(id: string, payload: WarehouseSpaceUpdatePayload, tx?: any): Promise<any> {
    // Check if warehouse space exists
    const existingSpace = await this.repository.getWarehouseSpaceById(id);
    if (!existingSpace) {
      const error = new Error('Warehouse space not found');
      (error as any).statusCode = 404;
      throw error;
    }

    // Check if name is being changed and if it already exists in the warehouse
    if (payload.name && payload.name !== existingSpace.name) {
      const spaceWithName = await this.repository.getSpaceByNameAndWarehouse(
        payload.name,
        existingSpace.warehouseId
      );
      if (spaceWithName) {
        const error = new Error('Space name already exists in this warehouse');
        (error as any).statusCode = 409;
        throw error;
      }
    }

    return await this.repository.updateWarehouseSpace(id, payload, tx);
  }

  async deleteWarehouseSpace(id: string): Promise<void> {
    // Check if warehouse space exists
    const space = await this.repository.getWarehouseSpaceById(id);
    if (!space) {
      const error = new Error('Warehouse space not found');
      (error as any).statusCode = 404;
      throw error;
    }

    // Check if space has any inventory or subspaces
    const hasSubSpaces = await this.repository.hasSubSpaces(id);
    if (hasSubSpaces) {
      const error = new Error('Cannot delete space with existing subspaces or inventory');
      (error as any).statusCode = 400;
      throw error;
    }

    await this.repository.deleteWarehouseSpace(id);
  }

  // Sub-space methods
  async createAirSpace(spaceId: string, payload: AirSpacePayload, tx?: any): Promise<any> {
    const {
      spaceId: subSpaceId,
      name,
      price,
      duration,
      capacity,
      notes,
      spaceNumber,
    } = payload;

    if (!subSpaceId || !name || !capacity) {
      const error = new Error('Required fields: spaceId, name, capacity are missing');
      (error as any).statusCode = 400;
      throw error;
    }

    // Check if warehouse space exists
    const warehouseSpace = await this.repository.getWarehouseSpaceById(spaceId);
    if (!warehouseSpace) {
      const error = new Error('Warehouse space not found');
      (error as any).statusCode = 404;
      throw error;
    }

    // Check if spaceId already exists
    const existingAirSpace = await this.repository.getAirSpaceBySpaceId(spaceId, subSpaceId);
    if (existingAirSpace) {
      const error = new Error('Air space ID already exists in this warehouse space');
      (error as any).statusCode = 409;
      throw error;
    }

    // Check if spaceNumber already exists
    if (spaceNumber) {
      const existingSpaceNumber = await this.repository.getAirSpaceBySpaceNumber(spaceId, spaceNumber);
      if (existingSpaceNumber) {
        const error = new Error('Space number already exists in this warehouse space');
        (error as any).statusCode = 409;
        throw error;
      }
    }

    const airSpaceData: any = {
      spaceId: subSpaceId,
      name,
      price,
      duration,
      capacity,
      notes,
      spaceNumber,
      warehouseSpaceId: spaceId,
    };

    return await this.repository.createAirSpace(airSpaceData, tx);
  }

  async createSeaSpace(spaceId: string, payload: SeaSpacePayload, tx?: any): Promise<any> {
    const {
      spaceId: subSpaceId,
      name,
      price,
      duration,
      capacity,
      notes,
      spaceNumber,
    } = payload;

    if (!subSpaceId || !name || !capacity) {
      const error = new Error('Required fields: spaceId, name, capacity are missing');
      (error as any).statusCode = 400;
      throw error;
    }

    // Check if warehouse space exists
    const warehouseSpace = await this.repository.getWarehouseSpaceById(spaceId);
    if (!warehouseSpace) {
      const error = new Error('Warehouse space not found');
      (error as any).statusCode = 404;
      throw error;
    }

    // Check if spaceId already exists
    const existingSeaSpace = await this.repository.getSeaSpaceBySpaceId(spaceId, subSpaceId);
    if (existingSeaSpace) {
      const error = new Error('Sea space ID already exists in this warehouse space');
      (error as any).statusCode = 409;
      throw error;
    }

    // Check if spaceNumber already exists
    if (spaceNumber) {
      const existingSpaceNumber = await this.repository.getSeaSpaceBySpaceNumber(spaceId, spaceNumber);
      if (existingSpaceNumber) {
        const error = new Error('Space number already exists in this warehouse space');
        (error as any).statusCode = 409;
        throw error;
      }
    }

    const seaSpaceData: any = {
      spaceId: subSpaceId,
      name,
      price,
      duration,
      capacity,
      notes,
      spaceNumber,
      warehouseSpaceId: spaceId,
    };

    return await this.repository.createSeaSpace(seaSpaceData, tx);
  }

  async createExpressSpace(spaceId: string, payload: ExpressSpacePayload, tx?: any): Promise<any> {
    const {
      spaceId: subSpaceId,
      name,
      price,
      duration,
      capacity,
      notes,
      spaceNumber,
    } = payload;

    if (!subSpaceId || !name || !capacity) {
      const error = new Error('Required fields: spaceId, name, capacity are missing');
      (error as any).statusCode = 400;
      throw error;
    }

    // Check if warehouse space exists
    const warehouseSpace = await this.repository.getWarehouseSpaceById(spaceId);
    if (!warehouseSpace) {
      const error = new Error('Warehouse space not found');
      (error as any).statusCode = 404;
      throw error;
    }

    // Check if spaceId already exists
    const existingExpressSpace = await this.repository.getExpressSpaceBySpaceId(spaceId, subSpaceId);
    if (existingExpressSpace) {
      const error = new Error('Express space ID already exists in this warehouse space');
      (error as any).statusCode = 409;
      throw error;
    }

    // Check if spaceNumber already exists
    if (spaceNumber) {
      const existingSpaceNumber = await this.repository.getExpressSpaceBySpaceNumber(spaceId, spaceNumber);
      if (existingSpaceNumber) {
        const error = new Error('Space number already exists in this warehouse space');
        (error as any).statusCode = 409;
        throw error;
      }
    }

    const expressSpaceData: any = {
      spaceId: subSpaceId,
      name,
      price,
      duration,
      capacity,
      notes,
      spaceNumber,
      warehouseSpaceId: spaceId,
    };

    return await this.repository.createExpressSpace(expressSpaceData, tx);
  }

  async createInventory(spaceId: string, payload: InventoryPayload, tx?: any): Promise<any> {
    const {
      name = 'Inventory',
      description,
      price,
      duration,
    } = payload;

    // Check if warehouse space exists
    const warehouseSpace = await this.repository.getWarehouseSpaceById(spaceId);
    if (!warehouseSpace) {
      const error = new Error('Warehouse space not found');
      (error as any).statusCode = 404;
      throw error;
    }

    // Check if inventory already exists for this space
    const existingInventory = await this.repository.getInventoryBySpaceId(spaceId);
    if (existingInventory) {
      const error = new Error('Inventory already exists for this warehouse space');
      (error as any).statusCode = 409;
      throw error;
    }

    const inventoryData: any = {
      name,
      description,
      price,
      duration,
      warehouseSpaceId: spaceId,
    };

    return await this.repository.createInventory(inventoryData, tx);
  }

  async getAirSpaces(spaceId: string, filter: SubSpaceFilter = {}): Promise<any> {
    return await this.repository.getAirSpaces(spaceId, filter);
  }

  async getSeaSpaces(spaceId: string, filter: SubSpaceFilter = {}): Promise<any> {
    return await this.repository.getSeaSpaces(spaceId, filter);
  }

  async getExpressSpaces(spaceId: string, filter: SubSpaceFilter = {}): Promise<any> {
    return await this.repository.getExpressSpaces(spaceId, filter);
  }

  async getInventory(spaceId: string): Promise<any> {
    return await this.repository.getInventory(spaceId);
  }

  async updateSpaceCapacity(spaceId: string, totalCapacity: number, tx?: any): Promise<any> {
    return await this.repository.updateWarehouseSpace(spaceId, { totalCapacity }, tx);
  }

  async getAvailableSpacesByWarehouse(warehouseId: string, spaceType?: string): Promise<any> {
    return await this.repository.getAvailableSpacesByWarehouse(warehouseId, spaceType);
  }

  async getSpaceStats(spaceId: string): Promise<any> {
    return await this.repository.getSpaceStats(spaceId);
  }
}