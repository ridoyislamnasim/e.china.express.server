import category1688Repository from "../category1688/category.1688.repository";
import countryRepository, { CountryRepository } from "../country/country.repository";
import shippingMethodRepository, { ShippingMethodRepository } from "../rateShippingMethod/shippingMethod.repository";
import rateRepository, { RateExpressRepository } from "./rate.express.repository";
import cartRepository, { CartRepository } from '../cart/cart.repository';

/** Result type for bulk rate processing */
interface RateExpressProcessResult {
  categoryId: number;
  action: 'updated' | 'created' | 'skipped' | 'error';
  price?: number;
  reason?: string;
  error?: string;
}


export class RateExpressService {
  private repository: RateExpressRepository;
  private category1688Repository: typeof category1688Repository;
  private countryRepository: CountryRepository;
  private cartRepository: CartRepository;
  private shippingMethodRepository: ShippingMethodRepository;
  private prisma: any;

  constructor(repository: RateExpressRepository = rateRepository) {
    this.repository = repository;
    this.category1688Repository = category1688Repository;
    this.countryRepository = countryRepository;
    this.shippingMethodRepository = shippingMethodRepository;
    this.cartRepository = cartRepository;
    this.prisma = (repository as any).prisma || (repository as any).db;
  }

  async createRateExpress(payload: { price: number; weightCategoryId: number; shippingMethodId: number; countryZoneId: number }): Promise<any> {
    const { price, weightCategoryId, shippingMethodId, countryZoneId } = payload;
    console.log("payload service", payload);
    // Validate required fields
    if (!shippingMethodId || !weightCategoryId || price === undefined || price === null || !countryZoneId) {
      const error = new Error('Missing required fields for creating rate');
      (error as any).statusCode = 400;
      throw error;
    }


    const ratePayload: any = {
      weightCategoryId, shippingMethodId, countryZoneId
    };
    console.log("ratePayload", ratePayload);
    // rate already exists check can be added here
    const rateExists = await this.repository.findRateExpressByCriteria(ratePayload);
    console.log("rateExists", rateExists);
    // if exists update price else create new
    let shippingMethod;
    if (rateExists && rateExists.length > 0) {
      // update price
      console.log("Updating existing rate");
      const rateId = rateExists[0].id;
      shippingMethod = await this.repository.updateRateExpress(rateId, { price });
    } else {
      console.log("Creating new rate");
      ratePayload.price = price;
      shippingMethod = await this.repository.createRateExpress(ratePayload);
    }
    return shippingMethod;
  }

  async getAllRateExpress(): Promise<any> {
    const rate = await this.repository.getAllRateExpress();
    return rate;
  }

  async findRateExpressByCriteria(payload: any): Promise<any> {
    const { countryZoneId, shippingMethodId, weight } = payload;
    // all fields are required
    if (!countryZoneId || !shippingMethodId || !weight) {
      const error = new Error('countryZoneId, shippingMethodId, weight are required');
      (error as any).statusCode = 400;
      throw error;
    }

    // find weight category id based on weight
    const weightCategory = await this.repository.findWeightCategoryByWeight(weight);
    if (!weightCategory) {
      // error send not found
      const error = new Error('Weight category not found for the given weight');
      (error as any).statusCode = 404;
      throw error;
    }
    const payloadWithCombinationId = {
      weightCategoryId: weightCategory.id,
      shippingMethodId,
      countryZoneId
    };
    const rate = await this.repository.findRateExpressByCriteria(payloadWithCombinationId);
    return rate;
  }

  async findBookingShippingRateExpress(payload: any): Promise<any> {
    const { countryZoneId, shippingMethodId, weight } = payload;
    console.log("findBookingShippingRateExpress payload", payload);
    // all fields are required
    if (!countryZoneId || !shippingMethodId || !weight) {
      const error = new Error('countryZoneId, shippingMethodId, weight are required');
      (error as any).statusCode = 400;
      throw error;
    }
    // find weight category id based on weight
    const weightCategory = await this.repository.findWeightCategoryByWeight(weight);
    if (!weightCategory) {
      // error send not found
      const error = new Error('Weight category not found for the given weight');
      (error as any).statusCode = 404;
      throw error;
    }


    const payloadWithCombinationId = {
      weightCategoryId: weightCategory.id,
      shippingMethodId
    };
    const rate = await this.repository.findRateExpressByCriteria(payloadWithCombinationId);
    return { rate };
  }

  async countryMethodWiseRateExpress(payload: any): Promise<any> {
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
    const payloadWithCombinationId = {
      shippingMethodId: Number(shippingMethodId),
    };
    const rate = await this.repository.countryMethodWiseRateExpress(payloadWithCombinationId);
    return rate;
  }

  async bulkAdjustRateExpress(payload: any, transaction: any): Promise<any> {
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



    // Ensure country combination exists (create if missing)
    const countryCombinationPayload = {
      importCountryId: Number(importCountryId),
      exportCountryId: Number(exportCountryId),
    };
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
      const queryPayload: any = { weightCategoryId, shippingMethodId, category1688Id: catId };
      console.log('Processing bulk adjust for categoryId', catId, queryPayload);
      try {
        const found = await this.repository.findRateExpressByCriteria(queryPayload, transaction);
        console.log('Found existing rate for categoryId', catId, found);
        const existingPrice = found && found.length > 0 ? found[0].price : null;
        const newPrice = computeNewPrice(existingPrice);
        console.log(`CategoryId ${catId}: existingPrice=${existingPrice}, newPrice=${newPrice}`);

        if (existingPrice !== null && found && found.length > 0) {
          await this.repository.updateRateExpress(found[0].id, { price: newPrice }, transaction);
          return { categoryId: catId, action: 'updated', price: newPrice };
        }

        if (!applyToNonEmptyOnly) {
          queryPayload.price = newPrice;
          console.log('Creating new rate for categoryId', catId, queryPayload);
          await this.repository.createRateExpress(queryPayload, transaction);
          return { categoryId: catId, action: 'created', price: newPrice };
        }

        return { categoryId: catId, action: 'skipped', reason: 'no existing price and applyToNonEmptyOnly=true' };
      } catch (err) {
        // return { categoryId: catId, action: 'error', error: String(err) };
        console.error('Error during adjustCategory for categoryId', catId, err);
        throw err;
      }
    };

    // gather tasks for parent categories and their immediate children
    const queryPayload: any = { weightCategoryId, shippingMethodId, category1688Id: 51 };
    //  countryCombinationId, weightCategoryId, shippingMethodId, category1688Id
    const data = await this.repository.findRateExpressByCriteria(queryPayload, transaction);
    console.log('Sample data for category1688Id=51:', queryPayload, data);
    const results: any[] = [];


    console.log(`Executed bulk adjust for ${results.length} categories...`);
    return results;
  }



  async findShippingRateExpressForProduct(payload: any): Promise<any> {
    const { importCountryId, productId, categoryId, subCategoryId, userRef } = payload;
    // all fields are required
    if (!importCountryId || !productId) {
      const error = new Error('importCountryId, and productId are required');
      (error as any).statusCode = 400;
      throw error;
    }



    const importCountry = await this.countryRepository.getCountryByCondition({ isShippingCountry: true });
    if (!importCountry) {
      const error = new Error('No import country found for shipping');
      (error as any).statusCode = 404;
      throw error;
    }
    console.log("importCountry", importCountry);
    // find the country combination id first
    const countryCombinationPayload = {
      exportCountryId: importCountry.id,
      importCountryId
    };
    console.log("countryCombinationPayload", countryCombinationPayload);


    const shippingMethod = await this.shippingMethodRepository.getShippingMethod();
    if (!shippingMethod) {
      const error = new Error('No shipping method found for rate calculation');
      (error as any).statusCode = 404;
      throw error;
    }




    const weightCategory = await this.repository.findWeightCategoryByWeight(5); // default weight 5kg
    if (!weightCategory) {
      // error send not found
      const error = new Error('Weight category not found for the given weight');
      (error as any).statusCode = 404;
      throw error;
    }
    const catagoryExit = await this.category1688Repository.geSubCategoryIdExit(subCategoryId) ?? await this.category1688Repository.getCategoryIdExit(categoryId);
    let rate = [];
    for (const method of shippingMethod) {

      const payloadWithCombinationId = {
        weightCategoryId: weightCategory.id,
        category1688Id: catagoryExit.id,
        shippingMethodId: method.id
      };
      console.log("payloadWithCombinationId", payloadWithCombinationId);
      const result = await this.repository.findRateExpressByCriteria(payloadWithCombinationId);
      rate.push(...result);
      console.log("method.id", method.id);
    }
    return rate;
  }


}

export default RateExpressService;