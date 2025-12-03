"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const warehouse_service_1 = require("./warehouse.service");
const warehouse_repository_1 = __importDefault(require("./warehouse.repository"));
const responseHandler_1 = require("../../utils/responseHandler");
const withTransaction_1 = __importDefault(require("../../middleware/transactions/withTransaction"));
const warehouseService = new warehouse_service_1.WarehouseService(warehouse_repository_1.default);
class WarehouseController {
    constructor() {
        this.createWarehouse = (0, withTransaction_1.default)(async (req, res, next, tx) => {
            try {
                const payload = req.body;
                const warehouse = await warehouseService.createWarehouse(payload);
                const resDoc = (0, responseHandler_1.responseHandler)(201, 'Warehouse created successfully', warehouse);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        });
        this.getAllWarehouses = async (req, res, next) => {
            try {
                const filter = {
                    status: req.query.status,
                    type: req.query.type,
                    countryId: req.query.countryId ? parseInt(req.query.countryId) : undefined,
                    search: req.query.search,
                };
                const warehouses = await warehouseService.getAllWarehouses(filter);
                const resDoc = (0, responseHandler_1.responseHandler)(200, 'Warehouses retrieved successfully', warehouses);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        };
        this.getWarehouseById = async (req, res, next) => {
            try {
                const { id } = req.params;
                const warehouse = await warehouseService.getWarehouseById(id);
                const resDoc = (0, responseHandler_1.responseHandler)(200, 'Warehouse retrieved successfully', warehouse);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        };
        this.getWarehousesWithPagination = (0, withTransaction_1.default)(async (req, res, next, tx) => {
            try {
                const page = parseInt(req.query.page, 10) || 1;
                const limit = parseInt(req.query.limit, 10) || 10;
                const filter = {
                    page,
                    limit,
                    status: req.query.status,
                    type: req.query.type,
                    countryId: req.query.countryId ? parseInt(req.query.countryId) : undefined,
                    search: req.query.search,
                };
                const warehouses = await warehouseService.getWarehousesWithPagination(filter, tx);
                const resDoc = (0, responseHandler_1.responseHandler)(200, 'Warehouses retrieved successfully with pagination', warehouses);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        });
        this.updateWarehouse = (0, withTransaction_1.default)(async (req, res, next, tx) => {
            try {
                const { id } = req.params;
                const payload = req.body;
                const updatedWarehouse = await warehouseService.updateWarehouse(id, payload, tx);
                const resDoc = (0, responseHandler_1.responseHandler)(200, `Warehouse with id ${id} updated successfully`, updatedWarehouse);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        });
        this.deleteWarehouse = async (req, res, next) => {
            try {
                const { id } = req.params;
                await warehouseService.deleteWarehouse(id);
                const resDoc = (0, responseHandler_1.responseHandler)(200, `Warehouse with id ${id} deleted successfully`, null);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        };
        this.updateWarehouseCapacity = (0, withTransaction_1.default)(async (req, res, next, tx) => {
            try {
                const { id } = req.params;
                const { usedCapacity } = req.body;
                if (!usedCapacity && usedCapacity !== 0) {
                    const error = new Error('usedCapacity is required');
                    error.statusCode = 400;
                    throw error;
                }
                const warehouse = await warehouseService.updateWarehouseCapacity(id, usedCapacity, tx);
                const resDoc = (0, responseHandler_1.responseHandler)(200, 'Warehouse capacity updated successfully', warehouse);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        });
        this.getWarehouseStats = async (req, res, next) => {
            try {
                const stats = await warehouseService.getWarehouseStats();
                const resDoc = (0, responseHandler_1.responseHandler)(200, 'Warehouse statistics retrieved successfully', stats);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        };
        this.getWarehousesByManager = async (req, res, next) => {
            try {
                const { managerId } = req.params;
                const warehouses = await warehouseService.getWarehousesByManager(parseInt(managerId));
                const resDoc = (0, responseHandler_1.responseHandler)(200, 'Warehouses retrieved successfully', warehouses);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        };
        this.getAvailableWarehouses = async (req, res, next) => {
            try {
                const minAvailableCapacity = req.query.minAvailableCapacity
                    ? parseInt(req.query.minAvailableCapacity)
                    : 0;
                const warehouses = await warehouseService.getAvailableCapacityWarehouses(minAvailableCapacity);
                const resDoc = (0, responseHandler_1.responseHandler)(200, 'Available warehouses retrieved successfully', warehouses);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        };
        this.searchWarehouses = async (req, res, next) => {
            try {
                const { search } = req.query;
                if (!search) {
                    const error = new Error('Search term is required');
                    error.statusCode = 400;
                    throw error;
                }
                const warehouses = await warehouseService.searchWarehouses(search);
                const resDoc = (0, responseHandler_1.responseHandler)(200, 'Warehouses retrieved successfully', warehouses);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        };
        this.changeWarehouseStatus = (0, withTransaction_1.default)(async (req, res, next, tx) => {
            try {
                const { id } = req.params;
                const { status } = req.body;
                if (!status) {
                    const error = new Error('Status is required');
                    error.statusCode = 400;
                    throw error;
                }
                const warehouse = await warehouseService.changeWarehouseStatus(id, status);
                const resDoc = (0, responseHandler_1.responseHandler)(200, 'Warehouse status updated successfully', warehouse);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new WarehouseController();
