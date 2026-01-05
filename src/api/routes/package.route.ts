import { Router } from "express";
import jwtAuth from "../../middleware/auth/jwtAuth";
import packageController from "../../modules/package/package.controller";

const PackageRoute = Router();
// PackageRoute.use(jwtAuth());

PackageRoute.route("/")
  .post( packageController.createPackage)
  .get(packageController.getAllPackages);

PackageRoute.get("/pagination", packageController.getPackagesWithPagination);
PackageRoute.get("/by-type/:type", packageController.getPackagesByType);
PackageRoute.get("/by-status/:status", packageController.getPackagesByStatus);

PackageRoute.route("/:id")
  .get(packageController.getSinglePackage)
  .put(packageController.updatePackage)
  .delete(packageController.deletePackage);

PackageRoute.put("/:id/status", packageController.updatePackageStatus);

export default PackageRoute;