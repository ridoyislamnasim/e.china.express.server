import { PrismaClient, BandingType, BandingCategory, PackagingType, BandingStatus } from '@prisma/client';
import { pagination } from '../../utils/pagination';

const prisma = new PrismaClient();

class BandingRepository {
  // Generate slug from branding name
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  }

  async createBanding(payload: any) {
    const slug = this.generateSlug(payload.brandingName);
    
    const data: any = {
      brandingName: payload.brandingName,
      slug: slug,
      image: payload.image,
      material: payload.material,
      width: payload.width,
      strength: payload.strength,
      color: payload.color,
      brand: payload.brand,
      logo: payload.logo,
      type: payload.type as BandingType,
      category: payload.category as BandingCategory,
      packaging: payload.packaging as PackagingType,
      price: parseFloat(payload.price),
      priceCurrency: payload.priceCurrency || 'USD',
      status: (payload.status || 'ACTIVE') as BandingStatus,
    };

    // Add optional fields only if they exist
    if (payload.thickness) data.thickness = payload.thickness;
    if (payload.length) data.length = payload.length;
    if (payload.tensileStrength) data.tensileStrength = payload.tensileStrength;
    if (payload.costPrice) data.costPrice = parseFloat(payload.costPrice);
    if (payload.discountPercent) data.discountPercent = parseFloat(payload.discountPercent);
    if (payload.createdBy) data.createdBy = payload.createdBy;

    return await prisma.banding.create({
      data,
    });
  }

  async getAllBandings(payload: any) {
    const { type, category, status, brand, packaging, minPrice, maxPrice, search } = payload;
    const query: any = {};

    if (type) {
      query.type = type as BandingType;
    }

    if (category) {
      query.category = category as BandingCategory;
    }

    if (status) {
      query.status = status as BandingStatus;
    }

    if (brand) {
      query.brand = brand;
    }

    if (packaging) {
      query.packaging = packaging as PackagingType;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.gte = parseFloat(minPrice);
      if (maxPrice) query.price.lte = parseFloat(maxPrice);
    }

    // Search across multiple fields
    if (search) {
      query.OR = [
        { brandingName: { contains: search, mode: 'insensitive' } },
        { material: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { color: { contains: search, mode: 'insensitive' } },
      ];
    }

    return await prisma.banding.findMany({
      where: query,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBandingsWithPagination(payload: any) {
    const { type, category, status, brand, packaging, minPrice, maxPrice, search, sortBy, order } = payload;
    
    return await pagination(payload, async (limit: number, offset: number, sortOrder: any) => {
      const query: any = {};

      if (type) {
        query.type = type as BandingType;
      }

      if (category) {
        query.category = category as BandingCategory;
      }

      if (status) {
        query.status = status as BandingStatus;
      }

      if (brand) {
        query.brand = brand;
      }

      if (packaging) {
        query.packaging = packaging as PackagingType;
      }

      // Price range filter
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.gte = parseFloat(minPrice);
        if (maxPrice) query.price.lte = parseFloat(maxPrice);
      }

      // Search across multiple fields
      if (search) {
        query.OR = [
          { brandingName: { contains: search, mode: 'insensitive' } },
          { material: { contains: search, mode: 'insensitive' } },
          { brand: { contains: search, mode: 'insensitive' } },
          { color: { contains: search, mode: 'insensitive' } },
        ];
      }

      const orderBy: any = {};
      if (sortBy) {
        orderBy[sortBy] = sortOrder;
      } else {
        orderBy.createdAt = sortOrder;
      }

      const bandings = await prisma.banding.findMany({
        where: query,
        skip: offset,
        take: limit,
        orderBy,
      });

      const totalBandings = await prisma.banding.count({ where: query });
      
      return { doc: bandings, totalDoc: totalBandings };
    });
  }

  async getBandingsByType(payload: any) {
    const { type, status, category } = payload;
    const query: any = { type: type as BandingType };

    if (status) {
      query.status = status as BandingStatus;
    }

    if (category) {
      query.category = category as BandingCategory;
    }

    return await prisma.banding.findMany({
      where: query,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBandingsByCategory(payload: any) {
    const { category, status, type } = payload;
    const query: any = { category: category as BandingCategory };

    if (status) {
      query.status = status as BandingStatus;
    }

    if (type) {
      query.type = type as BandingType;
    }

    return await prisma.banding.findMany({
      where: query,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBandingsByStatus(payload: any) {
    const { status, type, category } = payload;
    const query: any = { status: status as BandingStatus };

    if (type) {
      query.type = type as BandingType;
    }

    if (category) {
      query.category = category as BandingCategory;
    }

    return await prisma.banding.findMany({
      where: query,
      orderBy: { createdAt: 'desc' },
    });
  }

  async searchBandings(payload: any) {
    const { query, type, category, status, limit } = payload;
    const searchQuery: any = {};

    if (query) {
      searchQuery.OR = [
        { brandingName: { contains: query, mode: 'insensitive' } },
        { material: { contains: query, mode: 'insensitive' } },
        { brand: { contains: query, mode: 'insensitive' } },
        { color: { contains: query, mode: 'insensitive' } },
        { width: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (type) {
      searchQuery.type = type as BandingType;
    }

    if (category) {
      searchQuery.category = category as BandingCategory;
    }

    if (status) {
      searchQuery.status = status as BandingStatus;
    }

    return await prisma.banding.findMany({
      where: searchQuery,
      take: limit || 20,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSingleBanding(id: string) {
    return await prisma.banding.findUnique({
      where: { id },
    });
  }

  async getBandingBySlug(slug: string) {
    return await prisma.banding.findUnique({
      where: { slug },
    });
  }

  async updateBanding(id: string, payload: any) {
    const data: any = {};

    // Update only provided fields
    if (payload.brandingName !== undefined) {
      data.brandingName = payload.brandingName;
      // Regenerate slug if branding name changes
      data.slug = this.generateSlug(payload.brandingName);
    }
    if (payload.image !== undefined) data.image = payload.image;
    if (payload.material !== undefined) data.material = payload.material;
    if (payload.width !== undefined) data.width = payload.width;
    if (payload.thickness !== undefined) data.thickness = payload.thickness;
    if (payload.length !== undefined) data.length = payload.length;
    if (payload.strength !== undefined) data.strength = payload.strength;
    if (payload.tensileStrength !== undefined) data.tensileStrength = payload.tensileStrength;
    if (payload.color !== undefined) data.color = payload.color;
    if (payload.brand !== undefined) data.brand = payload.brand;
    if (payload.logo !== undefined) data.logo = payload.logo;
    if (payload.type !== undefined) data.type = payload.type as BandingType;
    if (payload.category !== undefined) data.category = payload.category as BandingCategory;
    if (payload.packaging !== undefined) data.packaging = payload.packaging as PackagingType;
    if (payload.price !== undefined) data.price = parseFloat(payload.price);
    if (payload.priceCurrency !== undefined) data.priceCurrency = payload.priceCurrency;
    if (payload.costPrice !== undefined) data.costPrice = parseFloat(payload.costPrice);
    if (payload.discountPercent !== undefined) data.discountPercent = parseFloat(payload.discountPercent);
    if (payload.status !== undefined) data.status = payload.status as BandingStatus;
    if (payload.updatedBy !== undefined) data.updatedBy = payload.updatedBy;

    return await prisma.banding.update({
      where: { id },
      data,
    });
  }

  async partialUpdateBanding(id: string, payload: any) {
    const data: any = {};

    // Update only provided fields
    Object.keys(payload).forEach(key => {
      if (payload[key] !== undefined) {
        if (key === 'brandingName') {
          data.brandingName = payload.brandingName;
          data.slug = this.generateSlug(payload.brandingName);
        } else if (key === 'price' || key === 'costPrice' || key === 'discountPercent') {
          data[key] = parseFloat(payload[key]);
        } else if (['type', 'category', 'packaging', 'status'].includes(key)) {
          // Handle enums
          data[key] = payload[key];
        } else {
          data[key] = payload[key];
        }
      }
    });

    return await prisma.banding.update({
      where: { id },
      data,
    });
  }

  async updateBandingStatus(id: string, status: string, updatedBy?: string) {
    const data: any = {
      status: status as BandingStatus,
    };
    
    if (status === 'ACTIVE') {
      data.publishedAt = new Date();
    }
    
    if (updatedBy) {
      data.updatedBy = updatedBy;
    }

    return await prisma.banding.update({
      where: { id },
      data,
    });
  }

  async updateBandingPrice(id: string, payload: any) {
    const data: any = {};

    if (payload.price !== undefined) data.price = parseFloat(payload.price);
    if (payload.costPrice !== undefined) data.costPrice = parseFloat(payload.costPrice);
    if (payload.discountPercent !== undefined) data.discountPercent = parseFloat(payload.discountPercent);
    if (payload.priceCurrency !== undefined) data.priceCurrency = payload.priceCurrency;
    if (payload.updatedBy !== undefined) data.updatedBy = payload.updatedBy;

    return await prisma.banding.update({
      where: { id },
      data,
    });
  }

  async deleteBanding(id: string) {
    return await prisma.banding.delete({
      where: { id },
    });
  }

  // Additional utility methods
  async getBandingCounts() {
    const activeCount = await prisma.banding.count({ where: { status: 'ACTIVE' } });
    const inactiveCount = await prisma.banding.count({ where: { status: 'INACTIVE' } });
    const archivedCount = await prisma.banding.count({ where: { status: 'ARCHIVED' } });
    
    return {
      active: activeCount,
      inactive: inactiveCount,
      archived: archivedCount,
      total: activeCount + inactiveCount + archivedCount,
    };
  }

  async getBandingsByBrand(brand: string) {
    return await prisma.banding.findMany({
      where: { brand },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export default new BandingRepository();