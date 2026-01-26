// AuthService (TypeScript version)
// import CountryZonePayload from '../../types/countryZone.type';
import { is } from 'zod/v4/locales';
import CountryZonePayload from '../../types/country.zone.type';
import countryZoneRepository, { CountryZoneRepository } from './country.zone.repository';


export class CountryZoneService {
  private repository: CountryZoneRepository;
  // private roleRepository: RoleRepository;

  constructor(repository: CountryZoneRepository = countryZoneRepository) {
    this.repository = repository;
  }

  
  async createCountryZone(payload: CountryZonePayload): Promise<any> {
    const { name, status, zoneCode } = payload;

    // Validate required fields
    if (!name ) {
      const error = new Error('name is required');
      (error as any).statusCode = 400;
      throw error;
    }
  
    const countryZonePayload: CountryZonePayload = {
      name,
      status,
      zoneCode
    };

    const countryZone = await this.repository.createCountryZone(countryZonePayload);
    return countryZone;
  }



  async getAllCountries(payload?: any){
    const countries = await this.repository.getAllCountries();
    console.log("Fetched Countries: ", countries);
    return countries;
  }

  async getCountryZoneWithPagination(payload: { page: number; limit: number }, tx: any): Promise<any> {
    const { page, limit } = payload;
    const offset = (page - 1) * limit;
    const countries = await this.repository.getCountryZoneWithPagination({ limit, offset }, tx);
    return countries;
  }

  async getCountryZoneForShipping(): Promise<any> {
    const countryZone = await this.repository.getCountryZoneWithCondition({ isShippingCountryZone: false });
    return countryZone;
  }

  async exportCountryZoneData(): Promise<any> {
    const countries = await this.repository.getCountryZoneWithCondition({isShippingCountryZone: true});
    return countries;
  }

  async getCountryZoneById(id: number): Promise<any> {
    const countryZone = await this.repository.getCountryZoneById(id);
    return countryZone;
  }
  
  async updateCountryZone(id: number, payload: CountryZonePayload, tx: any): Promise<any> {
    const { name, status, zoneCode } = payload;

    const countryZonePayload: CountryZonePayload = {
      name,
      status,
      zoneCode
    };
    const updatedCountryZone = await this.repository.updateCountryZone(id, countryZonePayload, tx);


    return updatedCountryZone;
  }

  async deleteCountryZone(id: number): Promise<void> {
    // find the countryZone first
    const countryZone = await this.repository.getCountryZoneById(id);
    if (!countryZone) {
      const error = new Error('CountryZone not found');
      (error as any).statusCode = 404;
      throw error;
    }
    // then delete ports associated with the countryZone
    
   return  await this.repository.deleteCountryZone(id);
  }

}

