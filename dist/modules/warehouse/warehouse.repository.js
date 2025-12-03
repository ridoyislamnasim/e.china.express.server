"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseRepository = void 0;
const prismadatabase_1 = __importDefault(require("../../config/prismadatabase"));
const pagination_1 = require("../../utils/pagination");
class WarehouseRepository {
    constructor() {
        this.prisma = prismadatabase_1.default;
    }
    async createWarehouse(payload) {
        const newWarehouse = await this.prisma.warehouse.create({
            data: payload,
            include: {
                managerRef: true,
                countryRef: true,
                createdByRef: true,
                updatedByRef: true,
            }
        });
        return newWarehouse;
    }
    async getWarehouseById(id) {
        return await this.prisma.warehouse.findUnique({
            where: { id },
            include: {
                managerRef: true,
                countryRef: true,
                createdByRef: true,
                updatedByRef: true,
                fromWarehouseTransfers: true,
                toWarehouseTransfers: true,
            }
        });
    }
    async getWarehouseByCondition(condition) {
        return await this.prisma.warehouse.findFirst({
            where: condition,
            include: {
                managerRef: true,
                countryRef: true,
            }
        });
    }
    async getWarehouseByCode(code) {
        return await this.getWarehouseByCondition({ code });
    }
    async getAllWarehouses(filter = {}) {
        const { status, type, countryId, search } = filter;
        const where = {};
        if (status)
            where.status = status;
        if (type)
            where.type = type;
        if (countryId)
            where.countryId = countryId;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { code: { contains: search, mode: 'insensitive' } },
                { address: { contains: search, mode: 'insensitive' } },
                { city: { contains: search, mode: 'insensitive' } },
            ];
        }
        return await this.prisma.warehouse.findMany({
            where,
            include: {
                managerRef: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    }
                },
                countryRef: {
                    select: {
                        id: true,
                        name: true,
                        isoCode: true,
                    }
                },
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async getWarehousesWithPagination(filter, tx) {
        const { page = 1, limit = 10, status, type, countryId, search } = filter;
        const offset = (page - 1) * limit;
        const prismaClient = tx || this.prisma;
        const where = {};
        if (status)
            where.status = status;
        if (type)
            where.type = type;
        if (countryId)
            where.countryId = countryId;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { code: { contains: search, mode: 'insensitive' } },
                { address: { contains: search, mode: 'insensitive' } },
                { city: { contains: search, mode: 'insensitive' } },
            ];
        }
        return await (0, pagination_1.pagination)({ limit, offset }, async (limit, offset) => {
            const [doc, totalDoc] = await Promise.all([
                prismaClient.warehouse.findMany({
                    where,
                    skip: offset,
                    take: limit,
                    include: {
                        managerRef: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            }
                        },
                        countryRef: {
                            select: {
                                id: true,
                                name: true,
                            }
                        },
                    },
                    orderBy: { createdAt: 'desc' }
                }),
                prismaClient.warehouse.count({ where }),
            ]);
            return { doc, totalDoc };
        });
    }
    async updateWarehouse(id, payload, tx) {
        const prismaClient = tx || this.prisma;
        const updatedWarehouse = await prismaClient.warehouse.update({
            where: { id },
            data: payload,
            include: {
                managerRef: true,
                countryRef: true,
            }
        });
        return updatedWarehouse;
    }
    async deleteWarehouse(id) {
        await this.prisma.warehouse.delete({ where: { id } });
    }
    async updateWarehouseCapacity(id, usedCapacity, tx) {
        const prismaClient = tx || this.prisma;
        const warehouse = await prismaClient.warehouse.findUnique({ where: { id } });
        if (!warehouse) {
            throw new Error('Warehouse not found');
        }
        if (usedCapacity > warehouse.totalCapacity) {
            throw new Error('Used capacity cannot exceed total capacity');
        }
        return await prismaClient.warehouse.update({
            where: { id },
            data: {
                usedCapacity,
                status: usedCapacity >= warehouse.totalCapacity ? 'OVERLOADED' : 'OPERATIONAL'
            }
        });
    }
    async getWarehouseStats() {
        const warehouses = await this.prisma.warehouse.findMany({
            select: {
                status: true,
                totalCapacity: true,
                usedCapacity: true,
            }
        });
        const totalWarehouses = warehouses.length;
        const operational = warehouses.filter(w => w.status === 'OPERATIONAL').length;
        const maintenance = warehouses.filter(w => w.status === 'MAINTENANCE').length;
        const closed = warehouses.filter(w => w.status === 'CLOSED').length;
        const totalCapacity = warehouses.reduce((sum, w) => sum + w.totalCapacity, 0);
        const usedCapacity = warehouses.reduce((sum, w) => sum + (w.usedCapacity || 0), 0);
        const availableCapacity = totalCapacity - usedCapacity;
        return {
            totalWarehouses,
            operational,
            maintenance,
            closed,
            totalCapacity,
            usedCapacity,
            availableCapacity,
        };
    }
    async getWarehousesByManager(managerId) {
        return await this.prisma.warehouse.findMany({
            where: { managerRefId: managerId },
            include: {
                countryRef: true,
            }
        });
    }
    async getAvailableCapacityWarehouses(minAvailableCapacity = 0) {
        return await this.prisma.warehouse.findMany({
            where: {
                status: 'OPERATIONAL',
                totalCapacity: {
                    gt: this.prisma.warehouse.fields.usedCapacity
                }
            },
            include: {
                countryRef: true,
            }
        });
    }
}
exports.WarehouseRepository = WarehouseRepository;
// Export a singleton instance
const warehouseRepository = new WarehouseRepository();
exports.default = warehouseRepository;
