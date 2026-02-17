import { AddressPayload } from "../../types/address.types";
import addressRepository, { AddressRepository } from "./address.repository";

export class AddressService {
  private repository: AddressRepository;

  constructor(repository: AddressRepository = addressRepository) {
    this.repository = repository;
  }

  //==================Create Address================
  async createAddress(payload: AddressPayload, tx?: any): Promise<any> {
    const { userId } = payload;

    //at first make all the existing address undefault
    await this.repository.unsetDefaultAddresses(userId, tx);

    const finalPayload = { ...payload, defaultAddress: true };

    return await this.repository.createAddress(finalPayload, tx);
  }

  //=================Update Address ================
  async updateAddress(
    id: number,
    userId: number,
    payload: Partial<AddressPayload>,
    tx?: any,
  ): Promise<any> {
    const existingAddress = await this.repository.getAddressById(id);

    if (!existingAddress) {
      throw { statusCode: 404, message: "Address not found" };
    }

    //Verify ownership
    if (existingAddress.userId !== userId) {
      throw {
        statusCode: 403,
        message: "Forbidden: You do not have permission to update this address",
      };
    }

    // If setting as default, unset other address first
    if (payload.defaultAddress === true) {
      await this.repository.unsetDefaultAddresses(existingAddress.userId, tx);
    }

    return await this.repository.updateAddress(id, payload, tx);
  }

  //================Set an Address as Default=============
  async setDefaultAddress(id: number, userId: number, tx?: any): Promise<any> {
    //get the targeted address
    const existingAddress = await this.repository.getAddressById(id);

    if (!existingAddress) {
      throw { statusCode: 404, message: "Address not found" };
    }

    //check address ownership
    if (existingAddress.userId !== userId) {
      throw {
        statusCode: 403,
        message: "Forbidden: You do not have permission to fetch this address",
      };
    }

    //unset defaultaddress
    await this.repository.unsetDefaultAddresses(userId, tx);

    //update address defaultAddress
    return await this.repository.updateAddress(
      id,
      { defaultAddress: true },
      tx,
    );
  }

  //================Get All Addresses by User Id=============
  async getAddressesByUserId(userId: number): Promise<any> {
    return await this.repository.getAllAddressByUserId(userId);
  }

  //==============Get Single Address by Id===============
  async getAddressById(id: number, userId: number): Promise<any> {
    const address = await this.repository.getAddressById(id);

    if (address.userId !== userId) {
      throw {
        statusCode: 403,
        message: "Forbidden: You do not have permission to fetch this address",
      };
    }

    return address;
  }

  //==============Delete Address by Id =================
  async deleteAddress(id: number, userId: number, tx?: any): Promise<any> {
    const existingAddress = await this.repository.getAddressById(id);
    if (!existingAddress)
      throw { statusCode: 404, message: "Address not found" };

    //check address ownership by userid
    if (existingAddress.userId !== userId) {
      throw {
        statusCode: 403,
        message: "Forbidden: You do not have permission to delete this address",
      };
    }

    return await this.repository.deleteAddress(id, tx);
  }
}
