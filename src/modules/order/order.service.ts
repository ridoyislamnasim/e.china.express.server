import { NotFoundError } from '../../utils/errors';
import { BaseService } from '../base/base.service';
import orderRepository from './order.repository';
import cartRepository from '../cart/cart.repository';
import inventoryRepository from '../inventory/inventory.repository';
import { idGenerate } from '../../utils/IdGenerator';
import { PrismaClient } from '@prisma/client';

export class OrderService extends BaseService<any> {
  private repository: typeof orderRepository;
  private cartRepository: any;
  private inventoryRepository: any;
  private prisma: PrismaClient;

  constructor(
    repository: typeof orderRepository,
    cartRepository: any,
    inventoryRepository: any,
    prisma: PrismaClient,
  ) {
    super(repository);
    this.repository = repository;
    this.cartRepository = cartRepository;
    this.inventoryRepository = inventoryRepository;
    this.prisma = prisma;
  }

  async createOrder(payload: any, tx?: any) {
    const {
      subTotalPrice,
      totalPrice,
      shippingCost,
      coupon,
      userRef,
      customerName,
      customerPhone,
      customerEmail,
      customerCity,
      customerAddress,
      customerAltPhone,
      paymentMethod,
    } = payload;

    console.log('Creating order with payload:', payload);
    if (!userRef) throw new NotFoundError('User is required');
    if (!customerName) throw new NotFoundError('Customer name is required');
    if (!customerPhone) throw new NotFoundError('Customer phone is required');
    if (!customerCity) throw new NotFoundError('Customer city is required');
    if (!paymentMethod) throw new NotFoundError('Payment method is required');
    if (shippingCost == null || shippingCost == undefined) throw new NotFoundError('Shipping cost is required');
 
    const orderId = await idGenerate('ORD-', 'orderId', this.prisma.order);
    payload.orderId = String(orderId);

    console.log('Creating order with payload:', payload);
    const orderData = await this.repository.createOrder(
       payload,
       tx
    );

    return orderData;
  }

  async createAdminOrder(payload: any, tx: any) {
    const { userRef, orders, warehouseRef, payment } = payload;
    let paymentResult = null;

    // if (payment > 0) {
    //   paymentResult = await this.prisma.payment.create({
    //     data: {
    //       amount: payment,
    //       userRef: userRef,
    //       warehouseRef: warehouseRef,
    //     },
    //   });
    //   payload.paymentRef = [paymentResult.id];
    // }

    if (!warehouseRef) throw new NotFoundError('Warehouse is required');

    let productIds: any[] = [];
    let totalPrice = 0;
    let subTotalPrice = 0;
    let totalDiscount = 0;

    for (const order of orders) {
      const productInfo = await this.inventoryRepository.findProductInfo(order);
      productIds.push({
        productRef: productInfo?.productRef?.id,
        inventoryRef: order?.inventoryID,
        quantity: order?.quantity,
        color: productInfo?.name,
        level: productInfo?.level,
        productDiscount: order?.discount,
      });

      totalPrice += productInfo?.productRef?.mrpPrice * Number(order?.quantity);
      totalDiscount += Number(order?.discount) * Number(order?.quantity) || 0;
      subTotalPrice +=
        productInfo?.productRef?.mrpPrice * Number(order?.quantity) -
        totalDiscount || 0;

      const availableQuantity = productInfo?.availableQuantity || 0;
      const quantityToHold = Number(order?.quantity);

      if (availableQuantity < quantityToHold) {
        throw new Error(`Insufficient stock for product ${productInfo?.productRef?.name}`);
      }

      const inventoryID = order?.inventoryID;
      const inventoryPayload = {
        availableQuantity: availableQuantity - quantityToHold,
        holdQuantity: Number(productInfo?.holdQuantity) + quantityToHold,
      };

      await this.inventoryRepository.inventoryOrderPlace(
        inventoryID,
        inventoryPayload
      );
    }

    payload.orders = productIds;
    payload.totalPrice = totalPrice;
    payload.subTotalPrice = subTotalPrice;
    payload.totalDiscount = totalDiscount;

    const orderData = await this.prisma.order.create({
      data: payload,
    });

    return orderData;
  }

  async getAllOrder() {
    return await this.repository.getAllOrder();
  }

    async getOrderProducts() {
    return await this.repository.getOrderProducts();
  }

  async getOrderWithPagination(payload: any) {
    const order = await this.repository.getOrderWithPagination(payload);
    return order;
  }

    async getIncompleteOrderWithPagination(payload: any) {
    const order = await this.repository.getIncompleteOrderWithPagination(payload);
    return order;
  }

  async getSingleOrder(id: string) {
    const orderData = await this.repository.getSingleOrder(id);
    if (!orderData) throw new NotFoundError('Order Not Find');
    return orderData;
  }

  async getUserAllOrder(id: string) {
    const isObjectId = /^[a-f\d]{24}$/i.test(id);
    const query: any = {};
    if (!isObjectId) {
      query.correlationId = id;
    } else {
      query.userRef = id;
    }
    // const orderData = await this.repository.findAll(query, ['products.productRef']);
    // if (!orderData) throw new NotFoundError('Order Not Find');
    // return orderData;
  }

  async orderTracking(payload: any) {
    const { orderId } = payload;
    const orderData = await this.repository.orderTracking({ orderId: orderId });
    if (!orderData) throw new NotFoundError('Order Not Find');
    return orderData;
  }

  async updateOrder(id: string, payload: any) {
    const orderData = await this.repository.updateOrder(Number(id), payload);
    return orderData;
  }

  async updateOrderStatus(id: string, status: string, tx?: any) {
    if (!status) throw new NotFoundError('Status is required');
    const orderData = await this.repository.getSingleOrder(id);
    if (!orderData) throw new NotFoundError('Order not found');
    await this.inventoryRepository.updateInventoryStatus(
      status,
      orderData,
      tx
    );
    const order = await this.repository.updateOrderStatus(Number(id), status);
    if (!order) throw new NotFoundError('Order not found');
    return order;
  }

  async isCourierSending(id: string, tx?: any) {
    const orderData = await this.repository.getSingleOrder(id);
    if (!orderData) throw new NotFoundError('Order not found');
    // const order = await this.repository.updateById(id, { isCourierSend: true }, tx);
    // if (!order) throw new NotFoundError('Order not found');
    // return order;
  }

  async deleteOrder(id: string, tx?: any) {
    const order = await this.repository.getSingleOrder(id);
    if (!order) throw new NotFoundError('Order not found');
    // for (const product of order?.products) {
    //   const inventoryRef = product?.inventoryRef;
    //   const inventory = await this.inventoryRepository.findById(inventoryRef);
    //   let inventoryPayload: any = {};
    //   if (order?.status == 'OrderPlaced') {
    //     inventoryPayload.availableQuantity =
    //       inventory?.availableQuantity + Number(product?.quantity);
    //     inventoryPayload.holdQuantity =
    //       inventory?.holdQuantity - Number(product?.quantity);
    //   } else if (order?.status == 'DeliveredPending') {
    //     inventoryPayload.availableQuantity =
    //       inventory?.availableQuantity + Number(product?.quantity);
    //     inventoryPayload.holdQuantity =
    //       inventory?.holdQuantity - Number(product?.quantity);
    //   } else if (order?.status == 'Delivered') {
    //     // no need to calculation, order delivered and money is also received
    //   } else if (order?.status == 'Cancelled') {
    //     // no need to calculation, order is cancelled
    //   } else if (order?.status == 'Hold') {
    //     inventoryPayload.availableQuantity =
    //       inventory?.availableQuantity + Number(product?.quantity);
    //     inventoryPayload.holdQuantity =
    //       inventory?.holdQuantity - Number(product?.quantity);
    //   } else if (order?.status == 'InReview') {
    //     inventoryPayload.availableQuantity =
    //       inventory?.availableQuantity + Number(product?.quantity);
    //     inventoryPayload.holdQuantity =
    //       inventory?.holdQuantity - Number(product?.quantity);
    //   }
    //   await this.inventoryRepository.inventoryOrderPlace(
    //     inventoryRef,
    //     inventoryPayload,
    //     tx
    //   );
    // }
    // const deletedOrder = await this.repository.deleteById(id, tx);
    // return deletedOrder;
  }
}

const prisma = new PrismaClient();
export default new OrderService(orderRepository, cartRepository, inventoryRepository, prisma, );
