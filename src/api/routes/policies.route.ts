import { Router } from "express";
import policiesController from "../../modules/policies/policies.controller";

const policiesRoute = Router();

/* ==============================
   Policy Types (Categories)
================================ */
policiesRoute
  .route("/policy-types")
  .get(policiesController.getAllPolicyTypes)
  .post(policiesController.createPolicyType);

policiesRoute
  .route("/policy-types/pagination")
  .get(policiesController.getPolicyTypesWithPagination);

policiesRoute
  .route("/policy-types/:slug")
  .patch(policiesController.updatePolicyType)
  .delete(policiesController.deletePolicyType);

/* ==============================
   Policies
================================ */
policiesRoute
  .route("/")
  .get(policiesController.getAllPolicyTitles)
  .post(policiesController.createPolicy);

policiesRoute
  .route("/table-view")
  .get(policiesController.getAllPolicyTableView);

policiesRoute
  .route("/:slug")
  .get(policiesController.getPolicyById)
  .patch(policiesController.updatePolicy)
  .delete(policiesController.deletePolicy);

/* ==============================
   Policy Feedback
================================ */
policiesRoute
  .route("/:policyId/feedback/helpful")
  .patch(policiesController.addHelpfulCount);

policiesRoute
  .route("/:policyId/feedback/unhelpful")
  .patch(policiesController.addUnhelpfulCount);

export default policiesRoute;
