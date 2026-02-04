// AuthService (TypeScript version)
// import CountryPayload from '../../types/country.type';
import { is } from 'zod/v4/locales';
import CountryPayload from '../../types/country.type';
import countryRepository, { CountryRepository } from './country.repository';
import countryZoneRepository from '../countryZone/country.zone.repository';


export class CountryService {
  private repository: CountryRepository;
  // private roleRepository: RoleRepository;

  constructor(repository: CountryRepository = countryRepository) {
    this.repository = repository;
  }

  
  async createCountry(payload: CountryPayload, tx?: any): Promise<any> {
    const { name, status, isoCode, ports, countryZoneId, isShippingCountry, isFreight } = payload;

    // Validate required fields - countryZoneId is required
    const zoneId = Number(countryZoneId);
    if (!name || !isoCode || typeof status === 'undefined' || isNaN(zoneId) || zoneId <= 0) {
      const error = new Error('name, status (true/false), isoCode, and a valid countryZoneId (>0) are required');
      (error as any).statusCode = 400;
      throw error;
    }

    // Ensure the provided country zone exists
    const zone = await countryZoneRepository.getCountryZoneById(zoneId, tx);
    if (!zone) {
      const error = new Error('Invalid countryZoneId. The referenced zone does not exist.');
      (error as any).statusCode = 400;
      throw error;
    }

    // Ensure only one country has isShippingCountry set to true
    if (isShippingCountry) {
      const existingShippingCountry = await this.repository.getCountryByCondition({ isShippingCountry: true }, tx);
      if (existingShippingCountry) {
        await this.repository.updateCountryByCondition(existingShippingCountry.id, { isShippingCountry: false }, tx);
      }
    }

    const countryPayload: CountryPayload = {
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



  async getAllCountries(payload?: any){
    const countries = await this.repository.getAllCountries();
    console.log("Fetched Countries: ", countries);
    return countries;
  }

  async getCountryWithPagination(payload: { page: number; limit: number }, tx: any): Promise<any> {
    const { page, limit } = payload;
    const offset = (page - 1) * limit;
    const countries = await this.repository.getCountryWithPagination({ limit, offset }, tx);
    return countries;
  }

  async getCountryForShipping(): Promise<any> {
    const country = await this.repository.getCountryWithCondition({ isShippingCountry: false });
    return country;
  }

  async exportCountryData(): Promise<any> {
    const countries = await this.repository.getCountryWithCondition({isShippingCountry: true});
    return countries;
  }
  async updateCountry(id: number, payload: CountryPayload, tx: any): Promise<any> {
    const { name, status, isoCode, ports, countryZoneId, isShippingCountry, isFreight } = payload;
    if (isShippingCountry) {
      const existingShippingCountry = await this.repository.getCountryByCondition({ isShippingCountry: true });
      if (existingShippingCountry && existingShippingCountry.id !== id) {
        await this.repository.updateCountry(existingShippingCountry.id, { isShippingCountry: false }, tx);
      }
    }

    const countryPayload: CountryPayload = {
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
      const zone = await countryZoneRepository.getCountryZoneById(zoneId, tx);
      if (!zone) {
        const error = new Error('Invalid countryZoneId. The referenced zone does not exist.');
        (error as any).statusCode = 400;
        throw error;
      }
    }

    const updatedCountry = await this.repository.updateCountry(id, countryPayload, tx);

    if (ports && Array.isArray(ports)) {
      // Reconcile ports: delete removed, update existing, create new
      const existingCountry = await this.repository.getCountryById(id, tx);
      const existingPorts = existingCountry?.ports ?? [];

      const incomingPorts = ports.map((p: any) => ({
        id: p.id,
        portName: p.portName ?? p.name,
        portType: p.portType ?? p.mode,
      }));

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
        } else {
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


  async getAllPorts(payload: { portType?: string, search?: string } = {}): Promise<any> {
    // get all freight countries
    const freightCountries = await this.repository.getCountryWithCondition({ isFreight: true });
    const freightCountryIds = freightCountries.map((country: any) => country.id);

    const repoPayload: any = {
      search: payload.search || undefined
    };
    if (payload.portType) repoPayload.portType = payload.portType;
    if (freightCountryIds && freightCountryIds.length > 0) {
      repoPayload.countryId = { in: freightCountryIds };
    } else {
      // If there are no freight countries, return empty set early
      return [];
    }


    return await this.repository.getAllPorts(repoPayload);
  }

  async deleteCountry(id: number): Promise<void> {
    // find the country first
    const country = await this.repository.getCountryById(id);
    if (!country) {
      const error = new Error('Country not found');
      (error as any).statusCode = 404;
      throw error;
    }
    // then delete ports associated with the country
    if (country.ports && country.ports.length > 0) {
      for (const port of country.ports) {
        await this.repository.deletePort(port.id);
      }
    }
   return  await this.repository.deleteCountry(id);
  }

}

