"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class WarehouseSpaceRepositoryImpl {
    constructor() {
        this.prisma = prisma;
    }
    async createWarehouseSpace(data) {
        return await this.prisma.warehouseSpace.create({
            data,
            include: {
                warehouse: true,
            },
        });
    }
    async getAllWarehouseSpaces(filter) {
        const { warehouseId, search } = filter;
        const where = {};
        if (warehouseId) {
            where.warehouseId = warehouseId;
        }
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
                        name: true,
                        code: true,
                        city: true,
                        state: true,
                    },
                },
                _count: {
                    select: {
                        airSpaces: true,
                        seaSpaces: true,
                        expressSpaces: true,
                        inventory: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async getWarehouseSpaceById(id) {
        return await this.prisma.warehouseSpace.findUnique({
            where: { id },
            include: {
                warehouse: true,
                airSpaces: true,
                seaSpaces: true,
                expressSpaces: true,
                inventory: {
                    include: {
                        subInventoryX: true,
                        subInventoryY: true,
                        subInventoryZ: true,
                    },
                },
            },
        });
    }
    async getSpacesByWarehouse(warehouseId) {
        return await this.prisma.warehouseSpace.findMany({
            where: { warehouseId },
            include: {
                _count: {
                    select: {
                        airSpaces: true,
                        seaSpaces: true,
                        expressSpaces: true,
                        inventory: true,
                    },
                },
            },
            orderBy: {
                name: 'asc',
            },
        });
    }
    async getWarehouseSpacesWithPagination(filter, tx) {
        const prismaClient = tx || this.prisma;
        const { page = 1, limit = 10, warehouseId, search } = filter;
        const where = {};
        if (warehouseId) {
            where.warehouseId = warehouseId;
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        const skip = (page - 1) * limit;
        const [spaces, total] = await Promise.all([
            prismaClient.warehouseSpace.findMany({
                where,
                include: {
                    warehouse: {
                        select: {
                            name: true,
                            code: true,
                            city: true,
                            state: true,
                        },
                    },
                    _count: {
                        select: {
                            airSpaces: true,
                            seaSpaces: true,
                            expressSpaces: true,
                            inventory: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take: limit,
            }),
            prismaClient.warehouseSpace.count({ where }),
        ]);
        return {
            spaces,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async updateWarehouseSpace(id, data, tx) {
        const prismaClient = tx || this.prisma;
        return await prismaClient.warehouseSpace.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date(),
            },
            include: {
                warehouse: true,
            },
        });
    }
    async deleteWarehouseSpace(id) {
        return await this.prisma.warehouseSpace.delete({
            where: { id },
        });
    }
    async getWarehouseById(id) {
        return await this.prisma.warehouse.findUnique({
            where: { id },
        });
    }
    async getSpaceByNameAndWarehouse(name, warehouseId) {
        return await this.prisma.warehouseSpace.findFirst({
            where: {
                name,
                warehouseId,
            },
        });
    }
    async hasSubSpaces(spaceId) {
        const [airSpaces, seaSpaces, expressSpaces, inventory] = await Promise.all([
            this.prisma.airSpace.count({ where: { warehouseSpaceId: spaceId } }),
            this.prisma.seaSpace.count({ where: { warehouseSpaceId: spaceId } }),
            this.prisma.expressSpace.count({ where: { warehouseSpaceId: spaceId } }),
            this.prisma.inventory.count({ where: { warehouseSpaceId: spaceId } }),
        ]);
        return airSpaces > 0 || seaSpaces > 0 || expressSpaces > 0 || inventory > 0;
    }
    // Air Space methods
    async createAirSpace(data, tx) {
        const prismaClient = tx || this.prisma;
        return await prismaClient.airSpace.create({
            data,
        });
    }
    async getAirSpaceBySpaceId(spaceId, subSpaceId) {
        return await this.prisma.airSpace.findFirst({
            where: {
                warehouseSpaceId: spaceId,
                spaceId: subSpaceId,
            },
        });
    }
    async getAirSpaceBySpaceNumber(spaceId, spaceNumber) {
        return await this.prisma.airSpace.findFirst({
            where: {
                warehouseSpaceId: spaceId,
                spaceNumber,
            },
        });
    }
    async getAirSpaces(spaceId, filter) {
        const where = {
            warehouseSpaceId: spaceId,
        };
        if (filter.occupied !== undefined) {
            where.occupied = filter.occupied;
        }
        return await this.prisma.airSpace.findMany({
            where,
            orderBy: [
                { spaceNumber: 'asc' },
                { createdAt: 'desc' },
            ],
        });
    }
    // Sea Space methods
    async createSeaSpace(data, tx) {
        const prismaClient = tx || this.prisma;
        return await prismaClient.seaSpace.create({
            data,
        });
    }
    async getSeaSpaceBySpaceId(spaceId, subSpaceId) {
        return await this.prisma.seaSpace.findFirst({
            where: {
                warehouseSpaceId: spaceId,
                spaceId: subSpaceId,
            },
        });
    }
    async getSeaSpaceBySpaceNumber(spaceId, spaceNumber) {
        return await this.prisma.seaSpace.findFirst({
            where: {
                warehouseSpaceId: spaceId,
                spaceNumber,
            },
        });
    }
    async getSeaSpaces(spaceId, filter) {
        const where = {
            warehouseSpaceId: spaceId,
        };
        if (filter.occupied !== undefined) {
            where.occupied = filter.occupied;
        }
        return await this.prisma.seaSpace.findMany({
            where,
            orderBy: [
                { spaceNumber: 'asc' },
                { createdAt: 'desc' },
            ],
        });
    }
    // Express Space methods
    async createExpressSpace(data, tx) {
        const prismaClient = tx || this.prisma;
        return await prismaClient.expressSpace.create({
            data,
        });
    }
    async getExpressSpaceBySpaceId(spaceId, subSpaceId) {
        return await this.prisma.expressSpace.findFirst({
            where: {
                warehouseSpaceId: spaceId,
                spaceId: subSpaceId,
            },
        });
    }
    async getExpressSpaceBySpaceNumber(spaceId, spaceNumber) {
        return await this.prisma.expressSpace.findFirst({
            where: {
                warehouseSpaceId: spaceId,
                spaceNumber,
            },
        });
    }
    async getExpressSpaces(spaceId, filter) {
        const where = {
            warehouseSpaceId: spaceId,
        };
        if (filter.occupied !== undefined) {
            where.occupied = filter.occupied;
        }
        return await this.prisma.expressSpace.findMany({
            where,
            orderBy: [
                { spaceNumber: 'asc' },
                { createdAt: 'desc' },
            ],
        });
    }
    // Inventory methods
    async createInventory(data, tx) {
        const prismaClient = tx || this.prisma;
        return await prismaClient.inventory.create({
            data,
            include: {
                subInventoryX: true,
                subInventoryY: true,
                subInventoryZ: true,
            },
        });
    }
    async getInventoryBySpaceId(spaceId) {
        return await this.prisma.inventory.findFirst({
            where: {
                warehouseSpaceId: spaceId,
            },
        });
    }
    async getInventory(spaceId) {
        return await this.prisma.inventory.findFirst({
            where: {
                warehouseSpaceId: spaceId,
            },
            include: {
                subInventoryX: true,
                subInventoryY: true,
                subInventoryZ: true,
            },
        });
    }
    // Utility methods
    async getAvailableSpacesByWarehouse(warehouseId, spaceType) {
        const spaces = await this.prisma.warehouseSpace.findMany({
            where: { warehouseId },
            include: {
                airSpaces: {
                    where: { occupied: false },
                },
                seaSpaces: {
                    where: { occupied: false },
                },
                expressSpaces: {
                    where: { occupied: false },
                },
                inventory: {
                    include: {
                        subInventoryX: {
                            where: { occupied: false },
                        },
                        subInventoryY: {
                            where: { occupied: false },
                        },
                        subInventoryZ: {
                            where: { occupied: false },
                        },
                    },
                },
            },
        });
        // Filter based on spaceType if provided
        if (spaceType) {
            return spaces.map(space => {
                const result = {
                    id: space.id,
                    name: space.name,
                    totalCapacity: space.totalCapacity,
                };
                switch (spaceType.toLowerCase()) {
                    case 'air':
                        result.availableSpaces = space.airSpaces;
                        break;
                    case 'sea':
                        result.availableSpaces = space.seaSpaces;
                        break;
                    case 'express':
                        result.availableSpaces = space.expressSpaces;
                        break;
                    case 'inventory':
                        result.availableSpaces = space.inventory;
                        break;
                    default:
                        result.availableSpaces = {
                            airSpaces: space.airSpaces,
                            seaSpaces: space.seaSpaces,
                            expressSpaces: space.expressSpaces,
                            inventory: space.inventory,
                        };
                }
                return result;
            });
        }
        return spaces;
    }
    async getSpaceStats(spaceId) {
        const [airSpaces, seaSpaces, expressSpaces, inventory] = await Promise.all([
            this.prisma.airSpace.findMany({
                where: { warehouseSpaceId: spaceId },
            }),
            this.prisma.seaSpace.findMany({
                where: { warehouseSpaceId: spaceId },
            }),
            this.prisma.expressSpace.findMany({
                where: { warehouseSpaceId: spaceId },
            }),
            this.prisma.inventory.findFirst({
                where: { warehouseSpaceId: spaceId },
                include: {
                    subInventoryX: true,
                    subInventoryY: true,
                    subInventoryZ: true,
                },
            }),
        ]);
        const totalAirSpaces = airSpaces.length;
        const occupiedAirSpaces = airSpaces.filter(space => space.occupied).length;
        const totalSeaSpaces = seaSpaces.length;
        const occupiedSeaSpaces = seaSpaces.filter(space => space.occupied).length;
        const totalExpressSpaces = expressSpaces.length;
        const occupiedExpressSpaces = expressSpaces.filter(space => space.occupied).length;
        let totalInventorySpaces = 0;
        let occupiedInventorySpaces = 0;
        if (inventory) {
            totalInventorySpaces =
                inventory.subInventoryX.length +
                    inventory.subInventoryY.length +
                    inventory.subInventoryZ.length;
            occupiedInventorySpaces =
                inventory.subInventoryX.filter(space => space.occupied).length +
                    inventory.subInventoryY.filter(space => space.occupied).length +
                    inventory.subInventoryZ.filter(space => space.occupied).length;
        }
        return {
            airSpaces: {
                total: totalAirSpaces,
                occupied: occupiedAirSpaces,
                available: totalAirSpaces - occupiedAirSpaces,
            },
            seaSpaces: {
                total: totalSeaSpaces,
                occupied: occupiedSeaSpaces,
                available: totalSeaSpaces - occupiedSeaSpaces,
            },
            expressSpaces: {
                total: totalExpressSpaces,
                occupied: occupiedExpressSpaces,
                available: totalExpressSpaces - occupiedExpressSpaces,
            },
            inventory: {
                total: totalInventorySpaces,
                occupied: occupiedInventorySpaces,
                available: totalInventorySpaces - occupiedInventorySpaces,
            },
            summary: {
                totalSpaces: totalAirSpaces + totalSeaSpaces + totalExpressSpaces + totalInventorySpaces,
                occupiedSpaces: occupiedAirSpaces + occupiedSeaSpaces + occupiedExpressSpaces + occupiedInventorySpaces,
                availableSpaces: (totalAirSpaces - occupiedAirSpaces) +
                    (totalSeaSpaces - occupiedSeaSpaces) +
                    (totalExpressSpaces - occupiedExpressSpaces) +
                    (totalInventorySpaces - occupiedInventorySpaces),
            },
        };
    }
}
exports.default = new WarehouseSpaceRepositoryImpl();
