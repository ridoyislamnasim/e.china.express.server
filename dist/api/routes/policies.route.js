"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const policies_controller_1 = __importDefault(require("../../modules/policies/policies.controller"));
const policiesRoute = (0, express_1.Router)();
policiesRoute
    .route("/type")
    .get(policies_controller_1.default.getAllPolicyTypes);
policiesRoute
    .route("/create-policy-type")
    .post(policies_controller_1.default.createPolicyType);
policiesRoute
    .route("/type-pagination")
    .get(policies_controller_1.default.getPolicyTypesWithPagination);
policiesRoute
    .route("/update-policy-type/:slug")
    .patch(policies_controller_1.default.updatePolicyType);
policiesRoute
    .route("/policy-type/:slug")
    .delete(policies_controller_1.default.deletePolicyType);
policiesRoute
    .route("/table-view")
    .get(policies_controller_1.default.getAllPolicyTableView);
policiesRoute
    .route("/get-single-policy/:id")
    .get(policies_controller_1.default.getSinglePolicyById);
policiesRoute
    .route("/add-policy-helpful")
    .patch(policies_controller_1.default.addHelpfulCount);
policiesRoute
    .route("/add-policy-unhelpful")
    .patch(policies_controller_1.default.addUnhelpfulCount);
policiesRoute
    .route("/")
    .get(policies_controller_1.default.getAllPolicyTitles)
    .post(policies_controller_1.default.createPolicy);
policiesRoute
    .route("/:slug")
    .get(policies_controller_1.default.getPolicyById)
    .patch(policies_controller_1.default.updatePolicy)
    .delete(policies_controller_1.default.deletePolicy);
exports.default = policiesRoute;
