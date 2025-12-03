import { Router } from "express";
import controller from "../../modules/warehouse/warehouse.controller";
// import jwtAuth from "../../middleware/auth/jwtAuth";
import { upload } from "../../middleware/upload/upload";

const warehouseRoute = Router();
// warehouseRoute.use(jwtAuth()); // Uncomment if authentication is required

warehouseRoute.route("/")
    .post(controller.createWarehouse)
    .get(controller.getAllWarehouses);

warehouseRoute.get("/stats", controller.getWarehouseStats);
warehouseRoute.get("/available", controller.getAvailableWarehouses);
warehouseRoute.get("/search", controller.searchWarehouses);

warehouseRoute.get("/pagination", controller.getWarehousesWithPagination);
warehouseRoute.get("/manager/:managerId", controller.getWarehousesByManager);

warehouseRoute.route("/:id")
    .get(controller.getWarehouseById)
    .patch(upload.any(), controller.updateWarehouse)
    .delete(controller.deleteWarehouse);

warehouseRoute.patch("/:id/capacity", controller.updateWarehouseCapacity);
warehouseRoute.patch("/:id/status", controller.changeWarehouseStatus);

export default warehouseRoute;