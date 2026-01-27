// AuthService (TypeScript version)
// import ContainerPayload from '../../types/container.type';
import { is } from 'zod/v4/locales';

import containerRepository, { ContainerRepository } from './container.repository';
import ContainerPayload from '../../types/container.type';


export class ContainerService {
  private repository: ContainerRepository;
  // private roleRepository: RoleRepository;

  constructor(repository: ContainerRepository = containerRepository) {
    this.repository = repository;
  }

  
  async createContainer(payload: ContainerPayload): Promise<any> {
    const { name, code, description, lengthFt, heightFt, widthFt, internalVolumeCbm, maxPayloadKg, tareWeightKg, containerClass, isReefer, isHazmatAllowed, isActive } = payload;

    // Validate required fields make this more robust later
    if (!name || !code ) {
      const error = new Error('Container name and code are required');
      (error as any).statusCode = 400;
      throw error;
    }

  
    const containerPayload: ContainerPayload = {
      name,
      code,
      description,
      lengthFt,
      heightFt,
      widthFt,
      internalVolumeCbm,
      maxPayloadKg,
      tareWeightKg,
      containerClass,
      isReefer,
      isHazmatAllowed,
      isActive
    };

    const container = await this.repository.createContainer(containerPayload);
    return container;
  }



  async getAllContainers(payload?: any){
    const containers = await this.repository.getAllContainers();
    console.log("Fetched Containers: ", containers);
    return containers;
  }

  async getContainerWithPagination(payload: { page: number; limit: number }, tx: any): Promise<any> {
    const { page, limit } = payload;
    const offset = (page - 1) * limit;
    const containers = await this.repository.getContainerWithPagination({ limit, offset }, tx);
    return containers;
  }


  async getContainerById(id: number): Promise<any> {
    const container = await this.repository.getContainerById(id);
    return container;
  }
  
  async updateContainer(id: number, payload: ContainerPayload, tx: any): Promise<any> {
    const { name, code, description, lengthFt, heightFt, widthFt, internalVolumeCbm, maxPayloadKg, tareWeightKg, containerClass, isReefer, isHazmatAllowed, isActive } = payload;

    const containerPayload: ContainerPayload = {
      name,
      code,
      description,
      lengthFt,
      heightFt,
      widthFt,
      internalVolumeCbm,
      maxPayloadKg,
      tareWeightKg,
      containerClass,
      isReefer,
      isHazmatAllowed,
      isActive
    };
    const updatedContainer = await this.repository.updateContainer(id, containerPayload, tx);


    return updatedContainer;
  }

  async deleteContainer(id: number): Promise<void> {
    // find the container first
    const container = await this.repository.getContainerById(id);
    if (!container) {
      const error = new Error('Container not found');
      (error as any).statusCode = 404;
      throw error;
    }
    // then delete ports associated with the container
    
   return  await this.repository.deleteContainer(id);
  }

}

