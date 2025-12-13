"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const warehouseSpace_controller_1 = __importDefault(require("../../modules/warehouseSpace/warehouseSpace.controller"));
const upload_1 = require("../../middleware/upload/upload");
const warehouseSpaceRoute = (0, express_1.Router)();
warehouseSpaceRoute.route("/")
    .post(warehouseSpace_controller_1.default.createWarehouseSpace)
    .get(warehouseSpace_controller_1.default.getAllWarehouseSpaces);
warehouseSpaceRoute.get("/warehouse/:warehouseId", warehouseSpace_controller_1.default.getSpacesByWarehouse);
warehouseSpaceRoute.get("/pagination", warehouseSpace_controller_1.default.getWarehouseSpacesWithPagination);
warehouseSpaceRoute.get("/available/:warehouseId", warehouseSpace_controller_1.default.getAvailableSpacesByWarehouse);
warehouseSpaceRoute.route("/:id")
    .get(warehouseSpace_controller_1.default.getWarehouseSpaceById)
    .patch(upload_1.upload.any(), warehouseSpace_controller_1.default.updateWarehouseSpace)
    .delete(warehouseSpace_controller_1.default.deleteWarehouseSpace);
// Sub-space management routes
warehouseSpaceRoute.post("/:spaceId/air-spaces", warehouseSpace_controller_1.default.createAirSpace);
warehouseSpaceRoute.post("/:spaceId/sea-spaces", warehouseSpace_controller_1.default.createSeaSpace);
warehouseSpaceRoute.post("/:spaceId/express-spaces", warehouseSpace_controller_1.default.createExpressSpace);
warehouseSpaceRoute.post("/:spaceId/inventory", warehouseSpace_controller_1.default.createInventory);
warehouseSpaceRoute.get("/:spaceId/air-spaces", warehouseSpace_controller_1.default.getAirSpaces);
warehouseSpaceRoute.get("/:spaceId/sea-spaces", warehouseSpace_controller_1.default.getSeaSpaces);
warehouseSpaceRoute.get("/:spaceId/express-spaces", warehouseSpace_controller_1.default.getExpressSpaces);
warehouseSpaceRoute.get("/:spaceId/inventory", warehouseSpace_controller_1.default.getInventory);
warehouseSpaceRoute.patch("/:spaceId/capacity", warehouseSpace_controller_1.default.updateSpaceCapacity);
warehouseSpaceRoute.get("/:spaceId/stats", warehouseSpace_controller_1.default.getSpaceStats);
exports.default = warehouseSpaceRoute;
