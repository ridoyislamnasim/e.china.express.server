import { Router } from "express";
import { upload } from "../../middleware/upload/upload";
import controller from "../../modules/warehouseSpace/warehouseSpace.controller";

const warehouseSpaceRoute = Router();

warehouseSpaceRoute.route("/")
    .post(controller.createWarehouseSpace)
    .get(controller.getAllWarehouseSpaces);

warehouseSpaceRoute.get("/pagination", controller.getWarehouseSpacesWithPagination);
warehouseSpaceRoute.get("/warehouse/:warehouseId", controller.getSpacesByWarehouse);
warehouseSpaceRoute.get("/stats/:warehouseId", controller.getWarehouseSpaceStats);
warehouseSpaceRoute.get("/available/:warehouseId", controller.getAvailableSpaces);
warehouseSpaceRoute.get("/search", controller.searchSpaces);

warehouseSpaceRoute.route("/:id")
    .get(controller.getWarehouseSpaceById)
    .patch(upload, controller.updateWarehouseSpace)
    .delete(controller.deleteWarehouseSpace);

warehouseSpaceRoute.post("/spaces/:warehouseSpaceId", controller.createSpace);
warehouseSpaceRoute.post("/inventories/:warehouseSpaceId", controller.createInventory);
warehouseSpaceRoute.get("/spaces/:warehouseSpaceId", controller.getAllSpaces);
warehouseSpaceRoute.get("/inventories/:warehouseSpaceId", controller.getAllInventories);

warehouseSpaceRoute.route("/spaces/:spaceId")
    .get(controller.getSpaceById)
    .patch(controller.updateSpace)
    .delete(controller.deleteSpace);

warehouseSpaceRoute.route("/inventories/:inventoryId")
    .get(controller.getInventoryById)
    .patch(controller.updateInventory)
    .delete(controller.deleteInventory);

warehouseSpaceRoute.patch("/spaces/:spaceId/occupancy", controller.updateSpaceOccupancy);
warehouseSpaceRoute.patch("/inventories/:inventoryId/occupancy", controller.updateInventoryOccupancy);


export default warehouseSpaceRoute;