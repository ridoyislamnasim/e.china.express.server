"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const warehouse_controller_1 = __importDefault(require("../../modules/warehouse/warehouse.controller"));
// import jwtAuth from "../../middleware/auth/jwtAuth";
// import { upload } from "../../middleware/upload/upload";
const warehouseRoute = (0, express_1.Router)();
// warehouseRoute.use(jwtAuth()); // Uncomment if authentication is required
warehouseRoute.route("/")
    .post(warehouse_controller_1.default.createWarehouse)
    .get(warehouse_controller_1.default.getAllWarehouses);
warehouseRoute.get("/stats", warehouse_controller_1.default.getWarehouseStats);
warehouseRoute.get("/available", warehouse_controller_1.default.getAvailableWarehouses);
warehouseRoute.get("/search", warehouse_controller_1.default.searchWarehouses);
warehouseRoute.get("/pagination", warehouse_controller_1.default.getWarehousesWithPagination);
warehouseRoute.get("/manager/:managerId", warehouse_controller_1.default.getWarehousesByManager);
warehouseRoute.route("/:id")
    .get(warehouse_controller_1.default.getWarehouseById)
    .patch(warehouse_controller_1.default.updateWarehouse)
    .delete(warehouse_controller_1.default.deleteWarehouse);
warehouseRoute.patch("/:id/capacity", warehouse_controller_1.default.updateWarehouseCapacity);
warehouseRoute.patch("/:id/status", warehouse_controller_1.default.changeWarehouseStatus);
exports.default = warehouseRoute;
