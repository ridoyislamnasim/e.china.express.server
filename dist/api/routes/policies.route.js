"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const policies_controller_1 = __importDefault(require("../../modules/policies/policies.controller"));
const policiesRoute = (0, express_1.Router)();
/* ==============================
   Policy Types (Categories)
================================ */
policiesRoute
    .route("/policy-types")
    .get(policies_controller_1.default.getAllPolicyTypes)
    .post(policies_controller_1.default.createPolicyType);
policiesRoute
    .route("/policy-types/pagination")
    .get(policies_controller_1.default.getPolicyTypesWithPagination);
policiesRoute
    .route("/policy-types/:slug")
    .patch(policies_controller_1.default.updatePolicyType)
    .delete(policies_controller_1.default.deletePolicyType);
/* ==============================
   Policies
================================ */
policiesRoute
    .route("/")
    .get(policies_controller_1.default.getAllPolicyTitles)
    .post(policies_controller_1.default.createPolicy);
policiesRoute
    .route("/table-view")
    .get(policies_controller_1.default.getAllPolicyTableView);
policiesRoute
    .route("/:slug")
    .get(policies_controller_1.default.getPolicyById)
    .patch(policies_controller_1.default.updatePolicy)
    .delete(policies_controller_1.default.deletePolicy);
policiesRoute
    .route("/get-single-policy/:id")
    .get(policies_controller_1.default.getSinglePolicyById);
/* ==============================
   Policy Feedback
================================ */
policiesRoute
    .route("/:policyId/feedback/helpful")
    .patch(policies_controller_1.default.addHelpfulCount);
policiesRoute
    .route("/:policyId/feedback/unhelpful")
    .patch(policies_controller_1.default.addUnhelpfulCount);
exports.default = policiesRoute;
