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
        this.createCustomRoleIfNotExists = async (roleName, tx) => {
            const prismaClient = tx || this.prisma;
            // Try to find existing role first
            let role = await prismaClient.role.findUnique({ where: { role: roleName } });
            if (role)
                return role;
            const permission = await prismaClient.permission.create({});
            role = await prismaClient.role.create({ data: { role: roleName, permissionId: permission.id } });
            return role;
        };
        // Add more methods as needed, e.g., setUserOTP, getAllUser, etc.
    }
    async createPort(payload) {
        const newPort = await this.prisma.ports.create({
            data: payload
        });
        return newPort;
    }
    async createCountry(payload) {
        const newCountry = await this.prisma.country.create({
            data: payload
        });
        return newCountry;
    }
    async getCountryByCondition(condition) {
        return await this.prisma.country.findFirst({
            where: condition,
        });
    }
    async getCountryForShipping(condition) {
        return await this.prisma.country.findMany({
            where: condition,
        });
    }
    async updateCountryByCondition(id, payload) {
        return await this.prisma.country.update({
            where: { id },
            data: payload,
        });
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
    async getCountryById(id) {
        return await this.prisma.country.findUnique({
            where: { id },
            include: { ports: true, warehouses: true, countryHsCodes: true },
        });
    }
    async getCountryWithPagination(payload, tx) {
        const { limit, offset } = payload;
        const prismaClient = tx || this.prisma;
        return await (0, pagination_1.pagination)(payload, async (limit, offset, sortOrder) => {
            const [doc, totalDoc] = await Promise.all([
                this.prisma.country.findMany({
                    where: {},
                    skip: offset,
                    take: limit,
                    // orderBy: sortOrder,
                    include: { ports: true, warehouses: true },
                }),
                prismadatabase_1.default.country.count({ where: {} }),
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
    async deleteCountry(id) {
        await this.prisma.country.delete({ where: { id } });
    }
    async deletePort(id) {
        await this.prisma.ports.delete({ where: { id } });
    }
}
exports.CountryRepository = CountryRepository;
// Export a singleton instance, similar to module.exports = new CountryRepository(UserSchema)
const countryRepository = new CountryRepository();
exports.default = countryRepository;
