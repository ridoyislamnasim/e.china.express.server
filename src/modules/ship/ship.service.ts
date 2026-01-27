

import ShipPayload from '../../types/ship.type';
import shipRepository, { ShipRepository } from './ship.repository';
// import { ShipPayload } from '../../types/ship.type';


export class ShipService {
  private repository: ShipRepository;
  // private roleRepository: RoleRepository;

  constructor(repository: ShipRepository = shipRepository) {
    this.repository = repository;
  }

  
  async createShip(payload: ShipPayload): Promise<any> {
    const { name, code,  status } = payload;

    // Validate required fields make this more robust later
    if (!name || !code ) {
      const error = new Error('Ship name and code are required');
      (error as any).statusCode = 400;
      throw error;
    }

  
    const shipPayload: ShipPayload = {
      name,
      code,
      status
    };

    const ship = await this.repository.createShip(shipPayload);
    return ship;
  }
    


  async getAllShips(payload?: any){
    const ships = await this.repository.getAllShips();
    console.log("Fetched Ships: ", ships);
    return ships;
  }

  async getShipWithPagination(payload: { page: number; limit: number }, tx: any): Promise<any> {
    const { page, limit } = payload;
    const offset = (page - 1) * limit;
    const countries = await this.repository.getShipWithPagination({ limit, offset }, tx);
    return countries;
  }


  async getShipById(id: number): Promise<any> {
    const ship = await this.repository.getShipById(id);
    return ship;
  }
  
  async updateShip(id: number, payload: ShipPayload, tx: any): Promise<any> {
    const { name, code,  status } = payload;

    const shipPayload: ShipPayload = {
      name,
      code,
      status
    };
    const updatedShip = await this.repository.updateShip(id, shipPayload, tx);


    return updatedShip;
  }

  async deleteShip(id: number): Promise<void> {
    // find the ship first
    const ship = await this.repository.getShipById(id);
    if (!ship) {
      const error = new Error('Ship not found');
      (error as any).statusCode = 404;
      throw error;
    }
    // then delete ports associated with the ship
    
   return  await this.repository.deleteShip(id);
  }

}

