import prisma from '../../config/prismadatabase';
import { PrismaClient } from '@prisma/client';
import { pagination } from '../../utils/pagination';
import { WarehouseFilter, WarehouseStats } from './warehouse.type';

export class WarehouseRepository {
  private prisma = prisma;

  async createWarehouse(payload: any): Promise<any> {
    const newWarehouse = await this.prisma.warehouse.create({
      data: payload,
      include: {
        managerRef: true,
        countryRef: true,
        createdByRef: true,
        updatedByRef: true,
      }
    });
    return newWarehouse;
  }

  async getWarehouseById(id: string): Promise<any> {
    return await this.prisma.warehouse.findUnique({
      where: { id },
      include: {
        managerRef: true,
        countryRef: true,
        createdByRef: true,
        updatedByRef: true,
        fromWarehouseTransfers: true,
        toWarehouseTransfers: true,
      }
    });
  }

  async getWarehouseByCondition(condition: any): Promise<any> {
    return await this.prisma.warehouse.findFirst({
      where: condition,
      include: {
        managerRef: true,
        countryRef: true,
      }
    });
  }

  async getWarehouseByCode(code: string): Promise<any> {
    return await this.getWarehouseByCondition({ code });
  }

  async getAllWarehouses(filter: WarehouseFilter = {}) {
    const { status, type, countryId, search } = filter;
    
    const where: any = {};
    
    if (status) where.status = status;
    if (type) where.type = type;
    if (countryId) where.countryId = countryId;
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ];
    }

    return await this.prisma.warehouse.findMany({
      where,
      select: {
        id: true,
        name: true,
        code: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        country: true,
        phone: true,
        email: true,
        warehouseSpaces: {
          include:{
            spaces: true, inventories: true
          }
        },
        countryRef: {
          select: {
            id: true,
            name: true,
            isoCode: true,
          }
        },
         managerRef: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          }
        },
      },
      orderBy: { createdAt: 'desc' }
    });
  }


  async getWarehousesForClient(): Promise<any> {
    return await this.prisma.warehouse.findMany({
      where: {  },
      select: {
        id: true,
        name: true,
        code: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        country: true,
        phone: true,
        email: true,
        countryRef: {
          select: {
            id: true,
            name: true,
            isoCode: true,
          }
        },
         managerRef: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          }
        },
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getWarehousesWithPagination(filter: WarehouseFilter, tx?: any): Promise<any> {
    const { page = 1, limit = 10, status, type, countryId, search } = filter;
    const offset = (page - 1) * limit;
    
    const prismaClient: PrismaClient = tx || this.prisma;
    
    const where: any = {};
    
    if (status) where.status = status;
    if (type) where.type = type;
    if (countryId) where.countryId = countryId;
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ];
    }

    return await pagination(
      { limit, offset },
      async (limit: number, offset: number) => {
        const [doc, totalDoc] = await Promise.all([
          prismaClient.warehouse.findMany({
            where,
            skip: offset,
            take: limit,
            include: {
              managerRef: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                }
              },
              countryRef: {
                select: {
                  id: true,
                  name: true,
                }
              },
            },
            orderBy: { createdAt: 'desc' }
          }),
          prismaClient.warehouse.count({ where }),
        ]);
        return { doc, totalDoc };
      }
    );
  }

  async updateWarehouse(id: string, payload: any, tx?: any): Promise<any> {
    const prismaClient: PrismaClient = tx || this.prisma;
    const updatedWarehouse = await prismaClient.warehouse.update({
      where: { id },
      data: payload,
      include: {
        managerRef: true,
        countryRef: true,
      }
    });
    return updatedWarehouse;
  }

  async deleteWarehouse(id: string): Promise<void> {
    await this.prisma.warehouse.delete({ where: { id } });
  }

  async updateWarehouseCapacity(id: string, usedCapacity: number, tx?: any): Promise<any> {
    const prismaClient: PrismaClient = tx || this.prisma;
    const warehouse = await prismaClient.warehouse.findUnique({ where: { id } });
    
    if (!warehouse) {
      throw new Error('Warehouse not found');
    }

    if (usedCapacity > warehouse.totalCapacity) {
      throw new Error('Used capacity cannot exceed total capacity');
    }

    return await prismaClient.warehouse.update({
      where: { id },
      data: {
        usedCapacity,
        status: usedCapacity >= warehouse.totalCapacity ? 'OVERLOADED' : 'OPERATIONAL'
      }
    });
  }

  async getWarehouseStats(): Promise<WarehouseStats> {
    const warehouses = await this.prisma.warehouse.findMany({
      select: {
        status: true,
        totalCapacity: true,
        usedCapacity: true,
      }
    });

    const totalWarehouses = warehouses.length;
    const operational = warehouses.filter(w => w.status === 'OPERATIONAL').length;
    const maintenance = warehouses.filter(w => w.status === 'MAINTENANCE').length;
    const closed = warehouses.filter(w => w.status === 'CLOSED').length;
    
    const totalCapacity = warehouses.reduce((sum, w) => sum + w.totalCapacity, 0);
    const usedCapacity = warehouses.reduce((sum, w) => sum + (w.usedCapacity || 0), 0);
    const availableCapacity = totalCapacity - usedCapacity;

    return {
      totalWarehouses,
      operational,
      maintenance,
      closed,
      totalCapacity,
      usedCapacity,
      availableCapacity,
    };
  }

  async getWarehousesByManager(managerId: number): Promise<any> {
    return await this.prisma.warehouse.findMany({
      where: { managerRefId: managerId },
      include: {
        countryRef: true,
      }
    });
  }

  async getAvailableCapacityWarehouses(minAvailableCapacity: number = 0): Promise<any> {
    return await this.prisma.warehouse.findMany({
      where: {
        status: 'OPERATIONAL',
        totalCapacity: {
          gt: this.prisma.warehouse.fields.usedCapacity
        }
      },
      include: {
        countryRef: true,
      }
    });
  }
}

// Export a singleton instance
const warehouseRepository = new WarehouseRepository();
export default warehouseRepository;