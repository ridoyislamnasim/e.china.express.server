import { Router } from "express";
import addressController from "../../modules/address/address.controller";
import jwtAuth from "../../middleware/auth/jwtAuth";
// import controller from "../../modules/address/address.controller"

const AddressRouter = Router();

AddressRouter.route("/")
  .post(jwtAuth(), addressController.createAddress)
  .get(jwtAuth(), addressController.getAddressesByUserId);

AddressRouter.route("/:id")
  .patch(jwtAuth(), addressController.updateAddress)
  .get(jwtAuth(), addressController.getAddressById);

AddressRouter.delete("/delete/:id", jwtAuth(), addressController.deleteAddress);
AddressRouter.patch("/default/:id",jwtAuth(), addressController.setDefaultAddress);

export default AddressRouter;
