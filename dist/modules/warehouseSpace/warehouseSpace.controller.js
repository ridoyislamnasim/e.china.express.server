"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responseHandler_1 = require("../../utils/responseHandler");
const withTransaction_1 = __importDefault(require("../../middleware/transactions/withTransaction"));
const warehouseSpace_repository_1 = require("./warehouseSpace.repository");
const warehouseSpace_service_1 = __importDefault(require("./warehouseSpace.service"));
const warehouseSpaceService = new warehouseSpace_repository_1.WarehouseSpaceService(warehouseSpace_service_1.default);
class WarehouseSpaceController {
    constructor() {
        // WarehouseSpace CRUD
        this.createWarehouseSpace = (0, withTransaction_1.default)(async (req, res, next, tx) => {
            try {
                const payload = req.body;
                const warehouseSpace = await warehouseSpaceService.createWarehouseSpace(payload);
                const resDoc = (0, responseHandler_1.responseHandler)(201, "Warehouse space created successfully", warehouseSpace);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        });
        this.getAllWarehouseSpaces = async (req, res, next) => {
            try {
                const filter = {
                    warehouseId: req.query.warehouseId,
                    search: req.query.search,
                };
                const warehouseSpaces = await warehouseSpaceService.getAllWarehouseSpaces(filter);
                const resDoc = (0, responseHandler_1.responseHandler)(200, "Warehouse spaces retrieved successfully", warehouseSpaces);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        };
        this.getWarehouseSpaceById = async (req, res, next) => {
            try {
                const { id } = req.params;
                const warehouseSpace = await warehouseSpaceService.getWarehouseSpaceById(id);
                const resDoc = (0, responseHandler_1.responseHandler)(200, "Warehouse space retrieved successfully", warehouseSpace);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        };
        this.getWarehouseSpacesWithPagination = (0, withTransaction_1.default)(async (req, res, next, tx) => {
            try {
                const page = parseInt(req.query.page, 10) || 1;
                const limit = parseInt(req.query.limit, 10) || 10;
                const filter = {
                    page,
                    limit,
                    warehouseId: req.query.warehouseId,
                    search: req.query.search,
                };
                const result = await warehouseSpaceService.getWarehouseSpacesWithPagination(filter, tx);
                const resDoc = (0, responseHandler_1.responseHandler)(200, "Warehouse spaces retrieved successfully", result);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        });
        this.updateWarehouseSpace = (0, withTransaction_1.default)(async (req, res, next, tx) => {
            try {
                const { id } = req.params;
                const payload = req.body;
                const updatedWarehouseSpace = await warehouseSpaceService.updateWarehouseSpace(id, payload, tx);
                const resDoc = (0, responseHandler_1.responseHandler)(200, "Warehouse space updated successfully", updatedWarehouseSpace);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        });
        this.deleteWarehouseSpace = async (req, res, next) => {
            try {
                const { id } = req.params;
                await warehouseSpaceService.deleteWarehouseSpace(id);
                const resDoc = (0, responseHandler_1.responseHandler)(200, "Warehouse space deleted successfully", null);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        };
        // Space CRUD
        this.createSpace = (0, withTransaction_1.default)(async (req, res, next, tx) => {
            try {
                const { warehouseSpaceId } = req.params;
                const payload = req.body;
                // console.log('Received createSpace request:', { warehouseSpaceId, payload });
                const space = await warehouseSpaceService.createSpace(warehouseSpaceId, payload, tx);
                const resDoc = (0, responseHandler_1.responseHandler)(201, "Space created successfully", space);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        });
        this.getAllSpaces = async (req, res, next) => {
            try {
                const { warehouseSpaceId } = req.params;
                const filter = {
                    type: req.query.type,
                    occupied: req.query.occupied
                        ? req.query.occupied === "true"
                        : undefined,
                    search: req.query.search,
                };
                const spaces = await warehouseSpaceService.getAllSpaces(warehouseSpaceId, filter);
                const resDoc = (0, responseHandler_1.responseHandler)(200, "Spaces retrieved successfully", spaces);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        };
        this.getSpaceById = async (req, res, next) => {
            try {
                const { spaceId } = req.params;
                const space = await warehouseSpaceService.getSpaceById(spaceId);
                const resDoc = (0, responseHandler_1.responseHandler)(200, "Space retrieved successfully", space);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        };
        this.updateSpace = (0, withTransaction_1.default)(async (req, res, next, tx) => {
            try {
                const { spaceId } = req.params;
                const payload = req.body;
                const updatedSpace = await warehouseSpaceService.updateSpace(spaceId, payload, tx);
                const resDoc = (0, responseHandler_1.responseHandler)(200, "Space updated successfully", updatedSpace);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        });
        this.deleteSpace = async (req, res, next) => {
            try {
                const { spaceId } = req.params;
                await warehouseSpaceService.deleteSpace(spaceId);
                const resDoc = (0, responseHandler_1.responseHandler)(200, "Space deleted successfully", null);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        };
        // Inventory CRUD
        this.createInventory = (0, withTransaction_1.default)(async (req, res, next, tx) => {
            try {
                const { warehouseSpaceId } = req.params;
                const payload = req.body;
                const inventory = await warehouseSpaceService.createInventory(warehouseSpaceId, payload, tx);
                const resDoc = (0, responseHandler_1.responseHandler)(201, "Inventory created successfully", inventory);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        });
        this.getAllInventories = async (req, res, next) => {
            try {
                const { warehouseSpaceId } = req.params;
                const filter = {
                    type: req.query.type,
                    occupied: req.query.occupied
                        ? req.query.occupied === "true"
                        : undefined,
                    search: req.query.search,
                };
                const inventories = await warehouseSpaceService.getAllInventories(warehouseSpaceId, filter);
                const resDoc = (0, responseHandler_1.responseHandler)(200, "Inventories retrieved successfully", inventories);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        };
        this.getInventoryById = async (req, res, next) => {
            try {
                const { inventoryId } = req.params;
                const inventory = await warehouseSpaceService.getInventoryById(inventoryId);
                const resDoc = (0, responseHandler_1.responseHandler)(200, "Inventory retrieved successfully", inventory);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        };
        this.updateInventory = (0, withTransaction_1.default)(async (req, res, next, tx) => {
            try {
                const { inventoryId } = req.params;
                const payload = req.body;
                const updatedInventory = await warehouseSpaceService.updateInventory(inventoryId, payload, tx);
                const resDoc = (0, responseHandler_1.responseHandler)(200, "Inventory updated successfully", updatedInventory);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        });
        this.deleteInventory = async (req, res, next) => {
            try {
                const { inventoryId } = req.params;
                await warehouseSpaceService.deleteInventory(inventoryId);
                const resDoc = (0, responseHandler_1.responseHandler)(200, "Inventory deleted successfully", null);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        };
        // Additional operations
        this.updateSpaceOccupancy = (0, withTransaction_1.default)(async (req, res, next, tx) => {
            try {
                const { spaceId } = req.params;
                const { occupied } = req.body;
                if (typeof occupied !== "boolean") {
                    const error = new Error("Occupied must be a boolean value");
                    error.statusCode = 400;
                    throw error;
                }
                const space = await warehouseSpaceService.updateSpaceOccupancy(spaceId, occupied, tx);
                const resDoc = (0, responseHandler_1.responseHandler)(200, "Space occupancy updated successfully", space);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        });
        this.updateInventoryOccupancy = (0, withTransaction_1.default)(async (req, res, next, tx) => {
            try {
                const { inventoryId } = req.params;
                const { occupied } = req.body;
                if (typeof occupied !== "boolean") {
                    const error = new Error("Occupied must be a boolean value");
                    error.statusCode = 400;
                    throw error;
                }
                const inventory = await warehouseSpaceService.updateInventoryOccupancy(inventoryId, occupied, tx);
                const resDoc = (0, responseHandler_1.responseHandler)(200, "Inventory occupancy updated successfully", inventory);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        });
        this.getSpacesByWarehouse = async (req, res, next) => {
            try {
                const { warehouseId } = req.params;
                const spaces = await warehouseSpaceService.getSpacesByWarehouse(warehouseId);
                const resDoc = (0, responseHandler_1.responseHandler)(200, "Spaces retrieved successfully", spaces);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        };
        this.getWarehouseSpaceStats = async (req, res, next) => {
            try {
                const { warehouseId } = req.params;
                const stats = await warehouseSpaceService.getWarehouseSpaceStats(warehouseId);
                const resDoc = (0, responseHandler_1.responseHandler)(200, "Warehouse space statistics retrieved successfully", stats);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        };
        this.getAvailableSpaces = async (req, res, next) => {
            try {
                const { warehouseId } = req.params;
                const type = req.query.type;
                const spaces = await warehouseSpaceService.getAvailableSpaces(warehouseId, type);
                const resDoc = (0, responseHandler_1.responseHandler)(200, "Available spaces retrieved successfully", spaces);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        };
        this.searchSpaces = async (req, res, next) => {
            try {
                const { search, warehouseId } = req.query;
                if (!search) {
                    const error = new Error("Search term is required");
                    error.statusCode = 400;
                    throw error;
                }
                const spaces = await warehouseSpaceService.searchSpaces(search, warehouseId);
                const resDoc = (0, responseHandler_1.responseHandler)(200, "Spaces retrieved successfully", spaces);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = new WarehouseSpaceController();
