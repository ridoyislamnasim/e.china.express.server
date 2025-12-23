import { Router } from "express";
import policiesController from "../../modules/policies/policies.controller";

const policiesRoute = Router();


policiesRoute
  .route("/type")
  .get(policiesController.getAllPolicyTypes)

policiesRoute
  .route("/create-policy-type")
  .post(policiesController.createPolicyType);

policiesRoute
  .route("/type-pagination")
  .get(policiesController.getPolicyTypesWithPagination);

policiesRoute
  .route("/update-policy-type/:slug")
  .patch(policiesController.updatePolicyType)


policiesRoute
  .route("/policy-type/:slug")
  .delete(policiesController.deletePolicyType);




policiesRoute
  .route("/table-view")
  .get(policiesController.getAllPolicyTableView);

policiesRoute
  .route("/get-single-policy/:id")
  .get(policiesController.getSinglePolicyById);


  policiesRoute
  .route("/add-policy-helpful")
  .patch(policiesController.addHelpfulCount);

policiesRoute
  .route("/add-policy-unhelpful")
  .patch(policiesController.addUnhelpfulCount);



policiesRoute
  .route("/")
  .get(policiesController.getAllPolicyTitles)
  .post(policiesController.createPolicy);




policiesRoute
  .route("/:slug")
  .get(policiesController.getPolicyById)
  .patch(policiesController.updatePolicy)
  .delete(policiesController.deletePolicy);


  
export default policiesRoute;
