import { WarehousePayload, WarehouseUpdatePayload, WarehouseFilter } from './warehouse.type';
import warehouseRepository, { WarehouseRepository } from './warehouse.repository';

export class WarehouseService {
  private repository: WarehouseRepository;

  constructor(repository: WarehouseRepository = warehouseRepository) {
    this.repository = repository;
  }

  async createWarehouse(payload: WarehousePayload): Promise<any> {
    const {
      name,
      code,
      address,
      city,
      state,
      zipCode,
      country,
      phone,
      email,
      status = 'OPERATIONAL',
      type = 'DISTRIBUTION_CENTER',
      totalCapacity,
      usedCapacity = 0,
      capacityUnit = 'sq ft',
      managerRefId,
      countryId,
      createdBy,
      ...rest
    } = payload;

    // Validate required fields
    if (!name || !code || !address || !city || !state || !zipCode || !phone || !email || !totalCapacity) {
      const error = new Error('Required fields are missing');
      (error as any).statusCode = 400;
      throw error;
    }

    // Check if warehouse code already exists
    const existingWarehouse = await this.repository.getWarehouseByCode(code);
    if (existingWarehouse) {
      const error = new Error('Warehouse code already exists');
      (error as any).statusCode = 409;
      throw error;
    }

    // Validate capacity
    if (usedCapacity > totalCapacity) {
      const error = new Error('Used capacity cannot exceed total capacity');
      (error as any).statusCode = 400;
      throw error;
    }

    const warehouseData: any = {
      name,
      code,
      address,
      city,
      state,
      zipCode,
      country,
      phone,
      email,
      status,
      type,
      totalCapacity,
      usedCapacity,
      capacityUnit,
      managerRefId,
      countryId,
      createdBy,
      ...rest
    };
    console.log('Creating warehouse with data:', warehouseData);

    return await this.repository.createWarehouse(warehouseData);
  }

  async getAllWarehouses(filter: WarehouseFilter = {}): Promise<any> {
    return await this.repository.getAllWarehouses(filter);
  }

    async getWarehousesForClient(): Promise<any> {
    return await this.repository.getWarehousesForClient();
  }

  async getWarehouseById(id: string): Promise<any> {
    const warehouse = await this.repository.getWarehouseById(id);
    if (!warehouse) {
      const error = new Error('Warehouse not found');
      (error as any).statusCode = 404;
      throw error;
    }
    return warehouse;
  }

  async getWarehousesWithPagination(filter: WarehouseFilter, tx?: any): Promise<any> {
    return await this.repository.getWarehousesWithPagination(filter, tx);
  }

  async updateWarehouse(id: string, payload: WarehouseUpdatePayload, tx?: any): Promise<any> {
    // Check if warehouse exists
    const existingWarehouse = await this.repository.getWarehouseById(id);
    if (!existingWarehouse) {
      const error = new Error('Warehouse not found');
      (error as any).statusCode = 404;
      throw error;
    }

    // Check if code is being changed and if it already exists
    if (payload.code && payload.code !== existingWarehouse.code) {
      const warehouseWithCode = await this.repository.getWarehouseByCode(payload.code);
      if (warehouseWithCode) {
        const error = new Error('Warehouse code already exists');
        (error as any).statusCode = 409;
        throw error;
      }
    }

    // Validate capacity if being updated
    if (payload.totalCapacity !== undefined || payload.usedCapacity !== undefined) {
      const totalCapacity = payload.totalCapacity || existingWarehouse.totalCapacity;
      const usedCapacity = payload.usedCapacity || existingWarehouse.usedCapacity;
      
      if (usedCapacity > totalCapacity) {
        const error = new Error('Used capacity cannot exceed total capacity');
        (error as any).statusCode = 400;
        throw error;
      }
    }

    return await this.repository.updateWarehouse(id, payload, tx);
  }

  async deleteWarehouse(id: string): Promise<void> {
    // Check if warehouse exists
    const warehouse = await this.repository.getWarehouseById(id);
    if (!warehouse) {
      const error = new Error('Warehouse not found');
      (error as any).statusCode = 404;
      throw error;
    }

    // Check if warehouse has any transfers
    if (warehouse.fromWarehouseTransfers.length > 0 || warehouse.toWarehouseTransfers.length > 0) {
      const error = new Error('Cannot delete warehouse with existing transfers');
      (error as any).statusCode = 400;
      throw error;
    }

    await this.repository.deleteWarehouse(id);
  }

  async updateWarehouseCapacity(id: string, usedCapacity: number, tx?: any): Promise<any> {
    return await this.repository.updateWarehouseCapacity(id, usedCapacity, tx);
  }

  async getWarehouseStats(): Promise<any> {
    return await this.repository.getWarehouseStats();
  }

  async getWarehousesByManager(managerId: number): Promise<any> {
    return await this.repository.getWarehousesByManager(managerId);
  }

  async getAvailableCapacityWarehouses(minAvailableCapacity: number = 0): Promise<any> {
    return await this.repository.getAvailableCapacityWarehouses(minAvailableCapacity);
  }

  async searchWarehouses(searchTerm: string): Promise<any> {
    return await this.repository.getAllWarehouses({ search: searchTerm });
  }

  async changeWarehouseStatus(id: string, status: string): Promise<any> {
    const validStatuses = ['OPERATIONAL', 'MAINTENANCE', 'CLOSED', 'OVERLOADED', 'UNDER_CONSTRUCTION'];
    
    if (!validStatuses.includes(status)) {
      const error = new Error('Invalid status');
      (error as any).statusCode = 400;
      throw error;
    }

    return await this.repository.updateWarehouse(id, { status });
  }
}