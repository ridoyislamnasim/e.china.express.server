import ShipSchedulePayload from '../../types/shipSchedule.type';
import shipScheduleRepository, { ShipScheduleRepository } from './ship.schedule.repository';
// import { ShipSchedulePayload } from '../../types/shipSchedule.type';


export class ShipScheduleService {
  private repository: ShipScheduleRepository;
  // private roleRepository: RoleRepository;

  constructor(repository: ShipScheduleRepository = shipScheduleRepository) {
    this.repository = repository;
  }

  
  async createShipSchedule(payload: ShipSchedulePayload): Promise<any> {
    const { sailingDate, arrivalDate } = payload;

    // Validate required fields make this more robust later
    if (!sailingDate || !arrivalDate ) {
      const error = new Error('ShipSchedule sailingDate and arrivalDate are required');
      (error as any).statusCode = 400;
      throw error;
    }
    let shipSchedulePayload: Partial<ShipSchedulePayload> = {};
    if (sailingDate) {
      shipSchedulePayload.sailingDate = new Date(sailingDate);
    }
    if (arrivalDate) {
      shipSchedulePayload.arrivalDate = new Date(arrivalDate);
    }
    if (!shipSchedulePayload.sailingDate || !shipSchedulePayload.arrivalDate) {
      throw new Error('sailingDate and arrivalDate must be valid ISO date strings or Date objects');
    }

    const shipSchedule = await this.repository.createShipSchedule(shipSchedulePayload);
    return shipSchedule;
  }
    


  async getAllShipSchedules(payload?: any){
    const shipSchedules = await this.repository.getAllShipSchedules();
    console.log("Fetched ShipSchedules: ", shipSchedules);
    return shipSchedules;
  }

  async getShipScheduleWithPagination(payload: { page: number; limit: number }, tx: any): Promise<any> {
    const { page, limit } = payload;
    const offset = (page - 1) * limit;
    const countries = await this.repository.getShipScheduleWithPagination({ limit, offset }, tx);
    return countries;
  }


  async getShipScheduleById(id: number): Promise<any> {
    const shipSchedule = await this.repository.getShipScheduleById(id);
    return shipSchedule;
  }
  
  async updateShipSchedule(id: number, payload: ShipSchedulePayload, tx: any): Promise<any> {
    const { sailingDate, arrivalDate } = payload;

    const shipSchedulePayload: ShipSchedulePayload = {
      sailingDate:  new Date(sailingDate),
      arrivalDate:  new Date(arrivalDate)
    };
    const updatedShipSchedule = await this.repository.updateShipSchedule(id, shipSchedulePayload, tx);

    return updatedShipSchedule;
  }

  async deleteShipSchedule(id: number): Promise<void> {
    // find the shipSchedule first
    const shipSchedule = await this.repository.getShipScheduleById(id);
    if (!shipSchedule) {
      const error = new Error('ShipSchedule not found');
      (error as any).statusCode = 404;
      throw error;
    }
    // then delete ports associated with the shipSchedule
    
   return  await this.repository.deleteShipSchedule(id);
  }

}

