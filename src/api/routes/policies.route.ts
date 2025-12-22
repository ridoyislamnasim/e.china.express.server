import { Router } from "express";
import policiesController from "../../modules/policies/policies.controller";

const policiesRoute = Router();


// ==============================
// Policy Read APIs
// ==============================
policiesRoute.get("/", policiesController.getAllPolicyTitles);
policiesRoute.get("/table-view", policiesController.getAllPolicyTableView);
policiesRoute.get("/type", policiesController.getAllPolicyTypes);
policiesRoute.get("/type-pagination", policiesController.getPolicyTypesWithPagination);
policiesRoute.get("/:slug", policiesController.getPolicyById);

// ==============================
// Policy Create APIs
// ==============================
policiesRoute.post("/", policiesController.createPolicy);
policiesRoute.post("/create-policy-type", policiesController.createPolicyType);

// ==============================
// Policy Update APIs
// ==============================
policiesRoute.patch("/:slug", policiesController.updatePolicy);
policiesRoute.patch("/add-policy-helpful", policiesController.addHelpfulCount);
policiesRoute.patch("/add-policy-unhelpful", policiesController.addUnhelpfulCount);

// ==============================
// Policy Delete APIs
// ==============================
policiesRoute.delete("/:slug", policiesController.deletePolicy);
policiesRoute.delete("/policy-type/:slug", policiesController.deletePolicyType);


// policiesRoute.put("/handfulCount", (req, res) => {
//   res.send("Policies PUT route works");
// });


// policiesRoute.put("/nonHandfulCount", (req, res) => {
//   res.send("Policies PUT route works");
// });


export default policiesRoute;