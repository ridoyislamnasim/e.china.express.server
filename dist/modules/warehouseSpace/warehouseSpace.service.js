"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseSpaceService = void 0;
const warehouseSpace_repository_1 = require("./warehouseSpace.repository");
class WarehouseSpaceService {
    constructor(repository) {
        this.repository = repository;
        this.spaceActivityService = new warehouseSpace_repository_1.SpaceActivityService();
    }
    async createWarehouseSpace(payload) {
        const { warehouseId, totalCapacity, name } = payload;
        if (!warehouseId || !totalCapacity || !name) {
            const error = new Error('Required fields are missing');
            error.statusCode = 400;
            throw error;
        }
        const warehouse = await this.repository.getWarehouseById(warehouseId);
        if (!warehouse) {
            const error = new Error('Warehouse not found');
            error.statusCode = 404;
            throw error;
        }
        const existingWarehouseSpace = await this.repository.getWarehouseSpaceByWarehouse(warehouseId);
        if (existingWarehouseSpace) {
            const error = new Error('Warehouse space already exists for this warehouse');
            error.statusCode = 409;
            throw error;
        }
        return await this.repository.createWarehouseSpace(payload);
    }
    async getAllWarehouseSpaces(filter = {}) {
        return await this.repository.getAllWarehouseSpaces(filter);
    }
    async getWarehouseSpaceById(id) {
        const warehouseSpace = await this.repository.getWarehouseSpaceById(id);
        if (!warehouseSpace) {
            const error = new Error('Warehouse space not found');
            error.statusCode = 404;
            throw error;
        }
        return warehouseSpace;
    }
    async getWarehouseSpacesWithPagination(filter, tx) {
        return await this.repository.getWarehouseSpacesWithPagination(filter, tx);
    }
    async updateWarehouseSpace(id, payload, tx) {
        const existingWarehouseSpace = await this.repository.getWarehouseSpaceById(id);
        if (!existingWarehouseSpace) {
            const error = new Error('Warehouse space not found');
            error.statusCode = 404;
            throw error;
        }
        return await this.repository.updateWarehouseSpace(id, payload, tx);
    }
    async deleteWarehouseSpace(id) {
        const warehouseSpace = await this.repository.getWarehouseSpaceById(id);
        if (!warehouseSpace) {
            const error = new Error('Warehouse space not found');
            error.statusCode = 404;
            throw error;
        }
        if (warehouseSpace.spaces.length > 0 || warehouseSpace.inventories.length > 0) {
            const error = new Error('Cannot delete warehouse space with existing spaces or inventories');
            error.statusCode = 400;
            throw error;
        }
        await this.repository.deleteWarehouseSpace(id);
    }
    async createSpace(warehouseSpaceId, payload, tx) {
        const { spaceId, type, name, capacity, spaceNumber } = payload;
        if (!spaceId || !type || !name || !capacity) {
            const error = new Error('Required fields are missing');
            error.statusCode = 400;
            throw error;
        }
        const warehouseSpace = await this.repository.getWarehouseSpaceById(warehouseSpaceId);
        if (!warehouseSpace) {
            const error = new Error('Warehouse space not found');
            error.statusCode = 404;
            throw error;
        }
        const existingSpace = await this.repository.getSpaceBySpaceIdAndType(warehouseSpaceId, spaceId, type);
        if (existingSpace) {
            const error = new Error('Space with this ID and type already exists');
            error.statusCode = 409;
            throw error;
        }
        if (spaceNumber) {
            const spaceWithNumber = await this.repository.getSpaceByNumber(warehouseSpaceId, type, spaceNumber);
            if (spaceWithNumber) {
                const error = new Error('Space number already exists for this type');
                error.statusCode = 409;
                throw error;
            }
        }
        const space = await this.repository.createSpace(warehouseSpaceId, payload, tx);
        await this.spaceActivityService.logSpaceActivity({
            warehouseId: warehouseSpace.warehouseId,
            spaceType: 'SPACE',
            spaceId: space.id,
            action: 'CREATE',
            details: { ...payload, warehouseSpaceId },
            userId: payload.userId
        }, tx);
        return space;
    }
    async getAllSpaces(warehouseSpaceId, filter = {}) {
        return await this.repository.getAllSpaces(warehouseSpaceId, filter);
    }
    async getSpaceById(id) {
        const space = await this.repository.getSpaceById(id);
        if (!space) {
            const error = new Error('Space not found');
            error.statusCode = 404;
            throw error;
        }
        return space;
    }
    async updateSpace(id, payload, tx) {
        const existingSpace = await this.repository.getSpaceById(id);
        if (!existingSpace) {
            const error = new Error('Space not found');
            error.statusCode = 404;
            throw error;
        }
        if (payload.spaceNumber && payload.spaceNumber !== existingSpace.spaceNumber) {
            const spaceWithNumber = await this.repository.getSpaceByNumber(existingSpace.warehouseSpaceId, existingSpace.type, payload.spaceNumber);
            if (spaceWithNumber && spaceWithNumber.id !== id) {
                const error = new Error('Space number already exists for this type');
                error.statusCode = 409;
                throw error;
            }
        }
        const updatedSpace = await this.repository.updateSpace(id, payload, tx);
        await this.spaceActivityService.logSpaceActivity({
            warehouseId: existingSpace.warehouseSpace.warehouseId,
            spaceType: 'SPACE',
            spaceId: id,
            action: 'UPDATE',
            details: payload,
            userId: payload.userId
        }, tx);
        return updatedSpace;
    }
    async deleteSpace(id) {
        const space = await this.repository.getSpaceById(id);
        if (!space) {
            const error = new Error('Space not found');
            error.statusCode = 404;
            throw error;
        }
        // Check if space has activities
        if (space.activities && space.activities.length > 0) {
            const error = new Error('Cannot delete space with existing activities');
            error.statusCode = 400;
            throw error;
        }
        await this.repository.deleteSpace(id);
    }
    async createInventory(warehouseSpaceId, payload, tx) {
        const { type, capacity } = payload;
        if (!type || !capacity) {
            const error = new Error('Required fields are missing');
            error.statusCode = 400;
            throw error;
        }
        const warehouseSpace = await this.repository.getWarehouseSpaceById(warehouseSpaceId);
        if (!warehouseSpace) {
            const error = new Error('Warehouse space not found');
            error.statusCode = 404;
            throw error;
        }
        const existingInventory = await this.repository.getInventoryByType(warehouseSpaceId, type);
        if (existingInventory) {
            const error = new Error('Inventory with this type already exists');
            error.statusCode = 409;
            throw error;
        }
        const inventory = await this.repository.createInventory(warehouseSpaceId, payload, tx);
        await this.spaceActivityService.logSpaceActivity({
            warehouseId: warehouseSpace.warehouseId,
            spaceType: 'INVENTORY',
            spaceId: inventory.id,
            action: 'CREATE',
            details: { ...payload, warehouseSpaceId },
            userId: payload.userId
        }, tx);
        return inventory;
    }
    async getAllInventories(warehouseSpaceId, filter = {}) {
        return await this.repository.getAllInventories(warehouseSpaceId, filter);
    }
    async getInventoryById(id) {
        const inventory = await this.repository.getInventoryById(id);
        if (!inventory) {
            const error = new Error('Inventory not found');
            error.statusCode = 404;
            throw error;
        }
        return inventory;
    }
    async updateInventory(id, payload, tx) {
        const existingInventory = await this.repository.getInventoryById(id);
        if (!existingInventory) {
            const error = new Error('Inventory not found');
            error.statusCode = 404;
            throw error;
        }
        const updatedInventory = await this.repository.updateInventory(id, payload, tx);
        await this.spaceActivityService.logSpaceActivity({
            warehouseId: existingInventory.warehouseSpace.warehouseId,
            spaceType: 'INVENTORY',
            spaceId: id,
            action: 'UPDATE',
            details: payload,
            userId: payload.userId
        }, tx);
        return updatedInventory;
    }
    async deleteInventory(id) {
        const inventory = await this.repository.getInventoryById(id);
        if (!inventory) {
            const error = new Error('Inventory not found');
            error.statusCode = 404;
            throw error;
        }
        if (inventory.activities && inventory.activities.length > 0) {
            const error = new Error('Cannot delete inventory with existing activities');
            error.statusCode = 400;
            throw error;
        }
        await this.repository.deleteInventory(id);
    }
    async updateSpaceOccupancy(id, occupied, tx) {
        const space = await this.repository.getSpaceById(id);
        if (!space) {
            const error = new Error('Space not found');
            error.statusCode = 404;
            throw error;
        }
        const updatedSpace = await this.repository.updateSpaceOccupancy(id, occupied, tx);
        await this.spaceActivityService.logSpaceActivity({
            warehouseId: space.warehouseSpace.warehouseId,
            spaceType: 'SPACE',
            spaceId: id,
            action: 'UPDATE_OCCUPANCY',
            details: { occupied },
            userId: space.userId
        }, tx);
        return updatedSpace;
    }
    async updateInventoryOccupancy(id, occupied, tx) {
        const inventory = await this.repository.getInventoryById(id);
        if (!inventory) {
            const error = new Error('Inventory not found');
            error.statusCode = 404;
            throw error;
        }
        const updatedInventory = await this.repository.updateInventoryOccupancy(id, occupied, tx);
        await this.spaceActivityService.logSpaceActivity({
            warehouseId: inventory.warehouseSpace.warehouseId,
            spaceType: 'INVENTORY',
            spaceId: id,
            action: 'UPDATE_OCCUPANCY',
            details: { occupied },
            userId: inventory.userId
        }, tx);
        return updatedInventory;
    }
    async getSpacesByWarehouse(warehouseId) {
        return await this.repository.getSpacesByWarehouse(warehouseId);
    }
    async getWarehouseSpaceStats(warehouseId) {
        return await this.repository.getWarehouseSpaceStats(warehouseId);
    }
    async getAvailableSpaces(warehouseId, type) {
        return await this.repository.getAvailableSpaces(warehouseId);
    }
    async searchSpaces(searchTerm, warehouseId) {
        return await this.repository.searchSpaces(searchTerm, warehouseId);
    }
    async getSpaceActivities(spaceId) {
        return await this.repository.getSpaceActivities(spaceId);
    }
    async getInventoryActivities(inventoryId) {
        return await this.repository.getInventoryActivities(inventoryId);
    }
}
exports.WarehouseSpaceService = WarehouseSpaceService;
