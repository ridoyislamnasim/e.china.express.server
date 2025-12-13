import prisma from '../../config/prismadatabase';
import { PrismaClient, SpaceType, InventoryType, Prisma } from '@prisma/client';
import { pagination } from '../../utils/pagination';
import { WarehouseSpaceFilter, SpaceStats } from './warehouseSpace.type';

export class WarehouseSpaceRepository {
  private prisma = prisma;

  // WarehouseSpace methods
  async createWarehouseSpace(payload: any): Promise<any> {
    return await this.prisma.warehouseSpace.create({
      data: payload,
      include: {
        warehouse: true,
      }
    });
  }

  async getWarehouseSpaceById(id: string): Promise<any> {
    return await this.prisma.warehouseSpace.findUnique({
      where: { id },
      include: {
        warehouse: true,
        spaces: true,
        inventories: true,
      }
    });
  }

  async getWarehouseSpaceByWarehouse(warehouseId: string): Promise<any> {
    return await this.prisma.warehouseSpace.findFirst({
      where: { warehouseId },
      include: {
        warehouse: true,
      }
    });
  }

  async getAllWarehouseSpaces(filter: WarehouseSpaceFilter = {}): Promise<any> {
    const { warehouseId, search } = filter;
    
    const where: Prisma.WarehouseSpaceWhereInput = {};
    
    if (warehouseId) where.warehouseId = warehouseId;
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    return await this.prisma.warehouseSpace.findMany({
      where,
      include: {
        warehouse: {
          select: {
            id: true,
            name: true,
            code: true,
          }
        },
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getWarehouseSpacesWithPagination(filter: WarehouseSpaceFilter, tx?: any): Promise<any> {
    const { page = 1, limit = 10, warehouseId, search } = filter;
    const offset = (page - 1) * limit;
    
    const prismaClient: PrismaClient = tx || this.prisma;
    
    const where: Prisma.WarehouseSpaceWhereInput = {};
    
    if (warehouseId) where.warehouseId = warehouseId;
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    return await pagination(
      { limit, offset },
      async (limit: number, offset: number) => {
        const [doc, totalDoc] = await Promise.all([
          prismaClient.warehouseSpace.findMany({
            where,
            skip: offset,
            take: limit,
            include: {
              warehouse: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                }
              },
              _count: {
                select: {
                  spaces: true,
                  inventories: true,
                }
              }
            },
            orderBy: { createdAt: 'desc' }
          }),
          prismaClient.warehouseSpace.count({ where }),
        ]);
        return { doc, totalDoc };
      }
    );
  }

  async updateWarehouseSpace(id: string, payload: any, tx?: any): Promise<any> {
    const prismaClient: PrismaClient = tx || this.prisma;
    return await prismaClient.warehouseSpace.update({
      where: { id },
      data: payload,
      include: {
        warehouse: true,
      }
    });
  }

  async deleteWarehouseSpace(id: string): Promise<void> {
    await this.prisma.warehouseSpace.delete({ where: { id } });
  }

  // Space methods
  async createSpace(warehouseSpaceId: string, payload: any, tx?: any): Promise<any> {
    const prismaClient: PrismaClient = tx || this.prisma;
    return await prismaClient.space.create({
      data: {
        ...payload,
        warehouseSpaceId,
      },
      include: {
        warehouseSpace: {
          include: {
            warehouse: true,
          }
        }
      }
    });
  }

  async getSpaceById(id: string): Promise<any> {
    return await this.prisma.space.findUnique({
      where: { id },
      include: {
        warehouseSpace: {
          include: {
            warehouse: true,
          }
        },
        activities: true,
      }
    });
  }

  async getSpaceBySpaceIdAndType(warehouseSpaceId: string, spaceId: string, type: SpaceType): Promise<any> {
    return await this.prisma.space.findFirst({
      where: {
        warehouseSpaceId,
        spaceId,
        type,
      }
    });
  }

  async getSpaceByNumber(warehouseSpaceId: string, type: SpaceType, spaceNumber: number): Promise<any> {
    return await this.prisma.space.findFirst({
      where: {
        warehouseSpaceId,
        type,
        spaceNumber,
      }
    });
  }

  async getAllSpaces(warehouseSpaceId: string, filter: any = {}): Promise<any> {
    const { type, occupied, search } = filter;
    
    const where: Prisma.SpaceWhereInput = { warehouseSpaceId };
    
    if (type) where.type = type as SpaceType;
    if (occupied !== undefined) where.occupied = occupied;
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { spaceId: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
      ];
    }

    return await this.prisma.space.findMany({
      where,
      include: {
        warehouseSpace: {
          select: {
            id: true,
            name: true,
            warehouse: {
              select: {
                id: true,
                name: true,
                code: true,
              }
            }
          }
        }
      },
      orderBy: [
        { type: 'asc' },
        { spaceNumber: 'asc' }
      ]
    });
  }

  async updateSpace(id: string, payload: any, tx?: any): Promise<any> {
    const prismaClient: PrismaClient = tx || this.prisma;
    return await prismaClient.space.update({
      where: { id },
      data: payload,
      include: {
        warehouseSpace: {
          include: {
            warehouse: true,
          }
        }
      }
    });
  }

  async updateSpaceOccupancy(id: string, occupied: boolean, tx?: any): Promise<any> {
    const prismaClient: PrismaClient = tx || this.prisma;
    return await prismaClient.space.update({
      where: { id },
      data: { occupied },
      include: {
        warehouseSpace: {
          include: {
            warehouse: true,
          }
        }
      }
    });
  }

  async deleteSpace(id: string): Promise<void> {
    await this.prisma.space.delete({ where: { id } });
  }

  // Inventory methods
  async createInventory(warehouseSpaceId: string, payload: any, tx?: any): Promise<any> {
    const prismaClient: PrismaClient = tx || this.prisma;
    return await prismaClient.inventory.create({
      data: {
        ...payload,
        warehouseSpaceId,
      },
      include: {
        warehouseSpace: {
          include: {
            warehouse: true,
          }
        }
      }
    });
  }

  async getInventoryById(id: string): Promise<any> {
    return await this.prisma.inventory.findUnique({
      where: { id },
      include: {
        warehouseSpace: {
          include: {
            warehouse: true,
          }
        },
        activities: true,
      }
    });
  }

  async getInventoryByType(warehouseSpaceId: string, type: InventoryType): Promise<any> {
    return await this.prisma.inventory.findFirst({
      where: {
        warehouseSpaceId,
        type,
      }
    });
  }

  async getAllInventories(warehouseSpaceId: string, filter: any = {}): Promise<any> {
    const { type, occupied, search } = filter;
    
    const where: Prisma.InventoryWhereInput = { warehouseSpaceId };
    
    if (type) where.type = type as InventoryType;
    if (occupied !== undefined) where.occupied = occupied;
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
      ];
    }

    return await this.prisma.inventory.findMany({
      where,
      include: {
        warehouseSpace: {
          select: {
            id: true,
            name: true,
            warehouse: {
              select: {
                id: true,
                name: true,
                code: true,
              }
            }
          }
        }
      },
      orderBy: { type: 'asc' }
    });
  }

  async updateInventory(id: string, payload: any, tx?: any): Promise<any> {
    const prismaClient: PrismaClient = tx || this.prisma;
    return await prismaClient.inventory.update({
      where: { id },
      data: payload,
      include: {
        warehouseSpace: {
          include: {
            warehouse: true,
          }
        }
      }
    });
  }

  async updateInventoryOccupancy(id: string, occupied: boolean, tx?: any): Promise<any> {
    const prismaClient: PrismaClient = tx || this.prisma;
    return await prismaClient.inventory.update({
      where: { id },
      data: { occupied },
      include: {
        warehouseSpace: {
          include: {
            warehouse: true,
          }
        }
      }
    });
  }

  async deleteInventory(id: string): Promise<void> {
    await this.prisma.inventory.delete({ where: { id } });
  }

  // Additional methods
  async getSpacesByWarehouse(warehouseId: string): Promise<any> {
    const warehouseSpace = await this.prisma.warehouseSpace.findFirst({
      where: { warehouseId },
      include: {
        spaces: {
          include: {
            activities: {
              orderBy: { createdAt: 'desc' },
              take: 10,
            }
          },
          orderBy: [
            { type: 'asc' },
            { spaceNumber: 'asc' }
          ]
        },
        inventories: {
          include: {
            activities: {
              orderBy: { createdAt: 'desc' },
              take: 10,
            }
          },
          orderBy: { type: 'asc' }
        }
      }
    });

    return warehouseSpace || { spaces: [], inventories: [] };
  }

  async getWarehouseSpaceStats(warehouseId: string): Promise<SpaceStats> {
    const warehouseSpace = await this.prisma.warehouseSpace.findFirst({
      where: { warehouseId },
      include: {
        spaces: true,
        inventories: true,
      }
    });

    if (!warehouseSpace) {
      return {
        totalSpaces: 0,
        occupiedSpaces: 0,
        availableSpaces: 0,
        totalInventories: 0,
        occupiedInventories: 0,
        availableInventories: 0,
        totalCapacity: 0,
        usedCapacity: 0,
        availableCapacity: 0,
      };
    }

    const totalSpaces = warehouseSpace.spaces.length;
    const occupiedSpaces = warehouseSpace.spaces.filter((s: any) => s.occupied).length;
    const availableSpaces = totalSpaces - occupiedSpaces;

    const totalInventories = warehouseSpace.inventories.length;
    const occupiedInventories = warehouseSpace.inventories.filter((i: any) => i.occupied).length;
    const availableInventories = totalInventories - occupiedInventories;

    // Calculate capacity usage
    const spacesCapacity = warehouseSpace.spaces.reduce((sum: number, space: any) => sum + (space.capacity || 0), 0);
    const inventoriesCapacity = warehouseSpace.inventories.reduce((sum: number, inv: any) => sum + (inv.capacity || 0), 0);
    const usedCapacity = spacesCapacity + inventoriesCapacity;
    const totalCapacity = warehouseSpace.totalCapacity;
    const availableCapacity = totalCapacity - usedCapacity;

    return {
      totalSpaces,
      occupiedSpaces,
      availableSpaces,
      totalInventories,
      occupiedInventories,
      availableInventories,
      totalCapacity,
      usedCapacity,
      availableCapacity,
    };
  }

  async getAvailableSpaces(warehouseId: string, type?: SpaceType | InventoryType): Promise<any> {
    const whereCondition: Prisma.SpaceWhereInput = { occupied: false };
    const inventoryWhereCondition: Prisma.InventoryWhereInput = { occupied: false };
    
    if (type) {
      // Check if type is a SpaceType
      if (Object.values(SpaceType).includes(type as SpaceType)) {
        whereCondition.type = type as SpaceType;
      } 
      // Check if type is an InventoryType
      else if (Object.values(InventoryType).includes(type as InventoryType)) {
        inventoryWhereCondition.type = type as InventoryType;
      }
    }

    const warehouseSpace = await this.prisma.warehouseSpace.findFirst({
      where: { warehouseId },
      include: {
        spaces: {
          where: whereCondition,
          orderBy: [
            { type: 'asc' },
            { spaceNumber: 'asc' }
          ]
        },
        inventories: {
          where: inventoryWhereCondition,
          orderBy: { type: 'asc' }
        }
      }
    });

    return warehouseSpace || { spaces: [], inventories: [] };
  }

  async searchSpaces(searchTerm: string, warehouseId?: string): Promise<any> {
    const where: Prisma.SpaceWhereInput = {
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { spaceId: { contains: searchTerm, mode: 'insensitive' } },
        { notes: { contains: searchTerm, mode: 'insensitive' } },
      ]
    };

    if (warehouseId) {
      const warehouseSpace = await this.prisma.warehouseSpace.findFirst({
        where: { warehouseId },
        select: { id: true }
      });
      if (warehouseSpace) {
        where.warehouseSpaceId = warehouseSpace.id;
      }
    }

    return await this.prisma.space.findMany({
      where,
      include: {
        warehouseSpace: {
          include: {
            warehouse: {
              select: {
                id: true,
                name: true,
                code: true,
              }
            }
          }
        }
      },
      orderBy: [
        { type: 'asc' },
        { spaceNumber: 'asc' }
      ]
    });
  }

  async getSpaceActivities(spaceId: string): Promise<any> {
    return await this.prisma.spaceActivity.findMany({
      where: { spaceId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getInventoryActivities(inventoryId: string): Promise<any> {
    return await this.prisma.spaceActivity.findMany({
      where: { spaceId: inventoryId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getWarehouseById(id: string): Promise<any> {
    return await this.prisma.warehouse.findUnique({
      where: { id },
    });
  }
}

// Space Activity Service
export class SpaceActivityService {
  private prisma = prisma;

  async logSpaceActivity(payload: any, tx?: any): Promise<any> {
    const prismaClient: PrismaClient = tx || this.prisma;
    return await prismaClient.spaceActivity.create({
      data: payload,
    });
  }
}

// Export singleton instance
const warehouseSpaceRepository = new WarehouseSpaceRepository();
export default warehouseSpaceRepository;