import ShipRoutePayload from '../../types/shipRoute.type';


import shipRouteRepository, { ShipRouteRepository } from './ship.route.repository';
import countryRepository from '../country/country.repository';
import ShipScheduleRepository from '../shipSchedule/ship.schedule.repository';
import ShipRepository, { CarrierCompanyRepository } from '../carrierCompany/carrier.company.repository';
import carrierCompanyRepository from '../carrierCompany/carrier.company.repository';
import ShipSchedulePayload from '../../types/shipSchedule.type';



export class ShipRouteService {
  private repository: ShipRouteRepository;
  // private roleRepository: RoleRepository;

  constructor(repository: ShipRouteRepository = shipRouteRepository) {
    this.repository = repository;
  }


  async createShipRoute(payload: ShipRoutePayload): Promise<any> {

    const { carrierCompanyId, fromPortId, toPortId, sailingDate, arrivalDate } = payload;
    console.log("Creating ShipRoute with payload: ", payload);

    // check required fields and all are exist
    if (
      carrierCompanyId === undefined ||
      fromPortId === undefined ||
      toPortId === undefined ||
      sailingDate === undefined ||
      arrivalDate === undefined
    ) {
      const error = new Error('Missing required fields in ship route payload');
      (error as any).statusCode = 400;
      throw error;
    }

    // Check if ship exists
    const existShip = await carrierCompanyRepository.getCarrierCompanyById(carrierCompanyId);
    if (!existShip) {
      const error = new Error('Ship with the given shipId does not exist');
      (error as any).statusCode = 404;
      throw error;
    }


    const existFromPort = await countryRepository.portExists({ id: fromPortId });
    if (!existFromPort) {
      const error = new Error('From port with the given fromPortId does not exist');
      (error as any).statusCode = 404;
      throw error;
    }
    const existToPort = await countryRepository.portExists({ id: toPortId });
    if (!existToPort) {
      const error = new Error('To port with the given toPortId does not exist');
      (error as any).statusCode = 404;
      throw error;
    }


    let shipSchedulePayload: Partial<ShipSchedulePayload> = {};
    if (sailingDate) {
      shipSchedulePayload.sailingDate = new Date(sailingDate);
    }
    if (arrivalDate) {
      shipSchedulePayload.arrivalDate = new Date(arrivalDate);
    }
    const createSchedule = await ShipScheduleRepository.createShipSchedule(shipSchedulePayload);
    if (!createSchedule) {
      const error = new Error('Failed to create ship schedule with the given sailingDate and arrivalDate');
      (error as any).statusCode = 404;
      throw error;
    }

    const existingShipRoutes = await this.repository.getShipRouteWithCondition({
      carrierCompanyId,
      fromPortId,
      toPortId,
      shipScheduleId: createSchedule.id
    });
    if (existingShipRoutes.length > 0) {
      const error = new Error('ShipRoute with the same carrierCompanyId, fromPortId, toPortId, and shipScheduleId already exists');
      (error as any).statusCode = 409;
      throw error;
    }

    const shipRoutePayload: ShipRoutePayload = {
      carrierCompanyId,
      fromPortId,
      toPortId,
      shipScheduleId: createSchedule.id
    };

    const shipRoute = await this.repository.createShipRoute(shipRoutePayload);
    return shipRoute;
  }



  async getAllShipRoutes(payload?: any) {

    const shipRoutes = await this.repository.getAllShipRoutes(payload);
    console.log("Fetched ShipRoutes: ", shipRoutes);
    return shipRoutes;
  }

  async getShipRouteWithPagination(payload: { page: number; limit: number, carrierCompanyId?: number }, tx: any): Promise<any> {
    const { page, limit, carrierCompanyId } = payload;
    const offset = (page - 1) * limit;
    const countries = await this.repository.getShipRouteWithPagination({ limit, offset, carrierCompanyId }, tx);
    return countries;
  }


  async getShipRouteById(id: number): Promise<any> {
    const shipRoute = await this.repository.getShipRouteById(id);
    return shipRoute;
  }

  async updateShipRoute(id: number, payload: ShipRoutePayload, tx: any): Promise<any> {
    const { carrierCompanyId, fromPortId, toPortId, shipScheduleId, } = payload;

    // Check if ship exists
    const existShip = await carrierCompanyRepository.getCarrierCompanyById(carrierCompanyId);
    if (!existShip) {
      const error = new Error('Ship with the given shipId does not exist');
      (error as any).statusCode = 404;
      throw error;
    }

    // Check if shipScheduleId exists
    const existSchedule = await ShipScheduleRepository.getShipScheduleById(Number(shipScheduleId));
    if (!existSchedule) {
      const error = new Error('Ship schedule with the given shipScheduleId does not exist');
      (error as any).statusCode = 404;
      throw error;
    }

    // Check if fromPortId exists
    const existFromPort = await countryRepository.portExists({ id: fromPortId });
    if (!existFromPort) {
      const error = new Error('From port with the given fromPortId does not exist');
      (error as any).statusCode = 404;
      throw error;
    }

    // Check if toPortId exists
    const existToPort = await countryRepository.portExists({ id: toPortId });
    if (!existToPort) {
      const error = new Error('To port with the given toPortId does not exist');
      (error as any).statusCode = 404;
      throw error;
    }

    const shipRoutePayload: ShipRoutePayload = {
      carrierCompanyId,
      fromPortId,
      toPortId,
      shipScheduleId
    };
    const updatedShipRoute = await this.repository.updateShipRoute(id, shipRoutePayload, tx);
    return updatedShipRoute;
  }

  async deleteShipRoute(id: number): Promise<void> {
    // find the shipRoute first
    const shipRoute = await this.repository.getShipRouteById(id);
    if (!shipRoute) {
      const error = new Error('ShipRoute not found');
      (error as any).statusCode = 404;
      throw error;
    }
    // then delete ports associated with the shipRoute

    return await this.repository.deleteShipRoute(id);
  }

}

