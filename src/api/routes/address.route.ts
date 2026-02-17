import { Router } from "express";
import addressController from "../../modules/address/address.controller";
import jwtAuth from "../../middleware/auth/jwtAuth";
// import controller from "../../modules/address/address.controller"

const AddressRouter = Router();

AddressRouter.post("/", jwtAuth(), addressController.createAddress);
AddressRouter.patch("/:id", jwtAuth(), addressController.updateAddress);
AddressRouter.get("/", jwtAuth(), addressController.getAddressesByUserId);
AddressRouter.get("/:id", jwtAuth(), addressController.getAddressById);
AddressRouter.delete("/delete/:id", jwtAuth(), addressController.deleteAddress);
AddressRouter.patch(
  "/default/:id",
  jwtAuth(),
  addressController.setDefaultAddress,
);

export default AddressRouter;
