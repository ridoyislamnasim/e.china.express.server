import { Prisma, PrismaClient, Warehouse } from '@prisma/client';
import { pagination } from '../../utils/pagination';
import { BaseRepository } from '../base/base.repository';
import { NotFoundError } from '../../utils/errors';

export interface WarehouseDoc {
  id: number;
  name: string;
  totalCapacity: number;
  location: string;
  status: boolean;
  createdBy?: number;
  updatedBy?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class WarehouseRepository extends BaseRepository<Warehouse> {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    super(prisma.warehouse);
    this.prisma = prisma;
  }

  // async getSingleBuyNowWarehouse(id: number) {
  //   const warehouseData = await this.prisma.buyNowWarehouse.findUnique({
  //     where: { id },
  //   });
  //   if (!warehouseData) throw new NotFoundError('Warehouse Not Found');
  //   return warehouseData;
  // }

  // async findWarehouseByUserAndProduct(query: any) {
  //   console.log('Finding warehouse with query:', query);
  //   const whereClause: any = {
  //     correlationId: query.correlationId,
  //     userRef: query.userRef ? { id: Number(query.userRef) } : undefined,
  //     productRef: query.productRef ? { id: Number(query.productRef) } : undefined,
  //     inventoryRef: query.inventoryRef ? { id: Number(query.inventoryRef) } : undefined,
  //   };
  //   return await this.prisma.warehouse.findFirst({ where: whereClause });
  // }

  //   async findBuyNowWarehouseByUserAndProduct(query: any) {
  //   console.log('Finding warehouse with query:', query);
  //   const whereClause: any = {
  //     correlationId: query.correlationId,
  //     userRef: query.userRef ? { id: Number(query.userRef) } : undefined,
  //     productRef: query.productRef ? { id: Number(query.productRef) } : undefined,
  //     inventoryRef: query.inventoryRef ? { id: Number(query.inventoryRef) } : undefined,
  //   };
  //   return await this.prisma.buyNowWarehouse.findFirst({ where: whereClause });
  // }
  async createWarehouse(payload: Partial<WarehouseDoc>, tx?: any) {
    console.log("payload", payload);
    const data: any = {
      name: payload.name,
      totalCapacity: new Prisma.Decimal(payload.totalCapacity || 0),
      location: payload.location,
      status: payload.status,
    };
    console.log("payload 999", data);
    const newWarehouse = await this.prisma.warehouse.create({
      data: data,
    });
    console.log('New warehouse created:', newWarehouse);
    return newWarehouse;
  }

  // async getAllWarehouseByUser(payload: any) {
  //   const { userRef, coupon, productRef, inventoryRef } = payload;
  //   const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(userRef);
  //   const query: any = {};
  //   if (isUUID) {
  //     query.correlationId = userRef;
  //   } else {
  //     query.userRef = { id: Number(userRef) };
  //   }

  //   // if (productRef && inventoryRef) {
  //   //   query.productRef = productRef;
  //   //   query.inventoryRef = inventoryRef;
  //   // }

  //   const warehouses = await prisma.warehouse.findMany({
  //     where: query,
  //     include: {
  //       productRef: true,
  //       userRef: true,
  //       inventoryRef: true,
  //     },
  //     orderBy: { createdAt: 'desc' },
  //   });

  //   let appliedCoupon = null;
  //   let message = `Viewing warehouses`;

  //   if (coupon) {
  //     const existingCoupon = await prisma.coupon.findFirst({ where: { code: coupon } });
  //     message = `Sorry, that coupon isn’t valid.`;

  //     if (existingCoupon) {
  //       const now = new Date();
  //       if (
  //         existingCoupon.startDate &&
  //         existingCoupon.expireDate &&
  //         now > existingCoupon.startDate &&
  //         now < existingCoupon.expireDate &&
  //         (existingCoupon.useLimit || 0) > (existingCoupon.used || 0)
  //       ) {
  //         appliedCoupon = existingCoupon;
  //         message = `Congratulations, your coupon was applied successfully!`;
  //       }
  //     }
  //   }

  //   let totalPrice = 0;
  //   let totalSaved = 0;
  //   let totalCouponDiscount = 0;
  //   let productDiscount = 0;
  //   console.log("warehouse details", warehouses.length)
  //   const warehouseDetails = warehouses.map((warehouse) => {
  //     const product = warehouse.productRef;
  //     const inventory = warehouse.inventoryRef;
  //     const quantity = warehouse.quantity || 0;

  //     const price = inventory?.price || 0;
  //     const discountAmount = inventory?.discountAmount || 0;

  //     let couponDiscount = 0;

  //     if (appliedCoupon) {
  //       if (
  //         (appliedCoupon.categoryRefId && String(appliedCoupon.categoryRefId) === String(product?.categoryRefId)) ||
  //         (appliedCoupon.subCategoryRefId && String(appliedCoupon.subCategoryRefId) === String(product?.subCategoryRefId))
  //       ) {
  //         const discount = appliedCoupon.discount || 0;
  //         couponDiscount =
  //           appliedCoupon.discountType === "percent"
  //             ? (price * discount) / 100
  //             : discount;

  //         couponDiscount *= quantity;
  //       }
  //     }

  //     const subtotal = price * quantity;
  //     const savedAmount = discountAmount * quantity + couponDiscount;

  //     totalPrice += subtotal - couponDiscount;
  //     productDiscount += discountAmount * quantity;
  //     totalCouponDiscount += couponDiscount;
  //     totalSaved += savedAmount;

  //     return {
  //       warehouseId: warehouse.id,
  //       quantity,
  //       product,
  //       inventory,
  //       subtotal,
  //       couponDiscount,
  //       savedAmount,
  //       productDiscount,
  //     };
  //   });

  //   console.log("warehouse ")
  //   console.log("warehouse details", warehouseDetails.length)

  //   return {
  //     data: {
  //       warehouseDetails,
  //       totalPrice,
  //       totalSaved,
  //       couponDiscount: totalCouponDiscount,
  //       productDiscount,
  //     },
  //     message,
  //   };
  // }

  // async updateWarehouse(id: number, payload: Partial<WarehouseDoc>) {
  //   const updatedWarehouse = await this.prisma.warehouse.update({
  //     where: { id },
  //     data: {
  //       quantity: payload.quantity,
  //       userRef: payload.userRef ? { connect: { id: Number(payload.userRef) } } : undefined,
  //       productRef: payload.productRef ? { connect: { id: Number(payload.productRef) } } : undefined,
  //       inventoryRef: payload.inventoryRef ? { connect: { id: Number(payload.inventoryRef) } } : undefined,
  //       correlationId: payload.correlationId,
  //     },
  //   });
  //   if (!updatedWarehouse) {
  //     throw new Error('Warehouse not found');
  //   }
  //   return updatedWarehouse;
  // }

  // async updateWarehouseQuantity(warehouseId: number, quantity: number) {
  //   return await this.prisma.warehouse.update({
  //     where: { id: warehouseId },
  //     data: { quantity },
  //   });
  // }

  // async getWarehouseWithPagination(payload: any) {
  //   try {
  //     const warehouses = await pagination(
  //       payload,
  //       async (limit: number, offset: number, sortOrder: any) => {
  //         // const prismaSortOrder = sortOrder === -1 ? 'desc' : 'asc';
  //         const warehouses = await this.prisma.warehouse.findMany({
  //           where: { userRef: payload.userId ? { id: Number(payload.userId) } : undefined },
  //           // orderBy: { createdAt: prismaSortOrder },
  //           skip: offset,
  //           take: limit,
  //         });
  //         const totalWarehouse = await this.prisma.warehouse.count({
  //           where: { userRef: payload.userId ? { id: Number(payload.userId) } : undefined },
  //         });
  //         return { doc: warehouses, totalDoc: totalWarehouse };
  //       }
  //     );
  //     return warehouses;
  //   } catch (error) {
  //     // console.error('Error getting warehouses with pagination:', error);
  //     throw error;
  //   }
  // }

  // async getUserAllWarehouseById(userId: string) {
  //   const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(userId);
  //   const query: any = {};
  //   if (isUUID) {
  //     query.correlationId = userId;
  //   } else {
  //     query.userRef = { id: Number(userId) };
  //   }
  //   return await this.prisma.warehouse.findMany({
  //     where: query,
  //     include: {
  //       productRef: true,
  //       userRef: true,
  //       inventoryRef: true,
  //     },
  //   });
  // }

  // async deleteWarehouse(id: string) {
  //     const deletedWarehouse = await this.prisma.warehouse.delete({
  //       where: { id: Number(id) },
  //     });
  //   return deletedWarehouse;
  // }
  //   async deleteBuyNowWarehouse(id: string) {
  //     const deletedWarehouse = await this.prisma.buyNowWarehouse.delete({
  //       where: { id: Number(id) },
  //     });
  //   return deletedWarehouse;
  // }


  // Buy now Warehouse

  // async createBuyNowWarehouse(payload: Partial<WarehouseDoc>) {
  //   console.log("payload", payload);
  //   const data: any = {
  //     quantity: payload.quantity,
  //     productRef: payload.productRef
  //       ? { connect: { id: Number(payload.productRef) } }
  //       : undefined,
  //     inventoryRef: payload.inventoryRef
  //       ? { connect: { id: Number(payload.inventoryRef) } }
  //       : undefined,
  //   };
  //   console.log("payload 999", data);

  //   if (payload.userRef) {
  //     data.userRef = { connect: { id: Number(payload.userRef) } };
  //   } else if (payload.correlationId) {
  //     data.correlationId = payload.correlationId;
  //   }

  //   if (payload.userRef) {
  //     data.userRef = { connect: { id: Number(payload.userRef) } };
  //   } else if (payload.correlationId) {
  //     data.correlationId = payload.correlationId;
  //   }
  //   console.log('Creating warehouse with data:', data);
  //   const newWarehouse = await this.prisma.buyNowWarehouse.create({
  //     data: data,
  //   });
  //   console.log('New warehouse created:', newWarehouse);
  //   return newWarehouse;
  // }

  // async getAllBuyNowWarehouseByUser(payload: any) {
  //   const { userId, coupon, productRef, inventoryRef } = payload;

  //   const query: any = {};
  //   // if (/^[a-f\d]{24}$/i.test(userId)) {
  //   //   query.userRef = userId;
  //   // } else {
  //   //   query.correlationId = userId;
  //   // }
  //   const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  //   .test(userId || '');
  //   if (!isUUID) {
  //     console.log('Creating warehouse with query 4:', isUUID);
  //     query.userRef = Number(userId);
  //   } else {
  //     console.log('Creating warehouse with query 5:', isUUID);
  //     query.correlationId = userId;
  //   }

  //   // if (productRef && inventoryRef) {
  //   //   query.productRef = productRef;
  //   //   query.inventoryRef = inventoryRef;
  //   // }

  //   const warehouses = await prisma.buyNowWarehouse.findMany({
  //     where: query,
  //     include: {
  //       productRef: true,
  //       userRef: true,
  //       inventoryRef: true,
  //     },
  //   });

  //   let appliedCoupon = null;
  //   let message = `Viewing warehouses`;

  //   if (coupon) {
  //     const existingCoupon = await prisma.coupon.findFirst({ where: { code: coupon } });
  //     message = `Sorry, that coupon isn’t valid.`;

  //     if (existingCoupon) {
  //       const now = new Date();
  //       if (
  //         existingCoupon.startDate &&
  //         existingCoupon.expireDate &&
  //         now > existingCoupon.startDate &&
  //         now < existingCoupon.expireDate &&
  //         (existingCoupon.useLimit || 0) > (existingCoupon.used || 0)
  //       ) {
  //         appliedCoupon = existingCoupon;
  //         message = `Congratulations, your coupon was applied successfully!`;
  //       }
  //     }
  //   }

  //   let totalPrice = 0;
  //   let totalSaved = 0;
  //   let totalCouponDiscount = 0;
  //   let productDiscount = 0;

  //   interface WarehouseProduct {
  //     id: number;
  //     categoryRefId?: number | string;
  //     subCategoryRefId?: number | string;
  //     // add other product fields as needed
  //     [key: string]: any;
  //   }

  //   interface WarehouseInventory {
  //     id: number;
  //     price?: number;
  //     discountAmount?: number;
  //     // add other inventory fields as needed
  //     [key: string]: any;
  //   }

  //   interface BuyNowWarehouseItem {
  //     id: number;
  //     quantity?: number;
  //     productRef?: WarehouseProduct;
  //     inventoryRef?: WarehouseInventory;
  //     userRef?: any;
  //     // add other warehouse fields as needed
  //     [key: string]: any;
  //   }

  //   interface AppliedCoupon {
  //     categoryRefId?: number | string;
  //     subCategoryRefId?: number | string;
  //     discount?: number;
  //     discountType?: string;
  //     startDate?: Date;
  //     expireDate?: Date;
  //     useLimit?: number;
  //     used?: number;
  //     // add other coupon fields as needed
  //     [key: string]: any;
  //   }

  //   interface WarehouseDetail {
  //     warehouseId: number;
  //     quantity: number;
  //     product: WarehouseProduct | undefined;
  //     inventory: WarehouseInventory | undefined;
  //     subtotal: number;
  //     couponDiscount: number;
  //     savedAmount: number;
  //     productDiscount: number;
  //   }

  //   const warehouseDetails: WarehouseDetail[] = (warehouses as BuyNowWarehouseItem[]).map((warehouse: BuyNowWarehouseItem): WarehouseDetail => {
  //     const product = warehouse.productRef;
  //     const inventory = warehouse.inventoryRef;
  //     const quantity = warehouse.quantity || 0;

  //     const price = inventory?.price || 0;
  //     const discountAmount = inventory?.discountAmount || 0;

  //     let couponDiscount = 0;

  //     if (appliedCoupon) {
  //       if (
  //         (appliedCoupon.categoryRefId && String(appliedCoupon.categoryRefId) === String(product?.categoryRefId)) ||
  //         (appliedCoupon.subCategoryRefId && String(appliedCoupon.subCategoryRefId) === String(product?.subCategoryRefId))
  //       ) {
  //         const discount = appliedCoupon.discount || 0;
  //         couponDiscount =
  //           appliedCoupon.discountType === "percent"
  //             ? (price * discount) / 100
  //             : discount;

  //         couponDiscount *= quantity;
  //       }
  //     }

  //     const subtotal = price * quantity;
  //     const savedAmount = discountAmount * quantity + couponDiscount;

  //     totalPrice += subtotal - couponDiscount;
  //     productDiscount += discountAmount * quantity;
  //     totalCouponDiscount += couponDiscount;
  //     totalSaved += savedAmount;

  //     return {
  //       warehouseId: warehouse.id,
  //       quantity,
  //       product,
  //       inventory,
  //       subtotal,
  //       couponDiscount,
  //       savedAmount,
  //       productDiscount,
  //     };
  //   });

  //   return {
  //     data: {
  //       warehouseDetails,
  //       totalPrice,
  //       totalSaved,
  //       couponDiscount: totalCouponDiscount,
  //       productDiscount,
  //     },
  //     message,
  //   };
  // }

  //   async updateBuyNowWarehouseQuantity(warehouseId: number, quantity: number) {
  //     console.log("warehouse info", warehouseId, quantity);
  //   return await this.prisma.buyNowWarehouse.update({
  //     where: { id: warehouseId },
  //     data: { quantity },
  //   });
  // }
}

const prisma = new PrismaClient();
export default new WarehouseRepository(prisma);
