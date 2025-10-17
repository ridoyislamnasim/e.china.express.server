"use strict";
// import { NotFoundError } from '../../utils/errors';
// import { BaseService } from '../base/base.service';
// import { InventoryDoc } from './inventory.repository';
// import inventoryRepository from './inventory.repository';
// import productRepository from '../product/product.repository';
// import { idGenerate } from '../../utils/IdGenerator';
// export class InventoryService extends BaseService<InventoryDoc> {
//   private repository: typeof inventoryRepository;
//   private productRepository: typeof productRepository;
//   constructor(repository: typeof inventoryRepository, productRepository: typeof productRepository, serviceName: string) {
//     super(repository, productRepository, serviceName);
//     this.repository = repository;
//     this.productRepository = productRepository;
//   }
//   async createInventory(payload: any, session?: any) {
//     const { name, quantity, level, color, productRef, warehouseRef } = payload;
//     if (!productRef || !quantity || !warehouseRef) {
//       throw new Error('All fields are required');
//     }
//     const product = await this.productRepository.findById(productRef);
//     if (!product) throw new NotFoundError('Product Not Found');
//     payload.availableQuantity = quantity;
//     payload.inventoryID = await idGenerate('INV-', 'inventoryID', this.repository);
//     if (quantity && !name && !color && !level) {
//       payload.inventoryType = 'inventory';
//     } else if (quantity && name && color && level) {
//       payload.inventoryType = 'colorLevelInventory';
//     } else if (quantity && name && color && !level) {
//       payload.inventoryType = 'colorInventory';
//     } else if (quantity && !name && !color && level) {
//       payload.inventoryType = 'levelInventory';
//     }
//     const inventoryData = await this.repository.createInventory(payload, session);
//     if (inventoryData) {
//       await this.productRepository.addProductInventory(
//         inventoryData[0]._id,
//         productRef,
//         session
//       );
//     }
//     return inventoryData;
//   }
//   async getAllInventory(payload: any) {
//     return await this.repository.getAllInventory(payload);
//   }
//   async getInventoryWithPagination(payload: any) {
//     const inventory = await this.repository.getInventoryWithPagination(payload);
//     return inventory;
//   }
//   async getSingleInventory(id: string) {
//     const inventoryData = await this.repository.findById(id);
//     if (!inventoryData) throw new NotFoundError('Inventory Not Find');
//     return inventoryData;
//   }
//   async updateInventory(id: string, payload: any, session?: any) {
//     const { name, quantity, level, color, productRef, warehouseRef } = payload;
//     if (!productRef || !quantity || !warehouseRef) {
//       throw new Error('All fields are required');
//     }
//     const product = await this.productRepository.findById(productRef);
//     if (!product) throw new NotFoundError('Product Not Found');
//     if (quantity && !name && !color && !level) {
//       payload.inventoryType = 'inventory';
//     } else if (quantity && name && color && level) {
//       payload.inventoryType = 'colorLevelInventory';
//     } else if (quantity && name && color && !level) {
//       payload.inventoryType = 'colorInventory';
//     } else if (quantity && !name && !color && level) {
//       payload.inventoryType = 'levelInventory';
//     }
//     const inventoryData = await this.repository.updateInventory(id, payload);
//     return inventoryData;
//   }
//   async updateInventoryStatus(id: string, status: boolean | string) {
//     if (!status) throw new NotFoundError('Status is required');
//     if (typeof status === 'string') status = status === 'true';
//     const inventory = await this.repository.updateInventoryStatus(id, {
//       status: status,
//     });
//     if (!inventory) throw new NotFoundError('Inventory not found');
//     return inventory;
//   }
//   async deleteInventory(id: string, session?: any) {
//     const inventory = await this.repository.findById(id);
//     if (!inventory) throw new NotFoundError('Inventory not found');
//     const deletedInventory = await this.repository.deleteById(id, session);
//     if (!deletedInventory) {
//       throw new Error('Failed to delete inventory. Please try again.');
//     }
//     const productRef = inventory.productRef;
//     await this.productRepository.updateProductInventory(id, productRef, session);
//     return deletedInventory;
//   }
// }
// const inventoryService = new InventoryService(inventoryRepository, productRepository, 'inventory');
// export default inventoryService;
