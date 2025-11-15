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
    const { name, warehouseId, status, isoCode, ports } = payload;

    // Validate required fields
    if (!name || !status || !isoCode) {
      const error = new Error('name, status, and isoCode are required');
      (error as any).statusCode = 400;
      throw error;
    }


    // Ensure warehouseId is optional
    const countryPayload: CountryPayload = {
      name,
      warehouseId: warehouseId ?? null,
      status,
      isoCode,
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

