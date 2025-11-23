import category1688Repository from "../category1688/category.1688.repository";
import rateRepository, { RateRepository } from "./rate.repository";


export class RateService {
  private repository: RateRepository;
  private category1688Repository: typeof category1688Repository;

  constructor(repository: RateRepository = rateRepository) {
    this.repository = repository;
    this.category1688Repository = category1688Repository;
  }

  async createRate(payload:{ price: number; weightCategoryId: number; shippingMethodId: number; category1688Id: number; importCountryId: number; exportCountryId: number }): Promise<any> {
    const { price, weightCategoryId, shippingMethodId, category1688Id, importCountryId, exportCountryId } = payload;
    console.log("payload service", payload);
    // Validate required fields
    if (!shippingMethodId || !weightCategoryId || price === undefined || price === null || !category1688Id || !importCountryId || !exportCountryId) {
      const error = new Error('Missing required fields for creating rate');
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
    // rate already exists check can be added here
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

  async bulkAdjustRate(payload: any, transaction: any): Promise<any> {
    const { adjustIsPercent, adjustMode, amount, weightCategoryId, applyToNonEmptyOnly, exportCountryId, importCountryId, shippingMethodId } = payload;

    // Validate required fields.
    if (
      (adjustIsPercent === undefined || adjustIsPercent === null) ||
      !adjustMode ||
      amount === undefined || amount === null ||
      !weightCategoryId ||
      !exportCountryId ||
      !importCountryId ||
      !shippingMethodId
    ) {
      const error = new Error('adjustIsPercent, adjustMode, amount, weightCategoryId, exportCountryId, importCountryId and shippingMethodId are required');
      (error as any).statusCode = 400;
      throw error;
    }

    const amt = Number(amount);
    if (Number.isNaN(amt)) {
      const error = new Error('Amount must be a valid number');
      (error as any).statusCode = 400;
      throw error;
    }

    const categories = await this.category1688Repository.getCategoriesForRateCalculation();
    if (!categories || categories.length === 0) return [];

    // Ensure country combination exists (create if missing)
    const countryCombinationPayload = {
      importCountryId: Number(importCountryId),
      exportCountryId: Number(exportCountryId),
    };
    let existingCountryCombination = await this.repository.existingCountryConbination(countryCombinationPayload, transaction);
    if (!existingCountryCombination) {
      existingCountryCombination = await this.repository.createCountryCombinatin(countryCombinationPayload, transaction);
    }
    const countryCombinationId = existingCountryCombination?.id;

    // small helper to compute the adjusted price
    const computeNewPrice = (existingPrice: number | null) => {
      if (existingPrice !== null && existingPrice !== undefined) {
        if (adjustIsPercent) {
          const adjustment = (existingPrice * amt) / 100;
          return adjustMode === 'increase' ? Number(existingPrice) + adjustment : Number(existingPrice) - adjustment;
        }
        return adjustMode === 'increase' ? Number(existingPrice) + amt : Number(existingPrice) - amt;
      }
      // no existing price: return default created value (can be negative if decrease)
      return adjustIsPercent ? (adjustMode === 'increase' ? amt : -amt) : (adjustMode === 'increase' ? amt : -amt);
    };

    // adjust a single category id (returns result summary)
    const adjustCategory = async (catId: number | string) => {
      const queryPayload: any = { weightCategoryId, shippingMethodId, category1688Id: catId, countryCombinationId };
      console.log('Processing bulk adjust for categoryId', catId, queryPayload);
      try {
        const found = await this.repository.findRateByCriteria(queryPayload, transaction);
        console.log('Found existing rate for categoryId', catId, found);
        const existingPrice = found && found.length > 0 ? found[0].price : null;
        const newPrice = computeNewPrice(existingPrice);
        console.log(`CategoryId ${catId}: existingPrice=${existingPrice}, newPrice=${newPrice}`);

        if (existingPrice !== null && found && found.length > 0) {
          await this.repository.updateRate(found[0].id, { price: newPrice }, transaction);
          return { categoryId: catId, action: 'updated', price: newPrice };
        }

        if (!applyToNonEmptyOnly) {
          queryPayload.price = newPrice;
          await this.repository.createRate(queryPayload, transaction);
          return { categoryId: catId, action: 'created', price: newPrice };
        }

        return { categoryId: catId, action: 'skipped', reason: 'no existing price and applyToNonEmptyOnly=true' };
      } catch (err) {
        return { categoryId: catId, action: 'error', error: String(err) };
      }
    };

    // gather tasks for parent categories and their immediate children
    const queryPayload: any = { weightCategoryId, shippingMethodId, countryCombinationId, category1688Id:51 };
//  countryCombinationId, weightCategoryId, shippingMethodId, category1688Id
    const data = await this.repository.findRateByCriteria(queryPayload, transaction);
    console.log('Sample data for category1688Id=51:',queryPayload, data);
    const results: any[] = [];
    for (const category of categories) {
      const categoryId = category.id;
      console.log('Processing category for bulk adjust, categoryId:', categoryId);
      if (categoryId !== undefined && categoryId !== null) {
        try {
          const res = await adjustCategory(categoryId);
          results.push(res);
        } catch (err) {
          results.push({ categoryId, action: 'error', error: String(err) });
        }
      }
      const children = category.children || [];
      for (const child of children) {
        const childId = child.id;
        console.log('Processing child category for bulk adjust, childId:', childId);
        if (childId !== undefined && childId !== null) {
          try {
            const cres = await adjustCategory(childId);
            results.push(cres);
          } catch (err) {
            results.push({ categoryId: childId, action: 'error', error: String(err) });
          }
        }
      }
    }

    console.log(`Executed bulk adjust for ${results.length} categories...`);
    return results;
  }
}