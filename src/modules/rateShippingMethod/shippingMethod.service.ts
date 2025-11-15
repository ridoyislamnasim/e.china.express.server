// AuthService (TypeScript version)

import shippingMethodRepository, { ShippingMethodRepository } from "./shippingMethod.repository";



export class ShippingMethodService {
  private repository: ShippingMethodRepository;
  // private roleRepository: RoleRepository;

  constructor(repository: ShippingMethodRepository = shippingMethodRepository) {
    this.repository = repository;
  }

  async createShippingMethod(payload: any): Promise<any> {
    const { name, description} = payload;

    // Validate required fields
    if (!name) {
      const error = new Error('name required');
      (error as any).statusCode = 400;
      throw error;
    }

    // Ensure description is optional
    const shippingMethodPayload  = {
      name,
      description: description ?? null
    };

    const shippingMethod = await this.repository.createShippingMethod(shippingMethodPayload);
    return  shippingMethod;
  }

  async getShippingMethod(): Promise<any> {
    const shippingMethods = await this.repository.getShippingMethod();
    return shippingMethods;
  }

}

