import { Router } from "express";
import controller from "../../modules/package/package.controller";
import jwtAuth from "../../middleware/auth/jwtAuth";

const PackageRoute = Router();
PackageRoute.use(jwtAuth());

PackageRoute.route("/")
  .post(jwtAuth(), controller.createPackage)
  .get(controller.getAllPackages);

PackageRoute.get("/pagination", controller.getPackagesWithPagination);
PackageRoute.get("/by-type/:type", controller.getPackagesByType);
PackageRoute.get("/by-status/:status", controller.getPackagesByStatus);

PackageRoute.route("/:id")
  .get(controller.getSinglePackage)
  .put(controller.updatePackage)
  .delete(controller.deletePackage);

PackageRoute.put("/:id/status", controller.updatePackageStatus);

export default PackageRoute;