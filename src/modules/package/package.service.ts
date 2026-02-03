import ImgUploader from "../../middleware/upload/ImgUploder";
import { NotFoundError } from "../../utils/errors";
import { BaseService } from "../base/base.service";
import packageRepository from "./package.repository";

export class PackageService extends BaseService<any> {
  private repository: typeof packageRepository;
  constructor(repository: typeof packageRepository, serviceName: string) {
    super(repository);
    this.repository = repository;
  }

  async createPackage(payloadFiles: any, payload: any, tx?: any) {
    const { files } = payloadFiles || {};
    const {
      type,
      name,
      size,
      weight,
      volume,
      cbm,
      thin,
      category,
      episodes,
      metadata,
      price,
      status,
    } = payload;

    console.log("Creating package with payload:", payload);

    if (files && files.length > 0) {
      const images = await ImgUploader(files);
      for (const key in images) {
        payload[key] = images[key];
      }
    }

    const requiredFields = ["type", "price"];
    for (const field of requiredFields) {
      if (!payload[field]) {
        throw new NotFoundError(`Missing required field: ${field}`);
      }
    }

    if (!payload.image) {
      throw new NotFoundError("Image is required");
    }

    if (
      payload.status &&
      !["ACTIVE", "INACTIVE", "ARCHIVED"].includes(payload.status)
    ) {
      throw new NotFoundError("Invalid status value");
    }

    if (
      !["WOODEN_BOX", "POLITHIN", "CARTOON", "PACKING"].includes(payload.type)
    ) {
      throw new NotFoundError("Invalid package type");
    }

    return await this.repository.createPackage(payload, tx);
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
      throw new NotFoundError("Package type is required");
    }
    return await this.repository.getPackagesByType(payload);
  }

  async getPackagesByStatus(status: string) {
    if (!["ACTIVE", "INACTIVE", "ARCHIVED"].includes(status)) {
      throw new NotFoundError("Invalid status value");
    }
    return await this.repository.getPackagesByStatus(status);
  }

  async getSinglePackage(id: string) {
    const packageData = await this.repository.getSinglePackage(id);
    if (!packageData) throw new NotFoundError("Package not found");
    return packageData;
  }

  async updatePackage(id: string, payloadFiles: any, payload: any) {
    const { files } = payloadFiles || {};
    const {
      type,
      name,
      size,
      weight,
      volume,
      cbm,
      thin,
      category,
      episodes,
      metadata,
      price,
      status,
    } = payload;

    console.log("Updating package with payload:", payload);

    // Check if package exists
    const existingPackage = await this.repository.getSinglePackage(id);
    if (!existingPackage) {
      throw new NotFoundError("Package not found");
    }

    // Handle image upload if new files are provided
    if (files && files.length > 0) {
      const images = await ImgUploader(files);
      for (const key in images) {
        payload[key] = images[key];
      }
    }

    // Validate status if provided
    if (
      payload.status &&
      !["ACTIVE", "INACTIVE", "ARCHIVED"].includes(payload.status)
    ) {
      throw new NotFoundError("Invalid status value");
    }

    // Validate type if provided
    if (
      payload.type &&
      !["WOODEN_BOX", "POLITHIN", "CARTOON", "PACKING"].includes(payload.type)
    ) {
      throw new NotFoundError("Invalid package type");
    }

    return await this.repository.updatePackage(id, payload);
  }

  async updatePackageStatus(id: string, status: string) {
    if (!["ACTIVE", "INACTIVE", "ARCHIVED"].includes(status)) {
      throw new NotFoundError("Invalid status value");
    }

    const existingPackage = await this.repository.getSinglePackage(id);
    if (!existingPackage) {
      throw new NotFoundError("Package not found");
    }

    return await this.repository.updatePackageStatus(id, status);
  }

  async deletePackage(id: string) {
    const existingPackage = await this.repository.getSinglePackage(id);
    if (!existingPackage) {
      throw new NotFoundError("Package not found");
    }
    return await this.repository.deletePackage(id);
  }
}

const packageService = new PackageService(packageRepository, "package");
export default packageService;
