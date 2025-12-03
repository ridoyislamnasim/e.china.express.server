"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseService = void 0;
const warehouse_repository_1 = __importDefault(require("./warehouse.repository"));
class WarehouseService {
    constructor(repository = warehouse_repository_1.default) {
        this.repository = repository;
    }
    async createWarehouse(payload) {
        const { name, code, address, city, state, zipCode, country, phone, email, status = 'OPERATIONAL', type = 'DISTRIBUTION_CENTER', totalCapacity, usedCapacity = 0, capacityUnit = 'sq ft', managerRefId, countryId, createdBy, ...rest } = payload;
        // Validate required fields
        if (!name || !code || !address || !city || !state || !zipCode || !phone || !email || !totalCapacity) {
            const error = new Error('Required fields are missing');
            error.statusCode = 400;
            throw error;
        }
        // Check if warehouse code already exists
        const existingWarehouse = await this.repository.getWarehouseByCode(code);
        if (existingWarehouse) {
            const error = new Error('Warehouse code already exists');
            error.statusCode = 409;
            throw error;
        }
        // Validate capacity
        if (usedCapacity > totalCapacity) {
            const error = new Error('Used capacity cannot exceed total capacity');
            error.statusCode = 400;
            throw error;
        }
        const warehouseData = {
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
        return await this.repository.createWarehouse(warehouseData);
    }
    async getAllWarehouses(filter = {}) {
        return await this.repository.getAllWarehouses(filter);
    }
    async getWarehouseById(id) {
        const warehouse = await this.repository.getWarehouseById(id);
        if (!warehouse) {
            const error = new Error('Warehouse not found');
            error.statusCode = 404;
            throw error;
        }
        return warehouse;
    }
    async getWarehousesWithPagination(filter, tx) {
        return await this.repository.getWarehousesWithPagination(filter, tx);
    }
    async updateWarehouse(id, payload, tx) {
        // Check if warehouse exists
        const existingWarehouse = await this.repository.getWarehouseById(id);
        if (!existingWarehouse) {
            const error = new Error('Warehouse not found');
            error.statusCode = 404;
            throw error;
        }
        // Check if code is being changed and if it already exists
        if (payload.code && payload.code !== existingWarehouse.code) {
            const warehouseWithCode = await this.repository.getWarehouseByCode(payload.code);
            if (warehouseWithCode) {
                const error = new Error('Warehouse code already exists');
                error.statusCode = 409;
                throw error;
            }
        }
        // Validate capacity if being updated
        if (payload.totalCapacity !== undefined || payload.usedCapacity !== undefined) {
            const totalCapacity = payload.totalCapacity || existingWarehouse.totalCapacity;
            const usedCapacity = payload.usedCapacity || existingWarehouse.usedCapacity;
            if (usedCapacity > totalCapacity) {
                const error = new Error('Used capacity cannot exceed total capacity');
                error.statusCode = 400;
                throw error;
            }
        }
        return await this.repository.updateWarehouse(id, payload, tx);
    }
    async deleteWarehouse(id) {
        // Check if warehouse exists
        const warehouse = await this.repository.getWarehouseById(id);
        if (!warehouse) {
            const error = new Error('Warehouse not found');
            error.statusCode = 404;
            throw error;
        }
        // Check if warehouse has any transfers
        if (warehouse.fromWarehouseTransfers.length > 0 || warehouse.toWarehouseTransfers.length > 0) {
            const error = new Error('Cannot delete warehouse with existing transfers');
            error.statusCode = 400;
            throw error;
        }
        await this.repository.deleteWarehouse(id);
    }
    async updateWarehouseCapacity(id, usedCapacity, tx) {
        return await this.repository.updateWarehouseCapacity(id, usedCapacity, tx);
    }
    async getWarehouseStats() {
        return await this.repository.getWarehouseStats();
    }
    async getWarehousesByManager(managerId) {
        return await this.repository.getWarehousesByManager(managerId);
    }
    async getAvailableCapacityWarehouses(minAvailableCapacity = 0) {
        return await this.repository.getAvailableCapacityWarehouses(minAvailableCapacity);
    }
    async searchWarehouses(searchTerm) {
        return await this.repository.getAllWarehouses({ search: searchTerm });
    }
    async changeWarehouseStatus(id, status) {
        const validStatuses = ['OPERATIONAL', 'MAINTENANCE', 'CLOSED', 'OVERLOADED', 'UNDER_CONSTRUCTION'];
        if (!validStatuses.includes(status)) {
            const error = new Error('Invalid status');
            error.statusCode = 400;
            throw error;
        }
        return await this.repository.updateWarehouse(id, { status });
    }
}
exports.WarehouseService = WarehouseService;
