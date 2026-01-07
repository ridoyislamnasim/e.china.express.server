import { NotFoundError, BadRequestError } from '../../utils/errors';
import { BaseService } from '../base/base.service';
import bandingRepository from './banding.repository';

export class BandingService extends BaseService<any> {
  private repository: typeof bandingRepository;
  constructor(repository: typeof bandingRepository, serviceName: string) {
    super(repository);
    this.repository = repository;
  }

  // Validations
  private validateType(type: string): boolean {
    const validTypes = ['PLASTIC', 'STEEL', 'PAPER', 'NYLON', 'POLYESTER', 'COTTON'];
    return validTypes.includes(type);
  }

  private validateCategory(category: string): boolean {
    const validCategories = ['TYPE_A', 'TYPE_B', 'TYPE_C', 'TYPE_D', 'TYPE_E'];
    return validCategories.includes(category);
  }

  private validatePackaging(packaging: string): boolean {
    const validPackaging = ['ROLL', 'SHEET', 'STRAP', 'COIL', 'BUNDLE', 'BOX'];
    return validPackaging.includes(packaging);
  }

  private validateStatus(status: string): boolean {
    const validStatuses = ['ACTIVE', 'INACTIVE', 'ARCHIVED'];
    return validStatuses.includes(status);
  }

  // Create banding
  async createBanding(payload: any) {
    // Validate required fields
    const requiredFields = [
      'brandingName', 'image', 'material', 'width', 
      'strength', 'color', 'brand', 'logo', 'type', 
      'category', 'packaging', 'price'
    ];
    
    for (const field of requiredFields) {
      if (!payload[field]) {
        throw new NotFoundError(`Missing required field: ${field}`);
      }
    }

    // Validate enum values
    if (!this.validateType(payload.type)) {
      throw new BadRequestError('Invalid banding type');
    }

    if (!this.validateCategory(payload.category)) {
      throw new BadRequestError('Invalid banding category');
    }

    if (!this.validatePackaging(payload.packaging)) {
      throw new BadRequestError('Invalid packaging type');
    }

    if (payload.status && !this.validateStatus(payload.status)) {
      throw new BadRequestError('Invalid status value');
    }

    // Validate price
    if (isNaN(parseFloat(payload.price))) {
      throw new BadRequestError('Price must be a valid number');
    }

    if (payload.costPrice && isNaN(parseFloat(payload.costPrice))) {
      throw new BadRequestError('Cost price must be a valid number');
    }

    if (payload.discountPercent && isNaN(parseFloat(payload.discountPercent))) {
      throw new BadRequestError('Discount percent must be a valid number');
    }

    return await this.repository.createBanding(payload);
  }

  // Get all bandings
  async getAllBandings(payload: any) {
    return await this.repository.getAllBandings(payload);
  }

  // Get bandings with pagination
  async getBandingsWithPagination(payload: any) {
    // Validate pagination parameters
    if (payload.page && payload.page < 1) {
      throw new BadRequestError('Page must be greater than 0');
    }
    
    if (payload.limit && (payload.limit < 1 || payload.limit > 100)) {
      throw new BadRequestError('Limit must be between 1 and 100');
    }

    return await this.repository.getBandingsWithPagination(payload);
  }

  // Get bandings by type
  async getBandingsByType(payload: any) {
    const { type } = payload;
    if (!type) {
      throw new NotFoundError('Banding type is required');
    }
    
    if (!this.validateType(type)) {
      throw new BadRequestError('Invalid banding type');
    }

    return await this.repository.getBandingsByType(payload);
  }

  // Get bandings by category
  async getBandingsByCategory(payload: any) {
    const { category } = payload;
    if (!category) {
      throw new NotFoundError('Banding category is required');
    }
    
    if (!this.validateCategory(category)) {
      throw new BadRequestError('Invalid banding category');
    }

    return await this.repository.getBandingsByCategory(payload);
  }

  // Get bandings by status
  async getBandingsByStatus(payload: any) {
    const { status } = payload;
    if (!status) {
      throw new NotFoundError('Banding status is required');
    }
    
    if (!this.validateStatus(status)) {
      throw new BadRequestError('Invalid status value');
    }

    return await this.repository.getBandingsByStatus(payload);
  }

  // Search bandings
  async searchBandings(payload: any) {
    if (!payload.query || payload.query.trim().length < 2) {
      throw new BadRequestError('Search query must be at least 2 characters long');
    }

    return await this.repository.searchBandings(payload);
  }

  // Get single banding
  async getSingleBanding(id: string) {
    const banding = await this.repository.getSingleBanding(id);
    if (!banding) throw new NotFoundError('Banding not found');
    return banding;
  }

  // Get banding by slug
  async getBandingBySlug(slug: string) {
    const banding = await this.repository.getBandingBySlug(slug);
    if (!banding) throw new NotFoundError('Banding not found');
    return banding;
  }

  // Update banding
  async updateBanding(id: string, payload: any) {
    // Check if banding exists
    const existingBanding = await this.repository.getSingleBanding(id);
    if (!existingBanding) {
      throw new NotFoundError('Banding not found');
    }

    // Validate enum values if provided
    if (payload.type && !this.validateType(payload.type)) {
      throw new BadRequestError('Invalid banding type');
    }

    if (payload.category && !this.validateCategory(payload.category)) {
      throw new BadRequestError('Invalid banding category');
    }

    if (payload.packaging && !this.validatePackaging(payload.packaging)) {
      throw new BadRequestError('Invalid packaging type');
    }

    if (payload.status && !this.validateStatus(payload.status)) {
      throw new BadRequestError('Invalid status value');
    }

    // Validate numeric fields
    if (payload.price && isNaN(parseFloat(payload.price))) {
      throw new BadRequestError('Price must be a valid number');
    }

    if (payload.costPrice !== undefined && isNaN(parseFloat(payload.costPrice))) {
      throw new BadRequestError('Cost price must be a valid number');
    }

    if (payload.discountPercent !== undefined && isNaN(parseFloat(payload.discountPercent))) {
      throw new BadRequestError('Discount percent must be a valid number');
    }

    return await this.repository.updateBanding(id, payload);
  }

  // Partial update banding
  async partialUpdateBanding(id: string, payload: any) {
    // Check if banding exists
    const existingBanding = await this.repository.getSingleBanding(id);
    if (!existingBanding) {
      throw new NotFoundError('Banding not found');
    }

    // Validate any provided enum values
    if (payload.type && !this.validateType(payload.type)) {
      throw new BadRequestError('Invalid banding type');
    }

    if (payload.category && !this.validateCategory(payload.category)) {
      throw new BadRequestError('Invalid banding category');
    }

    if (payload.packaging && !this.validatePackaging(payload.packaging)) {
      throw new BadRequestError('Invalid packaging type');
    }

    if (payload.status && !this.validateStatus(payload.status)) {
      throw new BadRequestError('Invalid status value');
    }

    return await this.repository.partialUpdateBanding(id, payload);
  }

  // Update banding status
  async updateBandingStatus(id: string, status: string, updatedBy?: string) {
    if (!this.validateStatus(status)) {
      throw new BadRequestError('Invalid status value');
    }

    const existingBanding = await this.repository.getSingleBanding(id);
    if (!existingBanding) {
      throw new NotFoundError('Banding not found');
    }

    return await this.repository.updateBandingStatus(id, status, updatedBy);
  }

  // Update banding price
  async updateBandingPrice(id: string, payload: any) {
    const existingBanding = await this.repository.getSingleBanding(id);
    if (!existingBanding) {
      throw new NotFoundError('Banding not found');
    }

    // Validate numeric fields
    if (payload.price !== undefined && isNaN(parseFloat(payload.price))) {
      throw new BadRequestError('Price must be a valid number');
    }

    if (payload.costPrice !== undefined && isNaN(parseFloat(payload.costPrice))) {
      throw new BadRequestError('Cost price must be a valid number');
    }

    if (payload.discountPercent !== undefined && isNaN(parseFloat(payload.discountPercent))) {
      throw new BadRequestError('Discount percent must be a valid number');
    }

    return await this.repository.updateBandingPrice(id, payload);
  }

  // Delete banding
  async deleteBanding(id: string) {
    const existingBanding = await this.repository.getSingleBanding(id);
    if (!existingBanding) {
      throw new NotFoundError('Banding not found');
    }
    return await this.repository.deleteBanding(id);
  }

  // Additional methods
  async getBandingCounts() {
    return await this.repository.getBandingCounts();
  }

  async getBandingsByBrand(brand: string) {
    if (!brand) {
      throw new BadRequestError('Brand name is required');
    }
    return await this.repository.getBandingsByBrand(brand);
  }
}

const bandingService = new BandingService(bandingRepository, 'banding');
export default bandingService;