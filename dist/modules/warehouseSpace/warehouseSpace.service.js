"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseSpaceService = void 0;
const warehouseSpace_repository_1 = __importDefault(require("./warehouseSpace.repository"));
class WarehouseSpaceService {
    constructor(repository = warehouseSpace_repository_1.default) {
        this.repository = repository;
    }
    async createWarehouseSpace(payload) {
        const { name, warehouseId, totalCapacity, description, } = payload;
        // Validate required fields
        if (!name || !warehouseId || !totalCapacity) {
            const error = new Error('Required fields: name, warehouseId, totalCapacity are missing');
            error.statusCode = 400;
            throw error;
        }
        // Check if warehouse exists
        const warehouse = await this.repository.getWarehouseById(warehouseId);
        if (!warehouse) {
            const error = new Error('Warehouse not found');
            error.statusCode = 404;
            throw error;
        }
        // Check if space name already exists in this warehouse
        const existingSpace = await this.repository.getSpaceByNameAndWarehouse(name, warehouseId);
        if (existingSpace) {
            const error = new Error('Space name already exists in this warehouse');
            error.statusCode = 409;
            throw error;
        }
        const warehouseSpaceData = {
            name,
            warehouseId,
            totalCapacity,
            description,
        };
        return await this.repository.createWarehouseSpace(warehouseSpaceData);
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
    async getSpacesByWarehouse(warehouseId) {
        return await this.repository.getSpacesByWarehouse(warehouseId);
    }
    async getWarehouseSpacesWithPagination(filter, tx) {
        return await this.repository.getWarehouseSpacesWithPagination(filter, tx);
    }
    async updateWarehouseSpace(id, payload, tx) {
        // Check if warehouse space exists
        const existingSpace = await this.repository.getWarehouseSpaceById(id);
        if (!existingSpace) {
            const error = new Error('Warehouse space not found');
            error.statusCode = 404;
            throw error;
        }
        // Check if name is being changed and if it already exists in the warehouse
        if (payload.name && payload.name !== existingSpace.name) {
            const spaceWithName = await this.repository.getSpaceByNameAndWarehouse(payload.name, existingSpace.warehouseId);
            if (spaceWithName) {
                const error = new Error('Space name already exists in this warehouse');
                error.statusCode = 409;
                throw error;
            }
        }
        return await this.repository.updateWarehouseSpace(id, payload, tx);
    }
    async deleteWarehouseSpace(id) {
        // Check if warehouse space exists
        const space = await this.repository.getWarehouseSpaceById(id);
        if (!space) {
            const error = new Error('Warehouse space not found');
            error.statusCode = 404;
            throw error;
        }
        // Check if space has any inventory or subspaces
        const hasSubSpaces = await this.repository.hasSubSpaces(id);
        if (hasSubSpaces) {
            const error = new Error('Cannot delete space with existing subspaces or inventory');
            error.statusCode = 400;
            throw error;
        }
        await this.repository.deleteWarehouseSpace(id);
    }
    // Sub-space methods
    async createAirSpace(spaceId, payload, tx) {
        const { spaceId: subSpaceId, name, price, duration, capacity, notes, spaceNumber, } = payload;
        if (!subSpaceId || !name || !capacity) {
            const error = new Error('Required fields: spaceId, name, capacity are missing');
            error.statusCode = 400;
            throw error;
        }
        // Check if warehouse space exists
        const warehouseSpace = await this.repository.getWarehouseSpaceById(spaceId);
        if (!warehouseSpace) {
            const error = new Error('Warehouse space not found');
            error.statusCode = 404;
            throw error;
        }
        // Check if spaceId already exists
        const existingAirSpace = await this.repository.getAirSpaceBySpaceId(spaceId, subSpaceId);
        if (existingAirSpace) {
            const error = new Error('Air space ID already exists in this warehouse space');
            error.statusCode = 409;
            throw error;
        }
        // Check if spaceNumber already exists
        if (spaceNumber) {
            const existingSpaceNumber = await this.repository.getAirSpaceBySpaceNumber(spaceId, spaceNumber);
            if (existingSpaceNumber) {
                const error = new Error('Space number already exists in this warehouse space');
                error.statusCode = 409;
                throw error;
            }
        }
        const airSpaceData = {
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
    async createSeaSpace(spaceId, payload, tx) {
        const { spaceId: subSpaceId, name, price, duration, capacity, notes, spaceNumber, } = payload;
        if (!subSpaceId || !name || !capacity) {
            const error = new Error('Required fields: spaceId, name, capacity are missing');
            error.statusCode = 400;
            throw error;
        }
        // Check if warehouse space exists
        const warehouseSpace = await this.repository.getWarehouseSpaceById(spaceId);
        if (!warehouseSpace) {
            const error = new Error('Warehouse space not found');
            error.statusCode = 404;
            throw error;
        }
        // Check if spaceId already exists
        const existingSeaSpace = await this.repository.getSeaSpaceBySpaceId(spaceId, subSpaceId);
        if (existingSeaSpace) {
            const error = new Error('Sea space ID already exists in this warehouse space');
            error.statusCode = 409;
            throw error;
        }
        // Check if spaceNumber already exists
        if (spaceNumber) {
            const existingSpaceNumber = await this.repository.getSeaSpaceBySpaceNumber(spaceId, spaceNumber);
            if (existingSpaceNumber) {
                const error = new Error('Space number already exists in this warehouse space');
                error.statusCode = 409;
                throw error;
            }
        }
        const seaSpaceData = {
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
    async createExpressSpace(spaceId, payload, tx) {
        const { spaceId: subSpaceId, name, price, duration, capacity, notes, spaceNumber, } = payload;
        if (!subSpaceId || !name || !capacity) {
            const error = new Error('Required fields: spaceId, name, capacity are missing');
            error.statusCode = 400;
            throw error;
        }
        // Check if warehouse space exists
        const warehouseSpace = await this.repository.getWarehouseSpaceById(spaceId);
        if (!warehouseSpace) {
            const error = new Error('Warehouse space not found');
            error.statusCode = 404;
            throw error;
        }
        // Check if spaceId already exists
        const existingExpressSpace = await this.repository.getExpressSpaceBySpaceId(spaceId, subSpaceId);
        if (existingExpressSpace) {
            const error = new Error('Express space ID already exists in this warehouse space');
            error.statusCode = 409;
            throw error;
        }
        // Check if spaceNumber already exists
        if (spaceNumber) {
            const existingSpaceNumber = await this.repository.getExpressSpaceBySpaceNumber(spaceId, spaceNumber);
            if (existingSpaceNumber) {
                const error = new Error('Space number already exists in this warehouse space');
                error.statusCode = 409;
                throw error;
            }
        }
        const expressSpaceData = {
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
    async createInventory(spaceId, payload, tx) {
        const { name = 'Inventory', description, price, duration, } = payload;
        // Check if warehouse space exists
        const warehouseSpace = await this.repository.getWarehouseSpaceById(spaceId);
        if (!warehouseSpace) {
            const error = new Error('Warehouse space not found');
            error.statusCode = 404;
            throw error;
        }
        // Check if inventory already exists for this space
        const existingInventory = await this.repository.getInventoryBySpaceId(spaceId);
        if (existingInventory) {
            const error = new Error('Inventory already exists for this warehouse space');
            error.statusCode = 409;
            throw error;
        }
        const inventoryData = {
            name,
            description,
            price,
            duration,
            warehouseSpaceId: spaceId,
        };
        return await this.repository.createInventory(inventoryData, tx);
    }
    async getAirSpaces(spaceId, filter = {}) {
        return await this.repository.getAirSpaces(spaceId, filter);
    }
    async getSeaSpaces(spaceId, filter = {}) {
        return await this.repository.getSeaSpaces(spaceId, filter);
    }
    async getExpressSpaces(spaceId, filter = {}) {
        return await this.repository.getExpressSpaces(spaceId, filter);
    }
    async getInventory(spaceId) {
        return await this.repository.getInventory(spaceId);
    }
    async updateSpaceCapacity(spaceId, totalCapacity, tx) {
        return await this.repository.updateWarehouseSpace(spaceId, { totalCapacity }, tx);
    }
    async getAvailableSpacesByWarehouse(warehouseId, spaceType) {
        return await this.repository.getAvailableSpacesByWarehouse(warehouseId, spaceType);
    }
    async getSpaceStats(spaceId) {
        return await this.repository.getSpaceStats(spaceId);
    }
}
exports.WarehouseSpaceService = WarehouseSpaceService;
