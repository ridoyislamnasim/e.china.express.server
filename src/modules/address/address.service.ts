import { AddressPayload } from "../../types/address.types";
import addressRepository, { AddressRepository } from "./address.repository";

export class AddressService {
  private repository: AddressRepository;

  constructor(repository: AddressRepository = addressRepository) {
    this.repository = repository;
  }

  //==================Create Address================
  async createAddress(payload: AddressPayload, tx?: any): Promise<any> {
    const { userId, defaultAddress } = payload;

    //check if user has any default address
    const addressCount = await this.repository.countUserAddresses(userId);

    let isDefault = defaultAddress || false;
    if (addressCount === 0) {
      isDefault = true;
    }

    if (isDefault) {
      await this.repository.unsetDefaultAddresses(userId, tx);
    }

    const finalPayload = { ...payload, defaultAddress: isDefault };

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
}
