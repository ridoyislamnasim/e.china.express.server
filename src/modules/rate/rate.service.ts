import rateRepository, { RateRepository } from "./rate.repository";


export class RateService {
  private repository: RateRepository;
  // private roleRepository: RoleRepository;

  constructor(repository: RateRepository = rateRepository) {
    this.repository = repository;
  }
  async createRate(payload: any): Promise<any> {
    const { price, weightCategoryId, shippingMethodId, category1688Id, importCountryId, exportCountryId } = payload;
    console.log("payload service", payload);
    // Validate required fields
    if (!shippingMethodId || !weightCategoryId || !price || !category1688Id || !importCountryId || !exportCountryId) {
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
    const ratePayload: any = {
       weightCategoryId, shippingMethodId, category1688Id, countryCombinationId: id
    };
    console.log("ratePayload", ratePayload);
    // rate alrady exits check can be added here
    const rateExists = await this.repository.findRateByCriteria(ratePayload);
    console.log("rateExists", rateExists);
    // if exists update price else create new
    let shippingMethod;
    if (rateExists && rateExists.length > 0) {
      // update price
      console.log("Updating existing rate");
      const rateId = rateExists[0].id;
      shippingMethod = await this.repository.updateRate(rateId, { price });
    } else {
      console.log("Creating new rate");
         ratePayload.price = price;
      shippingMethod = await this.repository.createRate(ratePayload);
    }
    return shippingMethod;
  }

  async getAllRate(): Promise<any> {
    const rate = await this.repository.getAllRate();
    return rate;
  }

  async findRateByCriteria(payload: any): Promise<any> {
    const { importCountryId, exportCountryId, shippingMethodId, weight, category1688Id } = payload;
    // all fields are required
    if (!importCountryId || !exportCountryId || !shippingMethodId || !weight || !category1688Id) {
      const error = new Error('importCountryId, exportCountryId, shippingMethodId, weight and category1688Id are required');
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
    // find weight category id based on weight
    const weightCategory = await this.repository.findWeightCategoryByWeight(weight);
    if (!weightCategory) {
      // error send not found
      const error = new Error('Weight category not found for the given weight');
      (error as any).statusCode = 404;
      throw error;
    }
    const { id } = existingCountryCombination;
    const payloadWithCombinationId = {
      weightCategoryId: weightCategory.id,
      shippingMethodId,
      category1688Id,
      countryCombinationId: id
    };
    const rate = await this.repository.findRateByCriteria(payloadWithCombinationId);
    return rate;
  }

  async countryMethodWiseRate(payload: any): Promise<any> {
    const { importCountryId, exportCountryId, shippingMethodId } = payload;
    // all fields are required
    if (!importCountryId || !exportCountryId || !shippingMethodId) {
      return [];
    }
    // find the country combination id first  
    const countryCombinationPayload = {
      importCountryId: Number(importCountryId),
      exportCountryId: Number(exportCountryId)
    };
    const existingCountryCombination = await this.repository.existingCountryConbination(countryCombinationPayload);
    if (!existingCountryCombination) {
      return [];
    }
    const { id } = existingCountryCombination;
    const payloadWithCombinationId = {
      shippingMethodId: Number(shippingMethodId),
      countryCombinationId: id
    };
    const rate = await this.repository.countryMethodWiseRate(payloadWithCombinationId);
    return rate;
  }
}

