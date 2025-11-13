import rateWeightCategoriesRepository, { RateWeightCategoriesRepository } from "./rateWeightCategories.repository";

export class RateWeightCategoriesService {
  private repository: RateWeightCategoriesRepository;
  // private roleRepository: RoleRepository;

  constructor(repository: RateWeightCategoriesRepository = rateWeightCategoriesRepository) {
    this.repository = repository;
  }
  async createRateWeightCategories(payload: any): Promise<any> {
    const { label, min_weight, max_weight  } = payload;
    console.log("payload service", payload);

    // Validate required fields.
    // Allow min_weight = 0 (so test for undefined/null rather than falsy)
    if (!label || min_weight === undefined || min_weight === null || max_weight === undefined || max_weight === null) {
      const error = new Error('label, min_weight and max_weight are required');
      (error as any).statusCode = 400;
      throw error;
    }

    // Coerce weights to numbers and validate
    const min = Number(min_weight);
    const max = Number(max_weight);
    if (Number.isNaN(min) || Number.isNaN(max)) {
      const error = new Error('min_weight and max_weight must be numbers');
      (error as any).statusCode = 400;
      throw error;
    }

    if (min > max) {
      const error = new Error('min_weight cannot be greater than max_weight');
      (error as any).statusCode = 400;
      throw error;
    }

    // Ensure description is optional
    const weightCategoriesPayload = {
      label,
      min_weight: min,
      max_weight: max,
    };

    const shippingMethod = await this.repository.createRateWeightCategories(weightCategoriesPayload);
    return shippingMethod;
  }

}

