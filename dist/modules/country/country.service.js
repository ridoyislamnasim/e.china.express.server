"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryService = void 0;
const country_repository_1 = __importDefault(require("./country.repository"));
const country_zone_repository_1 = __importDefault(require("../countryZone/country.zone.repository"));
class CountryService {
    // private roleRepository: RoleRepository;
    constructor(repository = country_repository_1.default) {
        this.repository = repository;
    }
    async createCountry(payload, tx) {
        const { name, status, isoCode, ports, countryZoneId, isShippingCountry, isFreight } = payload;
        // Validate required fields - countryZoneId is required
        const zoneId = Number(countryZoneId);
        if (!name || !isoCode || typeof status === 'undefined' || isNaN(zoneId) || zoneId <= 0) {
            const error = new Error('name, status (true/false), isoCode, and a valid countryZoneId (>0) are required');
            error.statusCode = 400;
            throw error;
        }
        // Ensure the provided country zone exists
        const zone = await country_zone_repository_1.default.getCountryZoneById(zoneId, tx);
        if (!zone) {
            const error = new Error('Invalid countryZoneId. The referenced zone does not exist.');
            error.statusCode = 400;
            throw error;
        }
        // Ensure only one country has isShippingCountry set to true
        if (isShippingCountry) {
            const existingShippingCountry = await this.repository.getCountryByCondition({ isShippingCountry: true }, tx);
            if (existingShippingCountry) {
                await this.repository.updateCountryByCondition(existingShippingCountry.id, { isShippingCountry: false }, tx);
            }
        }
        const countryPayload = {
            name,
            status,
            isoCode,
            countryZoneId,
            isShippingCountry,
            isFreight,
        };
        const country = await this.repository.createCountry(countryPayload, tx);
        if (ports && Array.isArray(ports)) {
            // Assuming ports is an array of port objects
            for (const port of ports) {
                await this.repository.createPort({ ...port, countryId: country.id }, tx);
            }
        }
        return country;
    }
    async getAllCountries(payload) {
        const countries = await this.repository.getAllCountries();
        console.log("Fetched Countries: ", countries);
        return countries;
    }
    async getCountryWithPagination(payload, tx) {
        const { page, limit } = payload;
        const offset = (page - 1) * limit;
        const countries = await this.repository.getCountryWithPagination({ limit, offset }, tx);
        return countries;
    }
    async getCountryForShipping() {
        const country = await this.repository.getCountryWithCondition({ isShippingCountry: false });
        return country;
    }
    async exportCountryData() {
        const countries = await this.repository.getCountryWithCondition({ isShippingCountry: true });
        return countries;
    }
    async updateCountry(id, payload, tx) {
        var _a;
        const { name, status, isoCode, ports, countryZoneId, isShippingCountry, isFreight } = payload;
        if (isShippingCountry) {
            const existingShippingCountry = await this.repository.getCountryByCondition({ isShippingCountry: true });
            if (existingShippingCountry && existingShippingCountry.id !== id) {
                await this.repository.updateCountry(existingShippingCountry.id, { isShippingCountry: false }, tx);
            }
        }
        const countryPayload = {
            name,
            status,
            isoCode,
            countryZoneId,
            isShippingCountry,
            isFreight,
        };
        // Validate countryZoneId exists before updating
        if (countryZoneId) {
            const zoneId = Number(countryZoneId);
            const zone = await country_zone_repository_1.default.getCountryZoneById(zoneId, tx);
            if (!zone) {
                const error = new Error('Invalid countryZoneId. The referenced zone does not exist.');
                error.statusCode = 400;
                throw error;
            }
        }
        const updatedCountry = await this.repository.updateCountry(id, countryPayload, tx);
        if (ports && Array.isArray(ports)) {
            // Reconcile ports: delete removed, update existing, create new
            const existingCountry = await this.repository.getCountryById(id, tx);
            const existingPorts = (_a = existingCountry === null || existingCountry === void 0 ? void 0 : existingCountry.ports) !== null && _a !== void 0 ? _a : [];
            const incomingPorts = ports.map((p) => {
                var _a, _b;
                return ({
                    id: p.id,
                    portName: (_a = p.portName) !== null && _a !== void 0 ? _a : p.name,
                    portType: (_b = p.portType) !== null && _b !== void 0 ? _b : p.mode,
                });
            });
            const incomingIds = new Set(incomingPorts.filter((p) => p.id).map((p) => p.id));
            // Delete ports that are not present in incoming payload
            for (const existingPort of existingPorts) {
                if (!incomingIds.has(existingPort.id)) {
                    await this.repository.deletePort(existingPort.id, tx);
                }
            }
            // Update existing ports and create new ones
            for (const p of incomingPorts) {
                if (p.id) {
                    // safe update
                    await this.repository.updatePort(p.id, {
                        portName: p.portName,
                        portType: p.portType,
                        countryId: id,
                    }, tx);
                }
                else {
                    await this.repository.createPort({
                        portName: p.portName,
                        portType: p.portType,
                        countryId: id,
                    }, tx);
                }
            }
        }
        return updatedCountry;
    }
    async getAllPorts(payload = {}) {
        // get all freight countries
        const freightCountries = await this.repository.getCountryWithCondition({ isFreight: true });
        const freightCountryIds = freightCountries.map((country) => country.id);
        const repoPayload = {
            search: payload.search || undefined
        };
        if (payload.portType)
            repoPayload.portType = payload.portType;
        if (freightCountryIds && freightCountryIds.length > 0) {
            repoPayload.countryId = { in: freightCountryIds };
        }
        else {
            // If there are no freight countries, return empty set early
            return [];
        }
        return await this.repository.getAllPorts(repoPayload);
    }
    async deleteCountry(id) {
        // find the country first
        const country = await this.repository.getCountryById(id);
        if (!country) {
            const error = new Error('Country not found');
            error.statusCode = 404;
            throw error;
        }
        // then delete ports associated with the country
        if (country.ports && country.ports.length > 0) {
            for (const port of country.ports) {
                await this.repository.deletePort(port.id);
            }
        }
        return await this.repository.deleteCountry(id);
    }
}
exports.CountryService = CountryService;
