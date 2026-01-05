// package.repository.ts
import { PrismaClient, PackageType, PackageStatus } from '@prisma/client';
import { pagination } from '../../utils/pagination';

const prisma = new PrismaClient();

class PackageRepository {
  async createPackage(payload: any) {
    const data: any = {
      type: payload.type as PackageType, // Cast to PackageType enum
      image: payload.image,
      price: payload.price,
      status: (payload.status || 'ACTIVE') as PackageStatus, // Cast to PackageStatus enum
    };

    // Add optional fields only if they exist
    if (payload.name) data.name = payload.name;
    if (payload.size) data.size = payload.size;
    if (payload.weight) data.weight = payload.weight;
    if (payload.volume) data.volume = payload.volume;
    if (payload.cbm) data.cbm = payload.cbm;
    if (payload.thin) data.thin = payload.thin;
    if (payload.category) data.category = payload.category;
    if (payload.episodes) data.episodes = payload.episodes;
    if (payload.metadata) data.metadata = payload.metadata;

    return await prisma.package.create({
      data,
    });
  }

  async getAllPackages(payload: any) {
    const { type, status, search } = payload;
    const query: any = {};

    if (type) {
      query.type = type as PackageType; // Cast to PackageType
    }

    if (status) {
      query.status = status as PackageStatus; // Cast to PackageStatus
    }

    if (search) {
      query.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
        { size: { contains: search, mode: 'insensitive' } },
      ];
    }

    return await prisma.package.findMany({
      where: query,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPackagesWithPagination(payload: any) {
    const { type, status, search, sortBy, order } = payload;
    
    return await pagination(payload, async (limit: number, offset: number, sortOrder: any) => {
      const query: any = {};

      if (type) {
        query.type = type as PackageType; // Cast to PackageType
      }

      if (status) {
        query.status = status as PackageStatus; // Cast to PackageStatus
      }

      if (search) {
        query.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { category: { contains: search, mode: 'insensitive' } },
          { size: { contains: search, mode: 'insensitive' } },
        ];
      }

      const orderBy: any = {};
      if (sortBy === 'price') {
        // Extract numeric value from price string (e.g., "$120" -> 120)
        // This requires raw SQL for proper sorting
        orderBy.createdAt = sortOrder;
      } else {
        orderBy[sortBy] = sortOrder;
      }

      const packages = await prisma.package.findMany({
        where: query,
        skip: offset,
        take: limit,
        orderBy,
      });

      const totalPackages = await prisma.package.count({ where: query });
      
      return { doc: packages, totalDoc: totalPackages };
    });
  }

  async getPackagesByType(payload: any) {
    const { type, status } = payload;
    const query: any = { type: type as PackageType }; // Cast to PackageType

    if (status) {
      query.status = status as PackageStatus; // Cast to PackageStatus
    }

    return await prisma.package.findMany({
      where: query,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPackagesByStatus(status: string) {
    return await prisma.package.findMany({
      where: { status: status as PackageStatus }, // Cast to PackageStatus
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSinglePackage(id: string) {
    return await prisma.package.findUnique({
      where: { id },
    });
  }

  async updatePackage(id: string, payload: any) {
    const data: any = {};

    // Update only provided fields
    if (payload.type !== undefined) data.type = payload.type as PackageType;
    if (payload.image !== undefined) data.image = payload.image;
    if (payload.name !== undefined) data.name = payload.name;
    if (payload.size !== undefined) data.size = payload.size;
    if (payload.weight !== undefined) data.weight = payload.weight;
    if (payload.volume !== undefined) data.volume = payload.volume;
    if (payload.cbm !== undefined) data.cbm = payload.cbm;
    if (payload.thin !== undefined) data.thin = payload.thin;
    if (payload.category !== undefined) data.category = payload.category;
    if (payload.episodes !== undefined) data.episodes = payload.episodes;
    if (payload.metadata !== undefined) data.metadata = payload.metadata;
    if (payload.price !== undefined) data.price = payload.price;
    if (payload.status !== undefined) data.status = payload.status as PackageStatus;

    return await prisma.package.update({
      where: { id },
      data,
    });
  }

  async updatePackageStatus(id: string, status: string) {
    return await prisma.package.update({
      where: { id },
      data: { status: status as PackageStatus }, // Cast to PackageStatus
    });
  }

  async deletePackage(id: string) {
    return await prisma.package.delete({
      where: { id },
    });
  }
}

export default new PackageRepository();