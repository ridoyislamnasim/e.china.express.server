
import prisma from '../../config/prismadatabase';
import { PrismaClient } from '@prisma/client';
import { pagination } from '../../utils/pagination';

export class CountryZoneRepository {
  private prisma = prisma;

  createCustomRoleIfNotExists = async (roleName: string, tx?: any) => {
    const prismaClient: PrismaClient = tx || this.prisma;

    // Try to find existing role first
    let role = await prismaClient.role.findUnique({ where: { role: roleName } });
    if (role) return role;

    const permission = await prismaClient.permission.create({});
    role = await prismaClient.role.create({ data: { role: roleName, permissionId: permission.id } });
    return role;
  };

  async createPort(payload: any) : Promise<any> {
    const newPort = await this.prisma.ports.create({
      data: payload
    })
  return newPort
  }

  async createCountryZone(payload: any) : Promise<any> {
    const newCountryZone = await this.prisma.countryZone.create({
      data: payload
    })
    return newCountryZone
  }

  async getCountryZoneByCondition(condition: any): Promise<any> {
    return await this.prisma.countryZone.findFirst({
      where: condition,
    });
  }

  async getCountryZoneWithCondition(condition: any): Promise<any> {
    return await this.prisma.countryZone.findMany({
      where: condition,
      include: { countries: true, },
    });
  }

  async updateCountryZoneByCondition(id: number, payload: any): Promise<any> {
    return await this.prisma.countryZone.update({
      where: { id },
      data: payload,
    });
  }



  async getAllCountries() {
    // include ports
    return await this.prisma.countryZone.findMany(
      {
        include: {
          countries: true,
        }
      }
    );
  }

  async getCountryZoneById(id: number) {
    return await this.prisma.countryZone.findUnique({
      where: { id },
      include: { countries: true },
    });
  }

//  async getCountryZoneWithPagination(payload: { limit: number; offset: number }, tx: any): Promise<any> {
    async getCountryZoneWithPagination(payload: any, tx: any) {
    const prismaClient: PrismaClient = tx || this.prisma;

        return await pagination(payload, async (limit: number, offset: number, sortOrder: any) => {
          const [doc, totalDoc] = await Promise.all([
            prismaClient.countryZone.findMany({
              skip: offset, // Use the offset passed by the pagination callback
              take: limit,  // Use the limit passed by the pagination callback
              orderBy: { createdAt: sortOrder },
              include: { countries: true },
            }),
            prismaClient.countryZone.count(),
          ]);
          return { doc, totalDoc };
        });
 }

//  update 
  async updateCountryZone(id: number, payload: any, tx: any): Promise<any> {
    const prismaClient: PrismaClient = tx || this.prisma;
    const updatedCountryZone = await prismaClient.countryZone.update({
      where: { id },
      data: payload,
    });
    return updatedCountryZone;
  }

  async deleteCountryZone(id: number): Promise<void> { // Corrected method name
    await this.prisma.countryZone.delete({ where: { id } });
  }
 async deletePort(id: number): Promise<void> {
    await this.prisma.ports.delete({ where: { id } });
  }


  // Add more methods as needed, e.g., setUserOTP, getAllUser, etc.
}

// Export a singleton instance, similar to module.exports = new CountryZoneRepository(UserSchema)
const countryZoneRepository = new CountryZoneRepository();
export default countryZoneRepository;
