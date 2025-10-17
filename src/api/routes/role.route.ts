// import { Router } from "express";
// import controller from "../../modules/role/role.controller";
// // import jwtAuth from "../../middleware/auth/jwtAuth";
// import { upload } from "../../middleware/upload/upload";

// const RoleRoute = Router();
// // RoleRoute.use(jwtAuth());

// RoleRoute.route("/")
//   .post(controller.createRole)
//   .get(controller.getAllRole);

// RoleRoute.get("/pagination", controller.getRoleWithPagination);

// RoleRoute.route(":id")
//   .get(controller.getSingleRole)
//   .put(upload.any(), controller.updateRole)
//   .delete(controller.deleteRole);

// RoleRoute.put("/status/:id", controller.updateRoleStatus);

// export default RoleRoute;
