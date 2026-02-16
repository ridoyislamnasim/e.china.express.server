import { Router } from "express";
import addressController from "../../modules/address/address.controller";
import jwtAuth from "../../middleware/auth/jwtAuth";
// import controller from "../../modules/address/address.controller"

const AddressRouter = Router();

AddressRouter.post("/", jwtAuth(), addressController.createAddress);
AddressRouter.patch("/:id", jwtAuth(), addressController.updateAddress);

export default AddressRouter;
