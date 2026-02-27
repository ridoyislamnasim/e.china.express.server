"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseSpaceRepository = void 0;
const prismadatabase_1 = __importDefault(require("../../config/prismadatabase"));
const client_1 = require("@prisma/client");
const pagination_1 = require("../../utils/pagination");
class WarehouseSpaceRepository {
    constructor() {
        this.prisma = prismadatabase_1.default;
    }
    // WarehouseSpace methods
    async createWarehouseSpace(payload) {
        return await this.prisma.warehouseSpace.create({
            data: payload,
            include: {
                warehouse: true,
            }
        });
    }
    async getWarehouseSpaceById(id) {
        return await this.prisma.warehouseSpace.findUnique({
            where: { id },
            include: {
                warehouse: true,
                spaces: true,
                inventories: true,
            }
        });
    }
    async getWarehouseSpaceByWarehouse(warehouseId) {
        return await this.prisma.warehouseSpace.findFirst({
            where: { warehouseId },
            include: {
                warehouse: true,
            }
        });
    }
    async getAllWarehouseSpaces(filter = {}) {
        const { warehouseId, search } = filter;
        const where = {};
        if (warehouseId)
            where.warehouseId = warehouseId;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        return await this.prisma.warehouseSpace.findMany({
            where,
            include: {
                warehouse: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                    }
                },
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async getWarehouseSpacesWithPagination(filter, tx) {
        const { page = 1, limit = 10, warehouseId, search } = filter;
        const offset = (page - 1) * limit;
        const prismaClient = tx || this.prisma;
        const where = {};
        if (warehouseId)
            where.warehouseId = warehouseId;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        return await (0, pagination_1.pagination)({ limit, offset }, async (limit, offset) => {
            const [doc, totalDoc] = await Promise.all([
                prismaClient.warehouseSpace.findMany({
                    where,
                    skip: offset,
                    take: limit,
                    include: {
                        warehouse: {
                            select: {
                                id: true,
                                name: true,
                                code: true,
                            }
                        },
                        _count: {
                            select: {
                                spaces: true,
                                inventories: true,
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                }),
                prismaClient.warehouseSpace.count({ where }),
            ]);
            return { doc, totalDoc };
        });
    }
    async updateWarehouseSpace(id, payload, tx) {
        const prismaClient = tx || this.prisma;
        return await prismaClient.warehouseSpace.update({
            where: { id },
            data: payload,
            include: {
                warehouse: true,
            }
        });
    }
    async deleteWarehouseSpace(id) {
        await this.prisma.warehouseSpace.delete({ where: { id } });
    }
    // Space methods
    async createSpace(warehouseSpaceId, payload, tx) {
        const prismaClient = tx || this.prisma;
        return await prismaClient.space.create({
            data: {
                ...payload,
                warehouseSpaceId,
            },
            include: {
                warehouseSpace: {
                    include: {
                        warehouse: true,
                    }
                }
            }
        });
    }
    async getSpaceById(id) {
        return await this.prisma.space.findUnique({
            where: { id },
            include: {
                warehouseSpace: {
                    include: {
                        warehouse: true,
                    }
                }
            }
        });
    }
    async getSpaceBySpaceIdAndType(warehouseSpaceId, spaceId, type) {
        return await this.prisma.space.findFirst({
            where: {
                warehouseSpaceId,
                spaceId,
                type,
            }
        });
    }
    async getSpaceByNumber(warehouseSpaceId, type, spaceNumber) {
        return await this.prisma.space.findFirst({
            where: {
                warehouseSpaceId,
                type,
                spaceNumber,
            }
        });
    }
    async getAllSpaces(warehouseSpaceId, filter = {}) {
        const { type, occupied, search } = filter;
        const where = { warehouseSpaceId };
        if (type)
            where.type = type;
        if (occupied !== undefined)
            where.occupied = occupied;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { spaceId: { contains: search, mode: 'insensitive' } },
                { notes: { contains: search, mode: 'insensitive' } },
            ];
        }
        return await this.prisma.space.findMany({
            where,
            include: {
                warehouseSpace: {
                    select: {
                        id: true,
                        name: true,
                        warehouse: {
                            select: {
                                id: true,
                                name: true,
                                code: true,
                            }
                        }
                    }
                }
            },
            orderBy: [
                { type: 'asc' },
                { spaceNumber: 'asc' }
            ]
        });
    }
    async getAllSpacesByWarehouseId(warehouseId, filter = {}) {
        return await this.prisma.space.findMany({
            where: {
                warehouseSpace: {
                    warehouseId,
                },
                ...filter,
            },
            include: {
                warehouseSpace: {
                    include: {
                        warehouse: true,
                    }
                }
            }
        });
    }
    async updateSpace(id, payload, tx) {
        const prismaClient = tx || this.prisma;
        return await prismaClient.space.update({
            where: { id },
            data: payload,
            include: {
                warehouseSpace: {
                    include: {
                        warehouse: true,
                    }
                }
            }
        });
    }
    async updateSpaceOccupancy(id, occupied, tx) {
        const prismaClient = tx || this.prisma;
        return await prismaClient.space.update({
            where: { id },
            data: { occupied },
            include: {
                warehouseSpace: {
                    include: {
                        warehouse: true,
                    }
                }
            }
        });
    }
    async deleteSpace(id) {
        await this.prisma.space.delete({ where: { id } });
    }
    // Inventory methods
    async createInventory(warehouseSpaceId, payload, tx) {
        const prismaClient = tx || this.prisma;
        return await prismaClient.inventory.create({
            data: {
                ...payload,
                warehouseSpaceId,
            },
            include: {
                warehouseSpace: {
                    include: {
                        warehouse: true,
                    }
                }
            }
        });
    }
    async getInventoryById(id) {
        return await this.prisma.inventory.findUnique({
            where: { id },
            include: {
                warehouseSpace: {
                    include: {
                        warehouse: true,
                    }
                }
            }
        });
    }
    async getInventoryByType(warehouseSpaceId, type) {
        return await this.prisma.inventory.findFirst({
            where: {
                warehouseSpaceId,
                type,
            }
        });
    }
    async getAllInventories(warehouseSpaceId, filter = {}) {
        const { type, occupied, search } = filter;
        const where = { warehouseSpaceId };
        if (type)
            where.type = type;
        if (occupied !== undefined)
            where.occupied = occupied;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { notes: { contains: search, mode: 'insensitive' } },
            ];
        }
        return await this.prisma.inventory.findMany({
            where,
            include: {
                warehouseSpace: {
                    select: {
                        id: true,
                        name: true,
                        warehouse: {
                            select: {
                                id: true,
                                name: true,
                                code: true,
                            }
                        }
                    }
                }
            },
            orderBy: { type: 'asc' }
        });
    }
    async updateInventory(id, payload, tx) {
        const prismaClient = tx || this.prisma;
        return await prismaClient.inventory.update({
            where: { id },
            data: payload,
            include: {
                warehouseSpace: {
                    include: {
                        warehouse: true,
                    }
                }
            }
        });
    }
    async updateInventoryOccupancy(id, occupied, tx) {
        const prismaClient = tx || this.prisma;
        return await prismaClient.inventory.update({
            where: { id },
            data: { occupied },
            include: {
                warehouseSpace: {
                    include: {
                        warehouse: true,
                    }
                }
            }
        });
    }
    async deleteInventory(id) {
        await this.prisma.inventory.delete({ where: { id } });
    }
    // Additional methods
    async getSpacesByWarehouse(warehouseId) {
        const warehouseSpace = await this.prisma.warehouseSpace.findFirst({
            where: { warehouseId },
            include: {
                spaces: {
                    orderBy: [
                        { type: 'asc' },
                        { spaceNumber: 'asc' }
                    ]
                },
                inventories: {
                    orderBy: { type: 'asc' }
                }
            }
        });
        return warehouseSpace || { spaces: [], inventories: [] };
    }
    async getWarehouseSpaceStats(warehouseId) {
        const warehouseSpace = await this.prisma.warehouseSpace.findFirst({
            where: { warehouseId },
            include: {
                spaces: true,
                inventories: true,
            }
        });
        if (!warehouseSpace) {
            return {
                totalSpaces: 0,
                occupiedSpaces: 0,
                availableSpaces: 0,
                totalInventories: 0,
                occupiedInventories: 0,
                availableInventories: 0,
                totalCapacity: 0,
                usedCapacity: 0,
                availableCapacity: 0,
            };
        }
        const totalSpaces = warehouseSpace.spaces.length;
        const occupiedSpaces = warehouseSpace.spaces.filter((s) => s.occupied).length;
        const availableSpaces = totalSpaces - occupiedSpaces;
        const totalInventories = warehouseSpace.inventories.length;
        const occupiedInventories = warehouseSpace.inventories.filter((i) => i.occupied).length;
        const availableInventories = totalInventories - occupiedInventories;
        // Calculate capacity usage
        const spacesCapacity = warehouseSpace.spaces.reduce((sum, space) => sum + (space.capacity || 0), 0);
        const inventoriesCapacity = warehouseSpace.inventories.reduce((sum, inv) => sum + (inv.capacity || 0), 0);
        const usedCapacity = spacesCapacity + inventoriesCapacity;
        const totalCapacity = warehouseSpace.totalCapacity;
        const availableCapacity = totalCapacity - usedCapacity;
        return {
            totalSpaces,
            occupiedSpaces,
            availableSpaces,
            totalInventories,
            occupiedInventories,
            availableInventories,
            totalCapacity,
            usedCapacity,
            availableCapacity,
        };
    }
    async getAvailableSpaces(warehouseId, type) {
        const whereCondition = { occupied: false };
        const inventoryWhereCondition = { occupied: false };
        if (type) {
            // Check if type is a SpaceType
            if (Object.values(client_1.SpaceType).includes(type)) {
                whereCondition.type = type;
            }
            // Check if type is an InventoryType
            else if (Object.values(client_1.InventoryType).includes(type)) {
                inventoryWhereCondition.type = type;
            }
        }
        const warehouseSpace = await this.prisma.warehouseSpace.findFirst({
            where: { warehouseId },
            include: {
                spaces: {
                    where: whereCondition,
                    orderBy: [
                        { type: 'asc' },
                        { spaceNumber: 'asc' }
                    ]
                },
                inventories: {
                    where: inventoryWhereCondition,
                    orderBy: { type: 'asc' }
                }
            }
        });
        return warehouseSpace || { spaces: [], inventories: [] };
    }
    async searchSpaces(searchTerm, warehouseId) {
        const where = {
            OR: [
                { name: { contains: searchTerm, mode: 'insensitive' } },
                { spaceId: { contains: searchTerm, mode: 'insensitive' } },
                { notes: { contains: searchTerm, mode: 'insensitive' } },
            ]
        };
        if (warehouseId) {
            const warehouseSpace = await this.prisma.warehouseSpace.findFirst({
                where: { warehouseId },
                select: { id: true }
            });
            if (warehouseSpace) {
                where.warehouseSpaceId = warehouseSpace.id;
            }
        }
        return await this.prisma.space.findMany({
            where,
            include: {
                warehouseSpace: {
                    include: {
                        warehouse: {
                            select: {
                                id: true,
                                name: true,
                                code: true,
                            }
                        }
                    }
                }
            },
            orderBy: [
                { type: 'asc' },
                { spaceNumber: 'asc' }
            ]
        });
    }
    async getWarehouseById(id) {
        return await this.prisma.warehouse.findUnique({
            where: { id },
        });
    }
}
exports.WarehouseSpaceRepository = WarehouseSpaceRepository;
// Export singleton instance
const warehouseSpaceRepository = new WarehouseSpaceRepository();
exports.default = warehouseSpaceRepository;
