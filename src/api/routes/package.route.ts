import { Router } from "express";
import jwtAuth from "../../middleware/auth/jwtAuth";
import packageController from "../../modules/package/package.controller";
import { upload } from "../../middleware/upload/upload";

const PackageRoute = Router();
// PackageRoute.use(jwtAuth());

PackageRoute.route("/")
  // Added 'upload' middleware here
  .post(upload, packageController.createPackage)
  .get(packageController.getAllPackages);

PackageRoute.get("/pagination", packageController.getPackagesWithPagination);
PackageRoute.get("/by-type/:type", packageController.getPackagesByType);
PackageRoute.get("/by-status/:status", packageController.getPackagesByStatus);

PackageRoute.route("/:id")
  .get(packageController.getSinglePackage)
  // Added 'upload' middleware here
  .put(upload, packageController.updatePackage)
  .delete(packageController.deletePackage);

PackageRoute.put("/:id/status", packageController.updatePackageStatus);

export default PackageRoute;
