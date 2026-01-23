"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const role_controller_1 = __importDefault(require("../../modules/role/role.controller"));
const jwtAuth_1 = __importDefault(require("../../middleware/auth/jwtAuth"));
const RoleRoute = (0, express_1.Router)();
// RoleRoute.use(jwtAuth());
RoleRoute.route("/")
    .post((0, jwtAuth_1.default)(["superAdmin"]), role_controller_1.default.createRole)
    //   .get(jwtAuth(["superAdmin"]) ,controller.getAllRole);
    .get((0, jwtAuth_1.default)(["superAdmin"]), role_controller_1.default.getAllRole);
RoleRoute.get("/auth", (0, jwtAuth_1.default)(), role_controller_1.default.getAuthRole);
RoleRoute.get("/pagination", (0, jwtAuth_1.default)(["superAdmin"]), role_controller_1.default.getRoleWithPagination);
RoleRoute.route("/:id")
    .get((0, jwtAuth_1.default)(["superAdmin"]), role_controller_1.default.getSingleRole)
    .patch((0, jwtAuth_1.default)(["superAdmin"]), role_controller_1.default.updateRole)
    .delete((0, jwtAuth_1.default)(["superAdmin"]), role_controller_1.default.deleteRole);
// RoleRoute.put("/status/:id", controller.updateRoleStatus);
exports.default = RoleRoute;
