import shipRouteRepository from '../shipRoute/ship.route.repository';
import category1688Repository from "../category1688/category.1688.repository";
import countryRepository, { CountryRepository } from "../country/country.repository";
import shippingMethodRepository, { ShippingMethodRepository } from "../rateShippingMethod/shippingMethod.repository";
import rateRepository, { RateFreightRepository } from "./rate.freight.repository";
import carrierCompanyRepository from '../carrierCompany/carrier.company.repository';

/** Result type for bulk rate processing */
interface RateFreightProcessResult {
  categoryId: number;
  action: 'updated' | 'created' | 'skipped' | 'error';
  price?: number;
  reason?: string;
  error?: string;
}


export class RateFreightService {
  private repository: RateFreightRepository;
  private category1688Repository: typeof category1688Repository;
  private countryRepository: CountryRepository;
  private shippingMethodRepository: ShippingMethodRepository;
  private carrierCompanyRepository: typeof carrierCompanyRepository;
  private prisma: any;

  constructor(repository: RateFreightRepository = rateRepository) {
    this.repository = repository;
    this.category1688Repository = category1688Repository;
    this.countryRepository = countryRepository;
    this.shippingMethodRepository = shippingMethodRepository;
    this.carrierCompanyRepository = carrierCompanyRepository;
    this.prisma = (repository as any).prisma || (repository as any).db;
  }

  async createRateFreight(payload:
    {
      price: number;
      routeId: number;
      cargoType: string;
      shippingMethodId: number;
      shipmentMode: string;
      carrierCompanyId: number;
      cbm?: number;
      containerId?: number;
      shipScheduleId?: number;
    }): Promise<any> {
    const { price, routeId, cargoType, shippingMethodId, shipmentMode, carrierCompanyId, containerId, shipScheduleId } = payload;
    console.log("payload service", payload);
    // Validate required fields
    if (
      price === undefined || price === null ||
      !cargoType || !shippingMethodId || !shipmentMode || !routeId || !carrierCompanyId || shipScheduleId === undefined || shipScheduleId === null ||
      (shipmentMode === 'FCL' && !containerId) ||
      (shipmentMode === 'LCL' && (payload.cbm === undefined || payload.cbm === null))
    ) {
      let missing = 'Missing required fields for creating rate';
      if (shipmentMode === 'FCL' && !containerId) missing = 'containerId is required for FCL shipmentMode';
      if (shipmentMode === 'LCL' && (payload.cbm === undefined || payload.cbm === null)) missing = 'cbm is required for LCL shipmentMode';
      const error = new Error(missing);
      (error as any).statusCode = 400;
      throw error;
    }

    // containerId existence check for FCL
    if (shipmentMode === 'FCL' && containerId) {
      const container = await this.prisma.container.findUnique({ where: { id: containerId } });
      console.log("container", container);
      if (!container) {
        const error = new Error('Container not found');
        (error as any).statusCode = 404;
        throw error;
      }
    }

    // shipScheduleId id is exits check
    const shipSchedule = await this.prisma.shipSchedule.findUnique({ where: { id: shipScheduleId } });
    console.log("shipSchedule", shipSchedule);
    if (!shipSchedule) {
      const error = new Error('Ship Schedule not found');
      (error as any).statusCode = 404;
      throw error;
    }

    // check carrier company id exists
    const existCarrierCompany = await this.carrierCompanyRepository.getCarrierCompanyById(carrierCompanyId);
    if (!existCarrierCompany) {
      throw Object.assign(new Error('Carrier company not found'), { statusCode: 404 });
    }

    // shippingMethodId is exits check
    const existShippingMethod = await this.shippingMethodRepository.getSingleShippingMethod(String(shippingMethodId));
    console.log("existShippingMethod", existShippingMethod);
    if (!existShippingMethod) {
      const error = new Error('Shipping method not found');
      (error as any).statusCode = 404;
      throw error;
    }

    // routeId existence check
    const routeExist = await shipRouteRepository.getShipRouteById(routeId);
    console.log("routeExist", routeExist);
    if (!routeExist) {
      const error = new Error('Route not found');
      (error as any).statusCode = 404;
      throw error;
    }

    // find freigtRate is exits 
    const existFreightRatePayload: any = {
      routeId,
      cargoType,
      shippingMethodId,
      carrierCompanyId,
      shipmentMode, 
      shipScheduleId
    };
    if (shipmentMode === 'FCL') {
      existFreightRatePayload.containerId = containerId;
    } else if (shipmentMode === 'LCL') {
      existFreightRatePayload.cbm = payload.cbm;
    }
    console.log("existFreightRatePayload", existFreightRatePayload);
    const existFreightRate = await this.repository.existFreightRate(existFreightRatePayload);
    console.log("existFreightRate", existFreightRate);
    if (existFreightRate && existFreightRate.length > 0) {
      // than update price
      const rateId = existFreightRate[0].id;
      console.log("Existing freight rate found with ID", rateId, " - updating price to ", price);
      const updatedRate = await this.repository.updateRateFreight(rateId, { price });
      return updatedRate;
    }
    // create new rate
    const createPayload: any = {
      price,
      routeId,
      cargoType,
      shippingMethodId,
      carrierCompanyId,
      shipmentMode,
      shipScheduleId
    };
    if (shipmentMode === 'FCL') {
      createPayload.containerId = containerId;
    } else if (shipmentMode === 'LCL') {
      createPayload.cbm = payload.cbm;
    }
    console.log("createPayload", createPayload);
    const newRate = await this.repository.createRateFreight(createPayload);
    return newRate;
  }

  async getAllRateFreight(): Promise<any> {
    const rate = await this.repository.getAllRateFreight();
    return rate;
  }

  async findRateFreightByCriteria(payload: any): Promise<any> {
    const { toPortId, fromPortId,cargoType, shipmentMode,maxPrice, minPrice } = payload;
    // this port are exits check
    if (toPortId) {
      const toPort = await this.prisma.ports.findUnique({ where: { id: Number(toPortId) } });
      if (!toPort) {
        const error = new Error('To Port not found');
        (error as any).statusCode = 404;
        throw error;
      }
    }
    if (fromPortId) {
      const fromPort = await this.prisma.ports.findUnique({ where: { id: Number(fromPortId) } });
      if (!fromPort) {
        const error = new Error('From Port not found');
        (error as any).statusCode = 404;
        throw error;
      }
    }
    if(cargoType){
      const validCargoTypes = ['DG', 'NON_DG'];
      if (!validCargoTypes.includes(cargoType)) {
        const error = new Error('Invalid cargo type');
        (error as any).statusCode = 400;
        throw error;
      }
    }
    if(shipmentMode){
      const validShipmentModes = ['FCL', 'LCL'];
      if (!validShipmentModes.includes(shipmentMode)) {
        const error = new Error('Invalid shipment mode');
        (error as any).statusCode = 400;
        throw error;
      }
    }
    // maxPrice and minPrice validation
    if (maxPrice !== undefined && minPrice !== undefined) {
      const max = Number(maxPrice);
      const min = Number(minPrice);
      if (Number.isNaN(max) || Number.isNaN(min)) {
        const error = new Error('maxPrice and minPrice must be valid numbers');
        (error as any).statusCode = 400;
        throw error;
      }
      if (min > max) {
        const error = new Error('minPrice cannot be greater than maxPrice');
        (error as any).statusCode = 400;
        throw error;
      }
    }

    const rate = await this.repository.findRateFreightByCriteria(payload);
    return rate;
  }

  async findBookingShippingRateFreight(payload: any): Promise<any> {
    const { countryZoneId, shippingMethodId, weight } = payload;
    console.log("findBookingShippingRateFreight payload", payload);
    // all fields are required
    if (!countryZoneId || !shippingMethodId || !weight) {
      const error = new Error('countryZoneId, shippingMethodId, weight are required');
      (error as any).statusCode = 400;
      throw error;
    }
    // find weight category id based on weight


    const payloadWithCombinationId = {
      shippingMethodId
    };
    const rate = await this.repository.findRateFreightByCriteria(payloadWithCombinationId);
    return { rate };
  }

  async countryMethodWiseRateFreight(payload: any): Promise<any> {
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
    const rate = await this.repository.countryMethodWiseRateFreight(payloadWithCombinationId);
    return rate;
  }

  async bulkAdjustRateFreight(payload: any, transaction: any): Promise<any> {
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
        const found = await this.repository.findRateFreightByCriteria(queryPayload, transaction);
        console.log('Found existing rate for categoryId', catId, found);
        const existingPrice = found && found.length > 0 ? found[0].price : null;
        const newPrice = computeNewPrice(existingPrice);
        console.log(`CategoryId ${catId}: existingPrice=${existingPrice}, newPrice=${newPrice}`);

        if (existingPrice !== null && found && found.length > 0) {
          await this.repository.updateRateFreight(found[0].id, { price: newPrice }, transaction);
          return { categoryId: catId, action: 'updated', price: newPrice };
        }

        if (!applyToNonEmptyOnly) {
          queryPayload.price = newPrice;
          console.log('Creating new rate for categoryId', catId, queryPayload);
          await this.repository.createRateFreight(queryPayload, transaction);
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
    const data = await this.repository.findRateFreightByCriteria(queryPayload, transaction);
    console.log('Sample data for category1688Id=51:', queryPayload, data);
    const results: any[] = [];


    console.log(`Executed bulk adjust for ${results.length} categories...`);
    return results;
  }



  async findShippingRateFreightForProduct(payload: any): Promise<any> {
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





    const catagoryExit = await this.category1688Repository.geSubCategoryIdExit(subCategoryId) ?? await this.category1688Repository.getCategoryIdExit(categoryId);
    let rate = [];
    for (const method of shippingMethod) {

      const payloadWithCombinationId = {
        category1688Id: catagoryExit.id,
        shippingMethodId: method.id
      };
      console.log("payloadWithCombinationId", payloadWithCombinationId);
      const result = await this.repository.findRateFreightByCriteria(payloadWithCombinationId);
      rate.push(...result);
      console.log("method.id", method.id);
    }
    return rate;
  }


}

export default RateFreightService;