import { Router } from "express";
import policiesController from "../../modules/policies/policies.controller";

const policiesRoute = Router();



policiesRoute.get("/", policiesController.getAllPolicies);


policiesRoute.get("/:slug",policiesController.getPolicyById);
//  (req, res) => {
//     res.send(`Policies GET route works for ID: ${req.params.id}`);
// }

policiesRoute.post("/", (req, res) => {
    res.send("Policies POST route works!");
});


policiesRoute.patch("/:id", (req, res) => {
    res.send(`Policies PUT route works for ID: ${req.params.id}`);
});

policiesRoute.delete("/:id", (req, res) => {
    res.send(`Policies DELETE route works for ID: ${req.params.id}`);
});





export default policiesRoute;