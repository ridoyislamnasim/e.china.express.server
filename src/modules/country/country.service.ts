// AuthService (TypeScript version)
// import CountryPayload from '../../types/country.type';
import CountryPayload from '../../types/auth/country.type';
import countryRepository, { CountryRepository } from './country.repository';


export class CountryService {
  private repository: CountryRepository;
  // private roleRepository: RoleRepository;

  constructor(repository: CountryRepository = countryRepository) {
    this.repository = repository;
  }





















  
  async createCountry(payload: CountryPayload): Promise<any> {
    const { name, status, isoCode, ports, zone, isShippingCountry } = payload;

    // Validate required fields
    if (!name || !status || !isoCode) {
      const error = new Error('name, status, and isoCode are required');
      (error as any).statusCode = 400;
      throw error;
    }

    // Ensure only one country has isShippingCountry set to true
    if (isShippingCountry) {
      const existingShippingCountry = await this.repository.getCountryByCondition({ isShippingCountry: true });
      if (existingShippingCountry) {
        await this.repository.updateCountryByCondition(existingShippingCountry.id, { isShippingCountry: false });
      }
    }

    const countryPayload: CountryPayload = {
      name,
      status,
      isoCode,
      zone,
      isShippingCountry,
    };

    const country = await this.repository.createCountry(countryPayload);
    if (ports && Array.isArray(ports)) {
      // Assuming ports is an array of port objects
      for (const port of ports) {
        await this.repository.createPort({ ...port, countryId: country.id } );
      }
    }

    return country;
  }




















  async getAllCountries(payload?: any){
    const countries = await this.repository.getAllCountries();
    return countries;
  }

  async getCountryWithPagination(payload: { page: number; limit: number }, tx: any): Promise<any> {
    const { page, limit } = payload;
    const offset = (page - 1) * limit;
    const countries = await this.repository.getCountryWithPagination({ limit, offset }, tx);
    return countries;
  }

  async getCountryForShipping(): Promise<any> {
    const country = await this.repository.getCountryForShipping({ isShippingCountry: false });
    return country;
  }

  async updateCountry(id: number, payload: CountryPayload, tx: any): Promise<any> {
    const { name, status, isoCode, ports, zone, isShippingCountry } = payload;
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
      zone,
      isShippingCountry,
    };
    const updatedCountry = await this.repository.updateCountry(id, countryPayload, tx);

    if (ports && Array.isArray(ports)) {
      // For simplicity, delete existing ports and recreate them
      const existingCountry = await this.repository.getCountryById(id);
      if (existingCountry && existingCountry.ports && existingCountry.ports.length > 0) {
        for (const port of existingCountry.ports) {
          await this.repository.deletePort(port.id);
        }
      }

      for (const port of ports) {
        await this.repository.createPort({ ...port, countryId: id });
      }
    }

    return updatedCountry;
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

