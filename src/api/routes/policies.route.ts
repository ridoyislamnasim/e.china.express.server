import { Router } from "express";
import policiesController from "../../modules/policies/policies.controller";

const policiesRoute = Router();



policiesRoute.get("/", policiesController.getAllPolicyTitles);

policiesRoute.get("/:slug",policiesController.getPolicyById);

policiesRoute.post("/", policiesController.createPolicy);

policiesRoute.patch("/:slug", policiesController.updatePolicy);

policiesRoute.delete("/:slug", policiesController.deletePolicy);


// policiesRoute.put("/handfulCount", (req, res) => {
//   res.send("Policies PUT route works");
// });


// policiesRoute.put("/nonHandfulCount", (req, res) => {
//   res.send("Policies PUT route works");
// });


export default policiesRoute;