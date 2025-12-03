
// import prisma from '../../config/prismadatabase';
// import { pagination } from '../../utils/pagination';

// export class InventoryRepository {
//   async createNewInventory(payload: any) {
//     return await prisma.inventory.create({ data: payload });
//   }
//   async updateById(id: number, payload: any) {
//     return await prisma.inventory.update({
//       where: { id },
//       data: payload,
//     });
//   }
//   async createInventory(payload: any) {
//     return await prisma.inventory.create({ data: payload });
//   }

//   async getAllInventory(payload: { warehouseRefId: number }) {
//     const { warehouseRefId } = payload;
//     return await prisma.inventory.findMany({
//       where: { warehouseRefId },
//       include: { productRef: true },
//       orderBy: { createdAt: 'desc' },
//     });
//   }

//   async updateInventory(id: number, payload: any) {
//     const updatedInventory = await prisma.inventory.update({
//       where: { id },
//       data: payload,
//     });
//     if (!updatedInventory) {
//       throw new Error('Inventory not found');
//     }
//     return updatedInventory;
//   }

//   async getInventoryWithPagination(payload: any) {
//     return await pagination(payload, async (limit: number, offset: number, sortOrder: any) => {
//       const warehouseRefId = Number(payload.warehouseRefId ?? payload.warehouseRef);
//       const [doc, totalDoc] = await Promise.all([
//         prisma.inventory.findMany({
//           where: { warehouseRefId },
//           skip: offset,
//           take: limit,
//           orderBy: sortOrder,
//           include: { productRef: true },
//         }),
//         prisma.inventory.count({ where: { warehouseRefId } }),
//       ]);
//       return { doc, totalDoc };
//     });
//   }

//   async findProductInfo(order: any) {
//     return await prisma.inventory.findUnique({
//       where: { id: Number(order?.inventoryID) },
//       include: { productRef: true },
//     });
//   }

//   async inventoryOrderPlace(inventoryID: number, inventoryPayload: any) {
//     return await prisma.inventory.update({
//       where: { id: inventoryID },
//       data: {
//         availableQuantity: inventoryPayload.availableQuantity,
//         holdQuantity: inventoryPayload.holdQuantity,
//       },
//     });
//   }

//   async updateInventoryStatus(status: string, orderData: any) {
//     // Implement business logic as needed
//     // Example: update status field (if exists in schema)
//     // If no status field, remove this or update as needed
//     // return await prisma.inventory.update({
//     //   where: { id: Number(orderData.inventoryID) },
//     //   data: { status: status as any }, // update type if status exists
//     // });
//     throw new Error('Inventory status update not implemented: no status field in schema');
//   }

//   async updateInventoryOnOrderPlace(inventoryRef: number, quantity: number) {
//     // Decrement availableQuantity, increment holdQuantity
//     const inventory = await prisma.inventory.findUnique({ where: { id: inventoryRef } });
//     if (!inventory) throw new Error('Inventory not found');
//     return await prisma.inventory.update({
//       where: { id: inventoryRef },
//       data: {
//         availableQuantity: (inventory.availableQuantity ?? 0) - quantity,
//         holdQuantity: (inventory.holdQuantity ?? 0) + quantity,
//       },
//     });
//   }

//   async findInventoryByWarehous(inventoryRef: number, warehouseRefId: number) {
//     return await prisma.inventory.findFirst({
//       where: { id: inventoryRef, warehouseRefId },
//     });
//   }
// }

// const inventoryRepository = new InventoryRepository();
// export default inventoryRepository;
