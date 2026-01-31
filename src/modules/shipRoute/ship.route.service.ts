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


    // Build ship schedule payload
    let shipSchedulePayload: Partial<ShipSchedulePayload> = {};
    if (sailingDate) {
      shipSchedulePayload.sailingDate = new Date(sailingDate);
    }
    if (arrivalDate) {
      shipSchedulePayload.arrivalDate = new Date(arrivalDate);
    }

    // Check if a ShipRoute with same carrier/from/to already exists
    const existingShipRoutes = await this.repository.getShipRouteWithCondition({
      carrierCompanyId,
      fromPortId,
      toPortId,
    });

    if (existingShipRoutes.length > 0) {
      // use the first matching route
      const existingRoute = existingShipRoutes[0];

      // Prevent duplicate schedules for the same route (same sailing & arrival)
      const duplicateSchedules = await ShipScheduleRepository.getShipScheduleWithCondition({
        shipRouteId: existingRoute.id,
        sailingDate: shipSchedulePayload.sailingDate,
        arrivalDate: shipSchedulePayload.arrivalDate,
      });

      if (duplicateSchedules && duplicateSchedules.length > 0) {
        const error = new Error('Ship schedule for this route with the same sailing and arrival dates already exists');
        (error as any).statusCode = 409;
        throw error;
      }

      // create schedule linked to existing route
      const createdSchedule = await ShipScheduleRepository.createShipSchedule({
        ...shipSchedulePayload,
        shipRouteId: existingRoute.id,
      });

      if (!createdSchedule) {
        const error = new Error('Failed to create ship schedule for the existing route');
        (error as any).statusCode = 500;
        throw error;
      }

      // return the route (optionally include the new schedule)
      return { ...existingRoute, createdSchedule };
    }

    // No existing route: create a new ShipRoute first, then attach the schedule
    const shipRoutePayload: ShipRoutePayload = {
      carrierCompanyId,
      fromPortId,
      toPortId,
    };

    const shipRoute = await this.repository.createShipRoute(shipRoutePayload);

    if (!shipRoute) {
      const error = new Error('Failed to create ship route');
      (error as any).statusCode = 500;
      throw error;
    }

    const createdSchedule = await ShipScheduleRepository.createShipSchedule({
      ...shipSchedulePayload,
      shipRouteId: shipRoute.id,
    });

    if (!createdSchedule) {
      const error = new Error('Failed to create ship schedule for the new route');
      (error as any).statusCode = 500;
      throw error;
    }

    return { ...shipRoute, createdSchedule };
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

