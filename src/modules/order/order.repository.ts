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

    async getAllOrder() {
        return await this.prisma.order.findMany({
            include: {
                userRef: true,
                couponRef: true,
                // orderProducts: {
                //     include: {
                //         productRef: true,
                //         inventoryRef: true,
                //     },
                // },
                products: { // Include the related OrderProduct entries
                    include: {
                        productRef: true, // Optionally include related Product details
                        inventoryRef: true, // Optionally include related Inventory details
                    },
                },
            },
        });
    }

    async getOrderProducts() {
        return await this.prisma.orderProduct.findMany({
            include: {
                productRef: true,
                inventoryRef: true,
            },
        });
    }

    // payload.userRef =   { connect: { id: Number(payload.userRef) } };
    async createOrder(payload: any, tx?: any) {
        const {
            orderId,
            shippingCost,
            coupon,
            userRef,
            customerName,
            customerPhone,
            customerEmail,
            customerCity,
            customerAddress,
            customerHouse,
            customerRoad,
            customerThana,
            customerAltPhone,
            paymentMethod,
            note,
        } = payload;

        const prismaClient = tx || this.prisma;

        // Determine query based on userRef
        // const isObjectId = /^[a-f\d]{24}$/i.test(userRef);
        // if (!isObjectId) {
        //     query.correlationId = userRef;
        // } else {
        //     query.userRef = userRef;
        // }
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(userRef);
        const query: any = {};
        if (isUUID) {
            query.correlationId = userRef;
        } else {
            query.userRef = { id: Number(userRef) };
        }

        // Fetch cart items
        const carts = await prismaClient.cart.findMany({
            where: query,
            include: {
                productRef: true,
                inventoryRef: true,
            },
        });
        console.log("ALL CART FOR USER", carts.length)
        if (carts.length === 0) {
            throw new Error("Cart is empty, cannot place order.");
        }

        // Validate coupon
        let appliedCoupon = null;
        if (coupon) {
            const now = new Date();
            const exitCoupon = await prismaClient.coupon.findFirst({
                where: {
                    code: coupon,
                    startDate: { lte: now },
                    expireDate: { gte: now },
                    useLimit: { gte: { used: true } },
                },
            });

            if (exitCoupon) {
                appliedCoupon = exitCoupon;
            }
        }

        // Calculate totals
        let subTotalPrice = 0;
        let totalPrice = 0;
        let totalSaved = 0;
        let totalCouponDiscount = 0;
        let productDiscount = 0;

        const products = carts.map((cart: { productRef: any; inventoryRef: any; quantity: number; }) => {
            const { productRef, inventoryRef, quantity } = cart;
            const price = inventoryRef?.price || 0;
            const discountAmount = inventoryRef?.discountAmount || 0;

            let couponDiscount = 0;
            if (appliedCoupon) {
                if (
                    String(appliedCoupon.categoryRef) === String(productRef.categoryRef) ||
                    String(appliedCoupon.subCategoryRef) === String(productRef.subCategoryRef) ||
                    String(appliedCoupon.childCategoryRef) === String(productRef.childCategoryRef)
                ) {
                    const discount = appliedCoupon.discount;
                    couponDiscount =
                        appliedCoupon.discountType === "percent"
                            ? (price * discount) / 100
                            : discount;
                    couponDiscount *= quantity;
                }
            }

            const subtotal = price * quantity;
            const savedAmount = discountAmount * quantity + couponDiscount;
            subTotalPrice += subtotal + savedAmount;
            totalPrice += subtotal - couponDiscount;
            productDiscount += discountAmount * quantity;
            totalCouponDiscount += couponDiscount;
            totalSaved += savedAmount;

            return {
                productRef: productRef.id,
                inventoryRef: inventoryRef.id,
                quantity,
                price,
                mrpPrice: inventoryRef?.mrpPrice,
            };
        });
        console.log("Products to be ordered:", products);

        const newOrderPlayload = {
            orderId,
            subTotalPrice,
            totalPrice,
            couponDiscount: totalCouponDiscount,
            shippingCost,
            status: "OrderPlaced",
            // ...query,

            customerName,
            customerPhone,
            customerEmail,
            customerCity,
            customerAddress,
            customerHouse,
            customerRoad,
            customerThana,
            customerAltPhone,
            paymentMethod,
            note,
        };
        payload.userRef = { connect: { id: Number(payload.userRef) } };
        if (coupon) {
            payload.couponRef = { connect: { id: Number(coupon.id) } };
        }
        console.log("New Order Payload:", newOrderPlayload);
        // Create order first
        const newOrder = await prismaClient.order.create({
            data: newOrderPlayload
        });
        console.log("New Order Created:", newOrder);
        // Create OrderProduct entries with the created order ID
        const orderProducts = await Promise.all(
            products.map(async (product: ProductData): Promise<OrderProduct> => {
                return await prismaClient.orderProduct.create({
                    data: {
                        orderId: newOrder.id, // Use the created order ID
                        productRefId: product.productRef,
                        inventoryRefId: product.inventoryRef,
                        quantity: product.quantity,
                        price: product.price,
                        mrpPrice: product.mrpPrice,
                    },
                });
            })
        );
        console.log(" order product", orderProducts)
        // Clear cart
        await prismaClient.cart.deleteMany({ where: query });

        // Update inventory
        for (const product of products) {
            await prismaClient.inventory.update({
                where: { id: product.inventoryRef },
                data: { quantity: { decrement: product.quantity } },
            });
        }

        return newOrder;
    }

    async updateOrder(id: number, payload: any) {
        const updatedOrder = await this.prisma.order.update({
            where: { id },
            data: payload,
        });
        if (!updatedOrder) {
            throw new Error('Order not found');
        }
        return updatedOrder;
    }

    async getOrderWithPagination(payload: any) {
        return await pagination(payload, async (limit: number, offset: number) => {
            const [doc, totalDoc] = await Promise.all([
                this.prisma.order.findMany({
                    orderBy: { createdAt: 'desc' },
                    skip: offset,
                    take: limit,
                    include: {
                        userRef: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                phone: true,
                                // add other fields you want to include
                                password: false,
                            },
                        },
                        products: {
                            include: {
                                productRef: true,
                                inventoryRef: true,
                            },
                        },
                        // couponRef: true,
                    },
                }),
                this.prisma.order.count(),
            ]);
            return { doc, totalDoc };
        });
    }


        async getIncompleteOrderWithPagination(payload: any) {
        // Group carts by userRef and return paginated grouped data for all users
        return await pagination(payload, async (limit: number, offset: number) => {
            // Get all unique userRefIds with carts
            // Group by userRefId (not null)
            const userGroups = await this.prisma.cart.groupBy({
                by: ['userRefId'],
            });
            // Group by correlationId (where userRefId is null)
            const correlationGroups = await this.prisma.cart.groupBy({
                by: ['correlationId'],
                where: { userRefId: null },
            });
            const totalDoc = userGroups.length + correlationGroups.length;

            // Paginate both groups together
            const allGroups = [
                ...userGroups.map(g => ({ type: 'user', id: g.userRefId })),
                ...correlationGroups.map(g => ({ type: 'correlation', id: g.correlationId })),
            ];
            const pagedGroups = allGroups.slice(offset, offset + limit);

            // For each group, get info and carts
            const doc = await Promise.all(
                pagedGroups.map(async (group) => {
                    let info: any = null;
                    let carts: any[] = [];
                    if (group.type === 'user' && typeof group.id === 'number') {
                        info = await this.prisma.user.findUnique({
                            where: { id: group.id },
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                phone: true,
                                // add other fields as needed
                            },
                        });
                        carts = await this.prisma.cart.findMany({
                            where: { userRefId: group.id },
                            include: {
                                productRef: true,
                                inventoryRef: true,
                            },
                        });
                    } else if (group.type === 'correlation' && group.id) {
                        info = { correlationId: group.id };
                        const correlationIdStr = typeof group.id === 'string' ? group.id : String(group.id);
                        carts = await this.prisma.cart.findMany({
                            where: { correlationId: correlationIdStr },
                            include: {
                                productRef: true,
                                inventoryRef: true,
                            },
                        });
                    }
                    return { info, carts };
                })
            );
            return { doc, totalDoc };
        });
    }

    async updateOrderStatus(id: number, status: string) {
        const updatedOrder = await this.prisma.order.update({
            where: { id },
            data: { status },
        });
        if (!updatedOrder) {
            throw new Error('Order not found');
        }
        return updatedOrder;
    }

    async getOrderReport(startDate: Date, endDate: Date) {
        // Implement logic for generating order reports using Prisma
        return null;
    }

    async getProfitLossReport(startDate: Date, endDate: Date, warehouseRef: string) {
        // Implement logic for generating profit/loss reports using Prisma
        return null;
    }

    async getSingleOrder(id: string) {
        return await this.prisma.order.findUnique({
            where: { id: Number(id) },
        });
    }

    async orderTracking(payload: any) {
        const { orderId } = payload;
        return await this.prisma.order.findUnique({
            where: { id: Number(orderId) },
        });
    }

    //   delete


}

export default new OrderRepository(new PrismaClient());
