import { NotFoundError } from '../../utils/errors';
import { BaseService } from '../base/base.service';
import productRepository from '../product/product.repository';
import warehouseRepository from './warehouse.repository';

export class WarehouseService extends BaseService<typeof warehouseRepository> {
  private repository: typeof warehouseRepository;
  constructor(repository: typeof warehouseRepository) {
    super(repository);
    this.repository = repository;
  }

  async createWarehouse(payload: any, tx?: any) {
    const { name, totalCapacity, location, status } = payload;
    // name , totalCapacity, location are requrired fields
    if (!name || !totalCapacity || !location) {
      throw new Error('Name, Total Capacity, and Location are required fields');
    }
    const warehouseData = await this.repository.createWarehouse(payload, tx);




    return warehouseData;
  }

//   async getUserAllWarehouseById(userId: string) {
//     return await this.repository.getUserAllWarehouseById(userId);
//   }

//   async getAllWarehouseByUser(payload: any) {
//     return await this.repository.getAllWarehouseByUser(payload);
//   }

//   async getWarehouseWithPagination(payload: any) {
//     const warehouse = await this.repository.getWarehouseWithPagination(payload);
//     return warehouse;
//   }

//   async getSingleWarehouse(id: number) {
//     // const warehouseData = await this.repository.getSingleWarehouse(id);
//     // if (!warehouseData) throw new NotFoundError('Warehouse Not Find');
//     return null;
//   }

//     async getSingleBuyNowWarehouse(id: number) {
//     const warehouseData = await this.repository.getSingleBuyNowWarehouse(id);
//     if (!warehouseData) throw new NotFoundError('Warehouse Not Find');
//     return warehouseData;
//   }

//   async updateWarehouse(id: number, payload: any) {
//     const warehouseData = await this.repository.updateWarehouse(id, payload);
//     return warehouseData;
//   }

//   async updateWarehouseQuantity(warehouseId: number, newQuantity: number) {
//     const updatedWarehouse = await this.repository.updateWarehouseQuantity(
//       warehouseId,
//       newQuantity
//     );
//     if (!updatedWarehouse) {
//       throw new Error('Warehouse not found');
//     }
//     // Optionally, calculate totals and return them here
//     return updatedWarehouse;
//   }

//   async deleteWarehouse(id: string) {
//     const deletedWarehouse = await this.repository.deleteWarehouse(id);
//     return deletedWarehouse;
//   }

//   // Buy now Warehouse ==========================================
//   async createBuyNowWarehouse(payload: any, tx?: any) {
//     const { quantity, userRef, productRef, inventoryRef } = payload;
//     if (!productRef && !inventoryRef) {
//       throw new Error('Product ID & Inventory ID is required');
//     }
//     console.log("Creating warehouse with query buy now 1:", payload);
//     const productExists = await productRepository.getSingleProduct(productRef);
//     console.log('Product exists:', productExists);
//     payload.productRef = productExists?.id;
//     const query: any = {};
//     console.log('Creating warehouse with query buy now 2:', payload);
// const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
//     .test(payload?.userRef || '');
//     console.log('Creating warehouse with query 3:', isUUID);
//     if (!isUUID) {
//       console.log('Creating warehouse with query 4:', isUUID);
//       query.userRef = Number(userRef);
//       payload.userRef = query.userRef;
//       // query.productRef = productRef;
//       // query.inventoryRef = inventoryRef;
//     } else {
//       console.log('Creating warehouse with query 5:', isUUID);
//       query.correlationId = userRef;
//       payload.correlationId = query.correlationId;
//       delete payload.userRef;
//       // query.productRef = productRef;
//       // query.inventoryRef = inventoryRef;
//     }
//     console.log('Creating warehouse with query:', query);
//     const existingWarehouse = await this.repository.findBuyNowWarehouseByUserAndProduct(query);
//     console.log('Existing warehouse found:', existingWarehouse);
//     let warehouseData;
//     if (existingWarehouse) {
//       // Update the existing warehouse's quantity
//       await this.repository.deleteBuyNowWarehouse(String(existingWarehouse.id));
//       // const updatedQuantity = Number(existingWarehouse.quantity) + Number(quantity);
//       // warehouseData = await this.repository.updateWarehouseQuantity(
//       //   existingWarehouse.id,
//       //   updatedQuantity
//       // );
//     } 
//       // Create a new warehouse document
//       warehouseData = await this.repository.createBuyNowWarehouse(payload);

//     return warehouseData;
//   }

//   async getAllBuyNowWarehouseByUser(payload: any) {
//     return await this.repository.getAllBuyNowWarehouseByUser(payload);
//   }

//     async updateBuyNowWarehouseQuantity(warehouseId: number, newQuantity: number) {
//     const updatedWarehouse = await this.repository.updateBuyNowWarehouseQuantity(
//       warehouseId,
//       newQuantity
//     );
//     if (!updatedWarehouse) {
//       throw new Error('Warehouse not found');
//     }
//     // Optionally, calculate totals and return them here
//     return updatedWarehouse;
//   }
}

export default new WarehouseService(warehouseRepository);
