import { NotFoundError } from '../../utils/errors';
import { BaseService } from '../base/base.service';
import packageRepository from './package.repository';

export class PackageService extends BaseService<any> {
  private repository: typeof packageRepository;
  constructor(repository: typeof packageRepository, serviceName: string) {
    super(repository);
    this.repository = repository;
  }

  async createPackage(payload: any) {
    const requiredFields = ['type', 'image', 'price'];
    for (const field of requiredFields) {
      if (!payload[field]) {
        throw new NotFoundError(`Missing required field: ${field}`);
      }
    }

    // Validate status if provided
    if (payload.status && !['ACTIVE', 'INACTIVE', 'ARCHIVED'].includes(payload.status)) {
      throw new NotFoundError('Invalid status value');
    }

    // Validate type if provided
    if (!['WOODEN_BOX', 'POLITHIN', 'CARTOON', 'PACKING'].includes(payload.type)) {
      throw new NotFoundError('Invalid package type');
    }

    return await this.repository.createPackage(payload);
  }

  async getAllPackages(payload: any) {
    return await this.repository.getAllPackages(payload);
  }

  async getPackagesWithPagination(payload: any) {
    return await this.repository.getPackagesWithPagination(payload);
  }

  async getPackagesByType(payload: any) {
    const { type } = payload;
    if (!type) {
      throw new NotFoundError('Package type is required');
    }
    return await this.repository.getPackagesByType(payload);
  }

  async getPackagesByStatus(status: string) {
    if (!['ACTIVE', 'INACTIVE', 'ARCHIVED'].includes(status)) {
      throw new NotFoundError('Invalid status value');
    }
    return await this.repository.getPackagesByStatus(status);
  }

  async getSinglePackage(id: string) {
    const packageData = await this.repository.getSinglePackage(id);
    if (!packageData) throw new NotFoundError('Package not found');
    return packageData;
  }

  async updatePackage(id: string, payload: any) {
    // Check if package exists
    const existingPackage = await this.repository.getSinglePackage(id);
    if (!existingPackage) {
      throw new NotFoundError('Package not found');
    }

    // Validate status if provided
    if (payload.status && !['ACTIVE', 'INACTIVE', 'ARCHIVED'].includes(payload.status)) {
      throw new NotFoundError('Invalid status value');
    }

    // Validate type if provided
    if (payload.type && !['WOODEN_BOX', 'POLITHIN', 'CARTOON', 'PACKING'].includes(payload.type)) {
      throw new NotFoundError('Invalid package type');
    }

    return await this.repository.updatePackage(id, payload);
  }

  async updatePackageStatus(id: string, status: string) {
    if (!['ACTIVE', 'INACTIVE', 'ARCHIVED'].includes(status)) {
      throw new NotFoundError('Invalid status value');
    }

    const existingPackage = await this.repository.getSinglePackage(id);
    if (!existingPackage) {
      throw new NotFoundError('Package not found');
    }

    return await this.repository.updatePackageStatus(id, status);
  }

  async deletePackage(id: string) {
    const existingPackage = await this.repository.getSinglePackage(id);
    if (!existingPackage) {
      throw new NotFoundError('Package not found');
    }
    return await this.repository.deletePackage(id);
  }
}

const packageService = new PackageService(packageRepository, 'package');
export default packageService;