"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_1 = require("../../middleware/upload/upload");
const warehouseSpace_controller_1 = __importDefault(require("../../modules/warehouseSpace/warehouseSpace.controller"));
const warehouseSpaceRoute = (0, express_1.Router)();
warehouseSpaceRoute.route("/")
    .post(warehouseSpace_controller_1.default.createWarehouseSpace)
    .get(warehouseSpace_controller_1.default.getAllWarehouseSpaces);
warehouseSpaceRoute.get("/pagination", warehouseSpace_controller_1.default.getWarehouseSpacesWithPagination);
warehouseSpaceRoute.get("/warehouse/:warehouseId", warehouseSpace_controller_1.default.getSpacesByWarehouse);
warehouseSpaceRoute.get("/stats/:warehouseId", warehouseSpace_controller_1.default.getWarehouseSpaceStats);
warehouseSpaceRoute.get("/available/:warehouseId", warehouseSpace_controller_1.default.getAvailableSpaces);
warehouseSpaceRoute.get("/search", warehouseSpace_controller_1.default.searchSpaces);
warehouseSpaceRoute.route("/:id")
    .get(warehouseSpace_controller_1.default.getWarehouseSpaceById)
    .patch(upload_1.upload, warehouseSpace_controller_1.default.updateWarehouseSpace)
    .delete(warehouseSpace_controller_1.default.deleteWarehouseSpace);
warehouseSpaceRoute.post("/spaces/:warehouseSpaceId", warehouseSpace_controller_1.default.createSpace);
warehouseSpaceRoute.post("/inventories/:warehouseSpaceId", warehouseSpace_controller_1.default.createInventory);
warehouseSpaceRoute.get("/spaces/:warehouseSpaceId", warehouseSpace_controller_1.default.getAllSpaces);
warehouseSpaceRoute.get("/spaces/warehouse/:warehouseId", warehouseSpace_controller_1.default.getAllSpacesByWarehouseId);
warehouseSpaceRoute.get("/inventories/:warehouseSpaceId", warehouseSpace_controller_1.default.getAllInventories);
warehouseSpaceRoute.route("/spaces/:spaceId")
    .get(warehouseSpace_controller_1.default.getSpaceById)
    .patch(warehouseSpace_controller_1.default.updateSpace)
    .delete(warehouseSpace_controller_1.default.deleteSpace);
warehouseSpaceRoute.route("/inventories/:inventoryId")
    .get(warehouseSpace_controller_1.default.getInventoryById)
    .patch(warehouseSpace_controller_1.default.updateInventory)
    .delete(warehouseSpace_controller_1.default.deleteInventory);
warehouseSpaceRoute.patch("/spaces/:spaceId/occupancy", warehouseSpace_controller_1.default.updateSpaceOccupancy);
warehouseSpaceRoute.patch("/inventories/:inventoryId/occupancy", warehouseSpace_controller_1.default.updateInventoryOccupancy);
exports.default = warehouseSpaceRoute;
