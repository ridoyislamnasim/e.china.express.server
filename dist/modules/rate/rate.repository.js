"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateRepository = void 0;
const prismadatabase_1 = __importDefault(require("../../config/prismadatabase"));
// import { AuthUserSignUpPayload } from '../../types/auth.types';
// import CountryPayload from '../../types/country.type';
class RateRepository {
    constructor() {
        this.prisma = prismadatabase_1.default;
    }
    async existingCountryConbination(payload, tx) {
        const { importCountryId, exportCountryId, route_name } = payload;
        const client = tx || this.prisma;
        const CountryConbination = await client.countryCombination.findFirst({
            where: {
                importCountryId,
                exportCountryId,
            }
        });
        return CountryConbination;
    }
    async findWeightCategoryByWeight(weight) {
        const client = this.prisma;
        const weightCategory = await client.rateWeightCategorie.findFirst({
            where: {
                min_weight: { lte: weight },
                max_weight: { gte: weight }
            }
        });
        return weightCategory;
    }
    async createCountryCombinatin(payload, tx) {
        const { importCountryId, exportCountryId, } = payload;
        const client = tx || this.prisma;
        const newRateShippingMethod = await client.countryCombination.create({
            data: {
                importCountry: { connect: { id: importCountryId } },
                exportCountry: { connect: { id: exportCountryId } }
            }
        });
        return newRateShippingMethod;
    }
    async createRate(payload, tx) {
        const client = tx || this.prisma;
        const newRateShippingMethod = await client.rate.create({
            data: payload
        });
        return newRateShippingMethod;
    }
    async findRateByTId(id) {
        const rate = await this.prisma.rate.findUnique({
            where: { id },
            include: {
                countryCombination: {
                    select: {
                        id: true,
                        importCountryId: true,
                        exportCountryId: true,
                    }
                },
                weightCategory: true,
                shippingMethod: true,
                category1688: {
                    select: {
                        categoryId: true,
                        translatedName: true,
                        parent: {
                            select: {
                                categoryId: true,
                                translatedName: true,
                            }
                        },
                        children: {
                            select: {
                                categoryId: true,
                                translatedName: true,
                            }
                        }
                    }
                }
            }
        });
        return rate;
    }
    async updateRate(rateId, payload, tx) {
        const client = tx || this.prisma;
        const updatedRate = await client.rate.update({
            where: { id: rateId },
            data: payload
        });
        return updatedRate;
    }
    async getAllRate() {
        const rates = await this.prisma.rate.findMany();
        return rates;
    }
    async findRateByCriteria(payload, tx) {
        const { countryCombinationId, weightCategoryId, shippingMethodId, category1688Id } = payload;
        console.log("payload in repo", payload);
        const client = tx || this.prisma;
        const rates = await client.rate.findMany({
            where: {
                countryCombinationId,
                weightCategoryId,
                shippingMethodId,
                category1688Id: Number(category1688Id)
            },
            include: {
                countryCombination: {
                    select: {
                        id: true,
                        importCountryId: true,
                        exportCountryId: true,
                        importCountry: {
                            select: {
                                id: true,
                                name: true
                            }
                        },
                        exportCountry: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                weightCategory: {
                    select: {
                        id: true,
                        label: true,
                        min_weight: true,
                        max_weight: true
                    }
                },
                shippingMethod: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                category1688: {
                    select: {
                        id: true,
                        categoryId: true,
                        translatedName: true,
                        parent: {
                            select: {
                                id: true,
                                categoryId: true,
                                translatedName: true,
                            }
                        },
                    }
                }
            }
        });
        return rates;
    }
    async countryMethodWiseRate(payload, tx) {
        const { shippingMethodId, countryCombinationId } = payload;
        const client = tx || this.prisma;
        const rates = await client.rate.findMany({
            where: {
                shippingMethodId,
                countryCombinationId
            }
        });
        return rates;
    }
}
exports.RateRepository = RateRepository;
// Export a singleton instance, similar to module.exports = new CountryRepository(UserSchema)
const rateRepository = new RateRepository();
exports.default = rateRepository;
