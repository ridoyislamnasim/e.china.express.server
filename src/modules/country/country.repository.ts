import prisma from '../../config/prismadatabase';
import { PrismaClient } from '@prisma/client';
import { pagination } from '../../utils/pagination';

export class CountryRepository {
  private prisma = prisma;
// portexits 


  async createPort(payload: any) : Promise<any> {
    const newPort = await this.prisma.ports.create({
      data: payload
    })
  return newPort
  }

  async createCountry(payload: any) : Promise<any> {
    const newCountry = await this.prisma.country.create({
      data: payload
    })
    return newCountry
  }

  async getCountryByCondition(condition: any): Promise<any> {
    return await this.prisma.country.findFirst({
      where: condition,
    });
  }

  async getCountryWithCondition(condition: any): Promise<any> {
    return await this.prisma.country.findMany({
      where: condition,
      include: { ports: true, warehouses: true, countryHsCodes: true},
    });
  }

  async updateCountryByCondition(id: number, payload: any): Promise<any> {
    return await this.prisma.country.update({
      where: { id },
      data: payload,
    });
  }

  // Check if a port exists by a given condition
  async portExists(condition: any): Promise<boolean> {
    const port = await this.prisma.ports.findFirst({ where: condition });
    return !!port;
  }

  async getAllCountries() {
    // include ports
    return await this.prisma.country.findMany(
      {
        include: {
          ports: true,
          warehouses: true,
        }
      }
    );
  }

  async getCountryById(id: number) {
    return await this.prisma.country.findUnique({
      where: { id },
      include: { ports: true, warehouses: true, countryHsCodes: true},
    });
  }

//  async getCountryWithPagination(payload: { limit: number; offset: number }, tx: any): Promise<any> {
    async getCountryWithPagination(payload: any, tx: any) {
        return await pagination(payload, async (limit: number, offset: number, sortOrder: any) => {
          const [doc, totalDoc] = await Promise.all([
            await  this.prisma.country.findMany({
              skip: payload.offset,
              take: payload.limit,
              orderBy: { createdAt: sortOrder },
              include: { ports: true, warehouses: true, countryHsCodes: true , countryZone: true},
            }),
            await  this.prisma.country.count(),
          ]);
          return { doc, totalDoc };
        });
 }

//  update 
  async updateCountry(id: number, payload: any, tx: any): Promise<any> {
    const prismaClient: PrismaClient = tx || this.prisma;
    const updatedCountry = await prismaClient.country.update({
      where: { id },
      data: payload,
    });
    return updatedCountry;
  }

  async deleteCountry(id: number): Promise<void> { // Corrected method name
    await this.prisma.country.delete({ where: { id } });
  }
 async deletePort(id: number): Promise<void> {
    await this.prisma.ports.delete({ where: { id } });
  }


  // Add more methods as needed, e.g., setUserOTP, getAllUser, etc.
}

// Export a singleton instance, similar to module.exports = new CountryRepository(UserSchema)
const countryRepository = new CountryRepository();
export default countryRepository;
