import { Router } from "express";
import controller from "../../modules/warehouseSpace/warehouseSpace.controller";
import { upload } from "../../middleware/upload/upload";

const warehouseSpaceRoute = Router();

warehouseSpaceRoute.route("/")
    .post(controller.createWarehouseSpace)
    .get(controller.getAllWarehouseSpaces);

warehouseSpaceRoute.get("/warehouse/:warehouseId", controller.getSpacesByWarehouse);
warehouseSpaceRoute.get("/pagination", controller.getWarehouseSpacesWithPagination);
warehouseSpaceRoute.get("/available/:warehouseId", controller.getAvailableSpacesByWarehouse);

warehouseSpaceRoute.route("/:id")
    .get(controller.getWarehouseSpaceById)
    .patch(upload.any(), controller.updateWarehouseSpace)
    .delete(controller.deleteWarehouseSpace);

// Sub-space management routes
warehouseSpaceRoute.post("/:spaceId/air-spaces", controller.createAirSpace);
warehouseSpaceRoute.post("/:spaceId/sea-spaces", controller.createSeaSpace);
warehouseSpaceRoute.post("/:spaceId/express-spaces", controller.createExpressSpace);
warehouseSpaceRoute.post("/:spaceId/inventory", controller.createInventory);

warehouseSpaceRoute.get("/:spaceId/air-spaces", controller.getAirSpaces);
warehouseSpaceRoute.get("/:spaceId/sea-spaces", controller.getSeaSpaces);
warehouseSpaceRoute.get("/:spaceId/express-spaces", controller.getExpressSpaces);
warehouseSpaceRoute.get("/:spaceId/inventory", controller.getInventory);

warehouseSpaceRoute.patch("/:spaceId/capacity", controller.updateSpaceCapacity);
warehouseSpaceRoute.get("/:spaceId/stats", controller.getSpaceStats);

export default warehouseSpaceRoute;