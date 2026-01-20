import { Router } from "express";
import controller from "../../modules/role/role.controller";
import jwtAuth from "../../middleware/auth/jwtAuth";
import { upload } from "../../middleware/upload/upload";

const RoleRoute = Router();
// RoleRoute.use(jwtAuth());

RoleRoute.route("/")
  .post(jwtAuth(["superAdmin"]),controller.createRole)
//   .get(jwtAuth(["superAdmin"]) ,controller.getAllRole);
  .get(jwtAuth(["superAdmin"]) ,controller.getAllRole);

RoleRoute.get("/pagination", jwtAuth(["superAdmin"]), controller.getRoleWithPagination);

RoleRoute.route("/:id")
  .get(jwtAuth(["superAdmin"]), controller.getSingleRole)
  .patch(jwtAuth(["superAdmin"]), controller.updateRole)
  .delete(jwtAuth(["superAdmin"]), controller.deleteRole);

// RoleRoute.put("/status/:id", controller.updateRoleStatus);

export default RoleRoute;
