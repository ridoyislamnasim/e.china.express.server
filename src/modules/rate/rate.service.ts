import rateRepository, { RateRepository } from "./rate.repository";


export class RateService {
  private repository: RateRepository;
  // private roleRepository: RoleRepository;

  constructor(repository: RateRepository = rateRepository) {
    this.repository = repository;
  }
  async createRate(payload: any): Promise<any> {
    const { price, weightCategoryId, shippingMethodId, productId, status, route_name, importCountryId, exportCountryId } = payload;

    // Validate required fields
    if (!shippingMethodId || !weightCategoryId || !price || !productId || !importCountryId || !exportCountryId || !route_name || !status) {
      const error = new Error(' min and max weight required');
      (error as any).statusCode = 400;
      throw error;
    }

    // check country combination uniqueness can be added here
    const countryConbinatinPayload = {
      importCountryId,
      exportCountryId,
      route_name,
      status
    };
    const existingCountryConbination = await this.repository.existingCountryConbination(countryConbinatinPayload);

    if (!existingCountryConbination) {
      // create country combination
      const countryCombination = await this.repository.createCountryCombinatin(countryConbinatinPayload)
      const { id } = countryCombination;
      const ratePayload = {
        price, weightCategoryId, shippingMethodId, productId, countryCombinationId: id
      };
      const shippingMethod = await this.repository.createRate(ratePayload);
      return shippingMethod;

    }
    const { id } = existingCountryConbination;
    const ratePayload = {
      price, weightCategoryId, shippingMethodId, productId, countryCombinationId: id
    };
    const shippingMethod = await this.repository.createRate(ratePayload);
    return shippingMethod;
  }

}

