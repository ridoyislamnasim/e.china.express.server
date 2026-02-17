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
        const payload = createAddressSchema.parse({
          ...req.body,
          userId,
        });
        const address = await addressService.createAddress(payload, tx);
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

  //================Set an Address as Default=============
  setDefaultAddress = withTransaction(
    async (req: Request, res: Response, next: NextFunction, tx?: any) => {
      try {
        const id = parseInt(req.params.id as string, 10);
        const userId = req.user.user_info_encrypted.id;

        const updatedAddress = await addressService.setDefaultAddress(
          id,
          userId,
          tx,
        );
        const resDoc = responseHandler(
          200,
          "Default address set successfully",
          updatedAddress,
        );
        res.status(resDoc.statusCode).json(resDoc);
      } catch (error) {
        next(error);
      }
    },
  );

  //================Get All Addresses by User Id=============
  getAddressesByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user.user_info_encrypted.id;
      const addresses = await addressService.getAddressesByUserId(userId);
      const resDoc = responseHandler(
        200,
        "User addresses retrieved successfully",
        addresses,
      );
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };

  //==============Get Single Address by Id===============
  getAddressById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string, 10);
      const userId = req.user.user_info_encrypted.id;
      const address = await addressService.getAddressById(id, userId);

      const resDoc = responseHandler(
        200,
        "Address retrieved successfully",
        address,
      );
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };

  //================Delete Address by Id=============
  deleteAddress = withTransaction(
    async (req: Request, res: Response, next: NextFunction, tx?: any) => {
      try {
        const id = parseInt(req.params.id as string, 10);
        const userId = req.user.user_info_encrypted.id;
        await addressService.deleteAddress(id, userId, tx);

        const resDoc = responseHandler(
          200,
          "Address deleted successfully",
          null,
        );
        res.status(resDoc.statusCode).json(resDoc);
      } catch (error) {
        next(error);
      }
    },
  );
}

export default new AddressController();
