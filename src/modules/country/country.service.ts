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

  // async createUser(payload: any, session?: any) {
  //   const { name, email, password } = payload;
  //   if (!name || !password) {
  //     const error = new Error('name and password are required');
  //     (error as any).statusCode = 400;
  //     throw error;
  //   }
  //   const user = await this.repository.createUser({ name, email, password });
  //   return user;
  // }
  async createCountry(payload: CountryPayload): Promise<any> {
    const { name, warehouseId, status, isoCode } = payload;

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
    return country;
  }

}

