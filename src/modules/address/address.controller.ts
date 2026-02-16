import { Request, Response, NextFunction } from "express";
import withTransaction from "../../middleware/transactions/withTransaction";
import addressRepository from "./address.repository";
import { AddressService } from "./address.service";
import { createAddressSchema, updateAddressSchema } from "./address.validation";
import { responseHandler } from "../../utils/responseHandler";

const addressService = new AddressService(addressRepository);

class AddressController {
  //==================Create Address================
  createAddress = withTransaction(
    async (req: Request, res: Response, next: NextFunction, tx: any) => {
      try {
        //get loggedin user
        const userId = req.user.user_info_encrypted.id;
        const validatedData = createAddressSchema.parse({
          ...req.body,
          userId,
        });
        const address = await addressService.createAddress(validatedData, tx);
        const resDoc = responseHandler(
          201,
          "Address created Successfully",
          address,
        );

        res.status(resDoc.statusCode).json(resDoc);
      } catch (error) {
        next(error);
      }
    },
  );

  //=================Update Address ================
  updateAddress = withTransaction(
    async (req: Request, res: Response, next: NextFunction, tx: any) => {
      try {
        const id = parseInt(req.params.id as string, 10);
        //get loggedin user
        const userId = req.user.user_info_encrypted.id;
        const payload = req.body;
        const validatedData = updateAddressSchema.parse(payload);
        const updateAddress = await addressService.updateAddress(
          id,
          userId,
          validatedData,
          tx,
        );

        const resDoc = responseHandler(
          200,
          "Address updated succssfully",
          updateAddress,
        );
        res.status(resDoc.statusCode).json(resDoc);
      } catch (error) {
        next(error);
      }
    },
  );
}

export default new AddressController();
