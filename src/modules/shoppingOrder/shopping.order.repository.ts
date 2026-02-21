import { PrismaClient } from '@prisma/client';
import { pagination } from '../../utils/pagination';


interface ProductData {
    productRef: string;
    inventoryRef: string;
    quantity: number;
    price: number;
    mrpPrice?: number;
}

interface OrderProduct {
    id: string;
    productRefId: string;
    inventoryRefId: string;
    quantity: number;
    price: number;
    mrpPrice?: number;
}
class OrderRepository {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async createShoppingOrder(orderData: any, tx: any) {
        return await tx.shoppingOrder.create({
            data: orderData,
        });
    }
    

    //   delete


}

export default new OrderRepository(new PrismaClient());
