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
      description: description ?? null,
      boxSize: payload.boxSize ?? null,
      cbmToKgRatio: payload.cbmToKgRatio !== undefined ? parseFloat(payload.cbmToKgRatio) : undefined,
    };

    const shippingMethod = await this.repository.createShippingMethod(shippingMethodPayload);
    return  shippingMethod;
  }

  async getShippingMethod(): Promise<any> {
    const shippingMethods = await this.repository.getShippingMethod();
    return shippingMethods;
  }

  async getShippingMethodWithPagination(payload: any): Promise<any> {
    const allShippingMethods = await this.repository.getShippingMethodWithPagination(payload);
    return allShippingMethods;
  }
  async getSingleShippingMethod(id: string): Promise<any> {
    const shippingMethod = await this.repository.getSingleShippingMethod(id);
    if (!shippingMethod) {
      const error = new Error('Shipping Method Not Found');
      (error as any).statusCode = 404;
      throw error;
    }
    return shippingMethod;
  }
  
  async updateShippingMethod(id: string, payload: any): Promise<any> {
  //  GET GY ID THAN CHECK IF EXISTS
    const existingShippingMethod = await this.repository.getSingleShippingMethod(id);
    if (!existingShippingMethod) {
      const error = new Error('Shipping Method Not Found');
      (error as any).statusCode = 404;
      throw error;
    }
    const payloadData = {
      name: payload.name ?? existingShippingMethod.name,
      description: payload.description ?? existingShippingMethod.description,
      boxSize: payload.boxSize ?? existingShippingMethod.boxSize,
      cbmToKgRatio: payload.cbmToKgRatio !== undefined ? parseFloat(payload.cbmToKgRatio) : existingShippingMethod.cbmToKgRatio,
    };
    const updatedShippingMethod = await this.repository.updateShippingMethod(id, payloadData);
    return updatedShippingMethod;

   
  }

  async deleteShippingMethod(id: string): Promise<any> {
    //  GET BY ID THAN CHECK IF EXISTS
    const existingShippingMethod = await this.repository.getSingleShippingMethod(id);
    if (!existingShippingMethod) {
      const error = new Error('Shipping Method Not Found');
      (error as any).statusCode = 404;
      throw error;
    }
    const deletedShippingMethod = await this.repository.deleteShippingMethod(id);
    return deletedShippingMethod;
  }

}

