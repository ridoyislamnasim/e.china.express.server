"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const warehouseSpace_service_1 = require("./warehouseSpace.service");
const warehouseSpace_repository_1 = __importDefault(require("./warehouseSpace.repository"));
const responseHandler_1 = require("../../utils/responseHandler");
const withTransaction_1 = __importDefault(require("../../middleware/transactions/withTransaction"));
const warehouseSpaceService = new warehouseSpace_service_1.WarehouseSpaceService(warehouseSpace_repository_1.default);
class WarehouseSpaceController {
    constructor() {
        this.createWarehouseSpace = (0, withTransaction_1.default)(async (req, res, next, tx) => {
            try {
                const payload = req.body;
                const warehouseSpace = await warehouseSpaceService.createWarehouseSpace(payload);
                const resDoc = (0, responseHandler_1.responseHandler)(201, 'Warehouse space created successfully', warehouseSpace);
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
                const resDoc = (0, responseHandler_1.responseHandler)(200, 'Warehouse spaces retrieved successfully', warehouseSpaces);
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
                const resDoc = (0, responseHandler_1.responseHandler)(200, 'Warehouse space retrieved successfully', warehouseSpace);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        };
        this.getSpacesByWarehouse = async (req, res, next) => {
            try {
                const { warehouseId } = req.params;
                const spaces = await warehouseSpaceService.getSpacesByWarehouse(warehouseId);
                const resDoc = (0, responseHandler_1.responseHandler)(200, 'Warehouse spaces retrieved successfully', spaces);
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
                const warehouseSpaces = await warehouseSpaceService.getWarehouseSpacesWithPagination(filter, tx);
                const resDoc = (0, responseHandler_1.responseHandler)(200, 'Warehouse spaces retrieved successfully with pagination', warehouseSpaces);
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
                const resDoc = (0, responseHandler_1.responseHandler)(200, `Warehouse space with id ${id} updated successfully`, updatedWarehouseSpace);
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
                const resDoc = (0, responseHandler_1.responseHandler)(200, `Warehouse space with id ${id} deleted successfully`, null);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        };
        // Sub-space methods
        this.createAirSpace = (0, withTransaction_1.default)(async (req, res, next, tx) => {
            try {
                const { spaceId } = req.params;
                const payload = req.body;
                const airSpace = await warehouseSpaceService.createAirSpace(spaceId, payload, tx);
                const resDoc = (0, responseHandler_1.responseHandler)(201, 'Air space created successfully', airSpace);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        });
        this.createSeaSpace = (0, withTransaction_1.default)(async (req, res, next, tx) => {
            try {
                const { spaceId } = req.params;
                const payload = req.body;
                const seaSpace = await warehouseSpaceService.createSeaSpace(spaceId, payload, tx);
                const resDoc = (0, responseHandler_1.responseHandler)(201, 'Sea space created successfully', seaSpace);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        });
        this.createExpressSpace = (0, withTransaction_1.default)(async (req, res, next, tx) => {
            try {
                const { spaceId } = req.params;
                const payload = req.body;
                const expressSpace = await warehouseSpaceService.createExpressSpace(spaceId, payload, tx);
                const resDoc = (0, responseHandler_1.responseHandler)(201, 'Express space created successfully', expressSpace);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        });
        this.createInventory = (0, withTransaction_1.default)(async (req, res, next, tx) => {
            try {
                const { spaceId } = req.params;
                const payload = req.body;
                const inventory = await warehouseSpaceService.createInventory(spaceId, payload, tx);
                const resDoc = (0, responseHandler_1.responseHandler)(201, 'Inventory created successfully', inventory);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        });
        this.getAirSpaces = async (req, res, next) => {
            try {
                const { spaceId } = req.params;
                const filter = {
                    occupied: req.query.occupied ? req.query.occupied === 'true' : undefined,
                };
                const airSpaces = await warehouseSpaceService.getAirSpaces(spaceId, filter);
                const resDoc = (0, responseHandler_1.responseHandler)(200, 'Air spaces retrieved successfully', airSpaces);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        };
        this.getSeaSpaces = async (req, res, next) => {
            try {
                const { spaceId } = req.params;
                const filter = {
                    occupied: req.query.occupied ? req.query.occupied === 'true' : undefined,
                };
                const seaSpaces = await warehouseSpaceService.getSeaSpaces(spaceId, filter);
                const resDoc = (0, responseHandler_1.responseHandler)(200, 'Sea spaces retrieved successfully', seaSpaces);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        };
        this.getExpressSpaces = async (req, res, next) => {
            try {
                const { spaceId } = req.params;
                const filter = {
                    occupied: req.query.occupied ? req.query.occupied === 'true' : undefined,
                };
                const expressSpaces = await warehouseSpaceService.getExpressSpaces(spaceId, filter);
                const resDoc = (0, responseHandler_1.responseHandler)(200, 'Express spaces retrieved successfully', expressSpaces);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        };
        this.getInventory = async (req, res, next) => {
            try {
                const { spaceId } = req.params;
                const inventory = await warehouseSpaceService.getInventory(spaceId);
                const resDoc = (0, responseHandler_1.responseHandler)(200, 'Inventory retrieved successfully', inventory);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        };
        this.updateSpaceCapacity = (0, withTransaction_1.default)(async (req, res, next, tx) => {
            try {
                const { spaceId } = req.params;
                const { totalCapacity } = req.body;
                if (!totalCapacity) {
                    const error = new Error('totalCapacity is required');
                    error.statusCode = 400;
                    throw error;
                }
                const space = await warehouseSpaceService.updateSpaceCapacity(spaceId, totalCapacity, tx);
                const resDoc = (0, responseHandler_1.responseHandler)(200, 'Space capacity updated successfully', space);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        });
        this.getAvailableSpacesByWarehouse = async (req, res, next) => {
            try {
                const { warehouseId } = req.params;
                const { spaceType } = req.query;
                const availableSpaces = await warehouseSpaceService.getAvailableSpacesByWarehouse(warehouseId, spaceType);
                const resDoc = (0, responseHandler_1.responseHandler)(200, 'Available spaces retrieved successfully', availableSpaces);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        };
        this.getSpaceStats = async (req, res, next) => {
            try {
                const { spaceId } = req.params;
                const stats = await warehouseSpaceService.getSpaceStats(spaceId);
                const resDoc = (0, responseHandler_1.responseHandler)(200, 'Space statistics retrieved successfully', stats);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = new WarehouseSpaceController();
