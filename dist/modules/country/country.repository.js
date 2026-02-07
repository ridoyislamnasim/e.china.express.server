"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryRepository = void 0;
const prismadatabase_1 = __importDefault(require("../../config/prismadatabase"));
const pagination_1 = require("../../utils/pagination");
class CountryRepository {
    constructor() {
        this.prisma = prismadatabase_1.default;
        // Add more methods as needed, e.g., setUserOTP, getAllUser, etc.
    }
    // portexits 
    async createPort(payload, tx) {
        const prismaClient = tx || this.prisma;
        const newPort = await prismaClient.ports.create({
            data: payload
        });
        return newPort;
    }
    async createCountry(payload, tx) {
        const prismaClient = tx || this.prisma;
        const newCountry = await prismaClient.country.create({
            data: payload
        });
        return newCountry;
    }
    async getCountryByCondition(condition, tx) {
        const prismaClient = tx || this.prisma;
        return await prismaClient.country.findFirst({
            where: condition,
        });
    }
    async getCountryWithCondition(condition) {
        return await this.prisma.country.findMany({
            where: condition,
            include: { ports: true, warehouses: true, countryHsCodes: true },
        });
    }
    async updateCountryByCondition(id, payload, tx) {
        const prismaClient = tx || this.prisma;
        return await prismaClient.country.update({
            where: { id },
            data: payload,
        });
    }
    // Check if a port exists by a given condition
    async portExists(condition) {
        const port = await this.prisma.ports.findFirst({ where: condition });
        return !!port;
    }
    async getAllCountries() {
        // include ports
        return await this.prisma.country.findMany({
            include: {
                ports: true,
                warehouses: true,
            }
        });
    }
    async getCountryById(id, tx) {
        const prismaClient = tx || this.prisma;
        return await prismaClient.country.findUnique({
            where: { id },
            include: { ports: true, warehouses: true, countryHsCodes: true },
        });
    }
    //  async getCountryWithPagination(payload: { limit: number; offset: number }, tx: any): Promise<any> {
    async getCountryWithPagination(payload, tx) {
        return await (0, pagination_1.pagination)(payload, async (limit, offset, sortOrder) => {
            const [doc, totalDoc] = await Promise.all([
                await this.prisma.country.findMany({
                    skip: payload.offset,
                    take: payload.limit,
                    orderBy: { createdAt: sortOrder },
                    include: { ports: true, warehouses: true, countryHsCodes: true, countryZone: true },
                }),
                await this.prisma.country.count(),
            ]);
            return { doc, totalDoc };
        });
    }
    //  update 
    async updateCountry(id, payload, tx) {
        const prismaClient = tx || this.prisma;
        const updatedCountry = await prismaClient.country.update({
            where: { id },
            data: payload,
        });
        return updatedCountry;
    }
    async deleteCountry(id, tx) {
        const prismaClient = tx || this.prisma;
        await prismaClient.country.delete({ where: { id } });
    }
    async updatePort(id, payload, tx) {
        const prismaClient = tx || this.prisma;
        const updatedPort = await prismaClient.ports.update({
            where: { id },
            data: payload,
        });
        return updatedPort;
    }
    async deletePort(id, tx) {
        const prismaClient = tx || this.prisma;
        await prismaClient.ports.delete({ where: { id } });
    }
    async getAllPorts(payload) {
        const where = {};
        if (payload) {
            if (payload.portType) {
                where.portType = payload.portType;
            }
            if (payload.countryId) {
                where.countryId = payload.countryId;
            }
            if (payload.search) {
                where.portName = { contains: payload.search, mode: 'insensitive' };
            }
        }
        return await this.prisma.ports.findMany({ where });
    }
}
exports.CountryRepository = CountryRepository;
// Export a singleton instance, similar to module.exports = new CountryRepository(UserSchema)
const countryRepository = new CountryRepository();
exports.default = countryRepository;
