"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const policies_controller_1 = __importDefault(require("../../modules/policies/policies.controller"));
const policiesRoute = (0, express_1.Router)();
policiesRoute.get("/", policies_controller_1.default.getAllPolicyTitles);
policiesRoute.get("/:slug", policies_controller_1.default.getPolicyById);
policiesRoute.post("/", policies_controller_1.default.createPolicy);
policiesRoute.post("/create-policy-type", policies_controller_1.default.createPolicyType);
policiesRoute.patch("/:slug", policies_controller_1.default.updatePolicy);
policiesRoute.delete("/:slug", policies_controller_1.default.deletePolicy);
// policiesRoute.put("/handfulCount", (req, res) => {
//   res.send("Policies PUT route works");
// });
// policiesRoute.put("/nonHandfulCount", (req, res) => {
//   res.send("Policies PUT route works");
// });
exports.default = policiesRoute;
