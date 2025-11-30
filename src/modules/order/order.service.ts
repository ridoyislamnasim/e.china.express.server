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

  
}

const prisma = new PrismaClient();
export default new OrderService(orderRepository, cartRepository, inventoryRepository, prisma, );
