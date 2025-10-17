"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryRepository = void 0;
const prismadatabase_1 = __importDefault(require("../../config/prismadatabase"));
const pagination_1 = require("../../utils/pagination");
class InventoryRepository {
    async createNewInventory(payload) {
        return await prismadatabase_1.default.inventory.create({ data: payload });
    }
    async updateById(id, payload) {
        return await prismadatabase_1.default.inventory.update({
            where: { id },
            data: payload,
        });
    }
    async createInventory(payload) {
        return await prismadatabase_1.default.inventory.create({ data: payload });
    }
    async getAllInventory(payload) {
        const { warehouseRefId } = payload;
        return await prismadatabase_1.default.inventory.findMany({
            where: { warehouseRefId },
            include: { productRef: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateInventory(id, payload) {
        const updatedInventory = await prismadatabase_1.default.inventory.update({
            where: { id },
            data: payload,
        });
        if (!updatedInventory) {
            throw new Error('Inventory not found');
        }
        return updatedInventory;
    }
    async getInventoryWithPagination(payload) {
        return await (0, pagination_1.pagination)(payload, async (limit, offset, sortOrder) => {
            var _a;
            const warehouseRefId = Number((_a = payload.warehouseRefId) !== null && _a !== void 0 ? _a : payload.warehouseRef);
            const [doc, totalDoc] = await Promise.all([
                prismadatabase_1.default.inventory.findMany({
                    where: { warehouseRefId },
                    skip: offset,
                    take: limit,
                    orderBy: { createdAt: sortOrder === 1 ? 'asc' : 'desc' },
                    include: { productRef: true },
                }),
                prismadatabase_1.default.inventory.count({ where: { warehouseRefId } }),
            ]);
            return { doc, totalDoc };
        });
    }
    async findProductInfo(order) {
        return await prismadatabase_1.default.inventory.findUnique({
            where: { id: Number(order === null || order === void 0 ? void 0 : order.inventoryID) },
            include: { productRef: true },
        });
    }
    async inventoryOrderPlace(inventoryID, inventoryPayload) {
        return await prismadatabase_1.default.inventory.update({
            where: { id: inventoryID },
            data: {
                availableQuantity: inventoryPayload.availableQuantity,
                holdQuantity: inventoryPayload.holdQuantity,
            },
        });
    }
    async updateInventoryStatus(status, orderData) {
        // Implement business logic as needed
        // Example: update status field (if exists in schema)
        // If no status field, remove this or update as needed
        // return await prisma.inventory.update({
        //   where: { id: Number(orderData.inventoryID) },
        //   data: { status: status as any }, // update type if status exists
        // });
        throw new Error('Inventory status update not implemented: no status field in schema');
    }
    async updateInventoryOnOrderPlace(inventoryRef, quantity) {
        var _a, _b;
        // Decrement availableQuantity, increment holdQuantity
        const inventory = await prismadatabase_1.default.inventory.findUnique({ where: { id: inventoryRef } });
        if (!inventory)
            throw new Error('Inventory not found');
        return await prismadatabase_1.default.inventory.update({
            where: { id: inventoryRef },
            data: {
                availableQuantity: ((_a = inventory.availableQuantity) !== null && _a !== void 0 ? _a : 0) - quantity,
                holdQuantity: ((_b = inventory.holdQuantity) !== null && _b !== void 0 ? _b : 0) + quantity,
            },
        });
    }
    async findInventoryByWarehous(inventoryRef, warehouseRefId) {
        return await prismadatabase_1.default.inventory.findFirst({
            where: { id: inventoryRef, warehouseRefId },
        });
    }
}
exports.InventoryRepository = InventoryRepository;
const inventoryRepository = new InventoryRepository();
exports.default = inventoryRepository;
