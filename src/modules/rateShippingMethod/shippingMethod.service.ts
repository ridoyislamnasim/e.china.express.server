// AuthService (TypeScript version)

import shippingMethodRepository, { ShippingMethodRepository } from "./shippingMethod.repository";



export class ShippingMethodService {
  private repository: ShippingMethodRepository;
  // private roleRepository: RoleRepository;

  constructor(repository: ShippingMethodRepository = shippingMethodRepository) {
    this.repository = repository;
  }

  // async createUser(payload: any, session?: any) {
  //   const { name, email, password } = payload;
  //   if (!name || !password) {
  //     const error = new Error('name and password are required');
  //     (error as any).statusCode = 400;
  //     throw error;
  //   }
  //   const user = await this.repository.createUser({ name, email, password });
  //   return user;
  // }
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

}

