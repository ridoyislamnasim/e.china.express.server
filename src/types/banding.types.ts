import { BandingType, BandingCategory, PackagingType, BandingStatus } from '@prisma/client';

export interface CreateBandingInput {
  brandingName: string;
  image: string;
  material: string;
  width: string;
  thickness?: string;
  length?: string;
  strength: string;
  tensileStrength?: string;
  color: string;
  brand: string;
  logo: string;
  type: BandingType;
  category: BandingCategory;
  packaging: PackagingType;
  price: number;
  priceCurrency?: string;
  costPrice?: number;
  discountPercent?: number;
  status?: BandingStatus;
  createdBy?: string;
}

export interface UpdateBandingInput {
  brandingName?: string;
  image?: string;
  material?: string;
  width?: string;
  thickness?: string;
  length?: string;
  strength?: string;
  tensileStrength?: string;
  color?: string;
  brand?: string;
  logo?: string;
  type?: BandingType;
  category?: BandingCategory;
  packaging?: PackagingType;
  price?: number;
  priceCurrency?: string;
  costPrice?: number;
  discountPercent?: number;
  status?: BandingStatus;
  updatedBy?: string;
}

export interface BandingFilter {
  type?: BandingType;
  category?: BandingCategory;
  status?: BandingStatus;
  brand?: string;
  packaging?: PackagingType;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  order?: 'asc' | 'desc';
  sortBy?: string;
}