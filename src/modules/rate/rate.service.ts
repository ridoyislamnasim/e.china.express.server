import rateRepository, { RateRepository } from "./rate.repository";


export class RateService {
  private repository: RateRepository;
  // private roleRepository: RoleRepository;

  constructor(repository: RateRepository = rateRepository) {
    this.repository = repository;
  }
  async createRate(payload: any): Promise<any> {
    const { price, weightCategoryId, shippingMethodId, productId, importCountryId, exportCountryId } = payload;
 console.log("payload service", payload);
    // Validate required fields
    if (!shippingMethodId || !weightCategoryId || !price || !productId || !importCountryId || !exportCountryId  ) {
      const error = new Error(' min and max weight required');
      (error as any).statusCode = 400;
      throw error;
    }

    // check country combination uniqueness can be added here
    const countryCombinationPayload = {
      importCountryId,
      exportCountryId
    };
    const existingCountryCombination = await this.repository.existingCountryConbination(countryCombinationPayload);
    let countryCombination;
    if (!existingCountryCombination) {
      // create country combination
      countryCombination = await this.repository.createCountryCombinatin(countryCombinationPayload);
    }
    const { id } = existingCountryCombination || countryCombination;
    const ratePayload = {
      price, weightCategoryId, shippingMethodId, productId, countryCombinationId: id
    };
    // rate alrady exits check can be added here
    const rateExists = await this.repository.findRateByCriteria(ratePayload);
    // if exists update price else create new
    let shippingMethod;
    if (rateExists && rateExists.length > 0) {
      // update price
      console.log("Updating existing rate");
      const rateId = rateExists[0].id;
      shippingMethod = await this.repository.updateRate(rateId, { price });
    }else {
      console.log("Creating new rate");
      shippingMethod = await this.repository.createRate(ratePayload);
    }
    return shippingMethod;
  }

  async getAllRate(): Promise<any> {
    const rate = await this.repository.getAllRate();
    return rate;
  }

  async findRateByCriteria(payload: any): Promise<any> {
    const { importCountryId, exportCountryId, weightCategoryId, shippingMethodId, productId } = payload;
    // all fields are required
    if (!importCountryId || !exportCountryId || !weightCategoryId || !shippingMethodId || !productId ) {
      const error = new Error('importCountryId, exportCountryId, weightCategoryId, shippingMethodId and productId are required');
      (error as any).statusCode = 400;
      throw error;
    }
    // find the country combination id first
    const countryCombinationPayload = {
      importCountryId,
      exportCountryId
    };
    const existingCountryCombination = await this.repository.existingCountryConbination(countryCombinationPayload);
    if (!existingCountryCombination) {
      // no rates found
      return [];
    }
    const { id } = existingCountryCombination;
    const payloadWithCombinationId = {
      weightCategoryId,
      shippingMethodId,
      productId,
      countryCombinationId: id
    };
    const rate = await this.repository.findRateByCriteria(payloadWithCombinationId);
    return rate;
  }

}

