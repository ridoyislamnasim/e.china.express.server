import { NotFoundError } from '../../utils/errors';
import { BaseService } from '../base/base.service';
import orderRepository from './shopping.order.repository';
import cartRepository from '../cart/cart.repository';
// import inventoryRepository from '../inventory/inventory.repository';
import { idGenerate } from '../../utils/IdGenerator';
import { PrismaClient } from '@prisma/client';

export class OrderService extends BaseService<any> {
  private repository: typeof orderRepository;
  private cartRepository: any;
  // private inventoryRepository: any;
  private prisma: PrismaClient;

  constructor(
    repository: typeof orderRepository,
    cartRepository: any,
    // inventoryRepository: any,
    prisma: PrismaClient,
  ) {
    super(repository);
    this.repository = repository;
    this.cartRepository = cartRepository;
    // this.inventoryRepository = inventoryRepository;
    this.prisma = prisma;
  }

  async createShoppingOrder(payload: any, tx: any) {
    console.log("Creating shopping order with payload:", payload, payload.products);
    const { userId, products, totalAmount, addressId } = payload;
    const userCheckoutCart = await this.cartRepository.findCheckoutCartByUser(userId, products, tx);
console.log("User checkout cart:", userCheckoutCart);
    if (!userCheckoutCart) {
      throw new NotFoundError('No checkout cart found for the user with the specified products');
    }
    // prefix: string, identifyer: string, model: any
    const orderNumber = idGenerate("ORD", "orderNumber", this.repository);
    const orderData = {
      // address reltin 
      orderNumber: orderNumber,
      mainStatus: "PENDING",
      bookingDate: new Date(),
      addressRef: {connect:{id: addressId}},
      customerRef: { connect: { id: userId } },
      totalAmount,
    };
    const order = await this.repository.createShoppingOrder(orderData, tx);
    for (const item of products) {
      // await this.repository.createOrderItem(
      //   {
      //     orderId,
      //     productId: item.productId,
      //     quantity: item.quantity,
      //     price: item.price,
      //   },
      //   tx,
      // );
      // await this.inventoryRepository.decreaseInventory(item.productId, item.quantity, tx);
    }
    await this.cartRepository.clearCart(userId, tx);
    return order;
  }

  
}

const prisma = new PrismaClient();
export default new OrderService(orderRepository, cartRepository, prisma, );
