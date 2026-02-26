import { PrismaClient } from '@prisma/client';
import { pagination } from '../../utils/pagination';
import { BookingProduct, BookingProductVariant, ProductShippingData, ShoppingOrder } from '../../types/shoppingOrder.type';
import { BookingDoc } from '../booking/booking.repository';


interface OrderProduct {
    id: string;
    productRefId: string;
    inventoryRefId: string;
    quantity: number;
    price: number;
    mrpPrice?: number;
}
class shoppingOrderRepository {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }
    // ---------------ceare -------------------
    async createShoppingOrder(orderData: any, tx: any) {
        const prismaClient: PrismaClient = tx || this.prisma;
        return await prismaClient.shoppingBooking.create({
            data: orderData,
        });
    }

    async createBookingProduct(bookingProductData: BookingProduct, tx: any) {
        const prismaClient: PrismaClient = tx || this.prisma;

        // Separate foreign key IDs from scalar data
        const { shoppingBookingId, customerId, productLocalId, vendorId, ...scalarData } = bookingProductData;

        // Build the data object with proper relation connections
        const data: any = { ...scalarData };

        // Add vendorId as scalar (no relation)
        if (vendorId != null) {
            data.vendorId = vendorId;
        }

        if (shoppingBookingId) {
            data.shoppingBooking = { connect: { id: shoppingBookingId } };
        }
        if (customerId) {
            data.customerRef = { connect: { id: customerId } };
        }
        if (productLocalId) {
            data.productLocal = { connect: { id: productLocalId } };
        }

        const createBookingProduct = await prismaClient.bookingProduct.create({
            data,
        });
        return createBookingProduct;
    }
    // Accept pre-built price range objects that already include bookingProductId
    async createBookingProductPriceRanges(priceRanges: Array<{ bookingProductId: number; startQuantity: number; price: number }>, tx: any) {
        const prismaClient: PrismaClient = tx || this.prisma;
        const createPriceRange = await prismaClient.bookingProductPriceRange.createMany({
            data: priceRanges,
        });
        return createPriceRange;
    }

    async createBookingProductVariants(variants: Array<BookingProductVariant>, tx: any) {
        const prismaClient: PrismaClient = tx || this.prisma;
        const createVariant = await prismaClient.bookingProductVariant.createMany({
            data: variants,
        });
        return createVariant;
    }

    async createProductShipping(productShippingData: ProductShippingData, tx: any) {
        const prismaClient: PrismaClient = tx || this.prisma;

        // Filter out null values and convert them to undefined for Prisma
        const cleanedData = Object.fromEntries(
            Object.entries(productShippingData).filter(([_, value]) => value !== null && value !== undefined)
        );

        // Add required updatedAt field
        const dataWithTimestamp = {
            ...cleanedData,
            updatedAt: new Date(),
        };

        const createProductShipping = await prismaClient.productShipping.create({
            data: dataWithTimestamp as any,
        });
        return createProductShipping;
    }

    async createPurchaseForShoppingOrderByAdmin(payload: any, tx: any) {
        const prismaClient: PrismaClient = tx || this.prisma;
        const createPurchase = await prismaClient.purchase.create({
            data: payload,
        });
        return createPurchase;
    }
    // -------------------------
    async connectPurchaseToBookingProducts(purchaseId: number, bookingProductIds: number[], tx: any) {
        const prismaClient: PrismaClient = tx || this.prisma;
        const updateResult = await prismaClient.bookingProduct.updateMany({
            where: {
                id: { in: bookingProductIds },
            },
            data: {
                purchaseId: purchaseId,
            },
        });
        console.log(`Connected purchase ${purchaseId} to booking products:`, updateResult); 
        return updateResult;
    }

    async getShoppingOrderWithPagination(payload: any) {
        const { userId, limit, offset } = payload;
        const filter: any = { customerId: userId };
        if (payload.status) {
            if (payload.status === "PENDING_REJECTED_AT_WAREHOUSE_APPROVE") {
                filter.mainStatus = { in: ["PENDING", "REJECTED_AT_WAREHOUSE", "APPROVE"] };
            } else if (payload.status === "MY_ORDERS") {
                filter.mainStatus = { notIn:["PENDING"] }; // Example: exclude rejected orders if needed
            } else {
                filter.mainStatus = payload.status.toUpperCase();
            }
        }
        console.log("Repository received payload for pagination:", payload, "Constructed filter:", filter);
        // pagination logic
        return await pagination(payload, async (limit: number, offset: number, sortOrder: string) => {
            const [doc, totalDoc] = await Promise.all([
                this.prisma.shoppingBooking.findMany({
                    where: filter,
                    skip: offset,
                    take: limit,
                    orderBy: {
                        createdAt: sortOrder as 'asc' | 'desc',
                    },
                    include: {
                        paymentAgentRef: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                phone: true,
                            }
                        },
                        bookingProduct: {
                            include: {
                                bookingProductVariants: true,
                                priceRanges: true,
                                productShipping: {
                                    include: {
                                        fromCountry: true,
                                        toCountry: true,
                                    }
                                },
                            },
                        },
                    },
                }),
                this.prisma.shoppingBooking.count({
                    where: filter,
                }),
            ]);
            return { doc, totalDoc };
        });

    }


    async getSingleShoppingOrder(id: number) {
        const order = await this.prisma.shoppingBooking.findUnique({
            where: { id },
            include: {
                bookingProduct: {
                    include: {
                        bookingProductVariants: true,
                        priceRanges: true,
                        productShipping: {
                            include: {
                                fromCountry: true,
                                toCountry: true,
                            }
                        },
                    },
                },
            },
        });
        return order;
    }


    async findByConditionAndUpdate(where: object, data: Partial<ShoppingOrder>, tx?: any) {
        const prismaClient: PrismaClient = tx || this.prisma;
        const updatedBooking = await prismaClient.shoppingBooking.updateMany({
            where,
            data,
        });
        return updatedBooking;
    }

    async getAllShoppingOrdersWithPaginationForAdmin(payload: any) {
        // pagination logic
        const { status } = payload;
        console.log("Repository received payload for admin pagination:", status, payload);
        const filter: any = {};
        if (status) {
            if (status === "PENDING_REJECTED_AT_WAREHOUSE_APPROVE") {
                filter.mainStatus = { in: ["PENDING", "REJECTED_AT_WAREHOUSE", "APPROVE"] };
            } else {
                filter.mainStatus = status.toUpperCase();
            }
        }

        return await pagination(payload, async (limit: number, offset: number, sortOrder: string) => {
            const [doc, totalDoc] = await Promise.all([
                this.prisma.shoppingBooking.findMany({
                    where: filter,
                    skip: offset,
                    take: limit,
                    orderBy: {
                        createdAt: sortOrder as 'asc' | 'desc',
                    },
                    include: {
                        customerRef: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                phone: true,
                            }
                        },
                        paymentAgentRef: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                phone: true,
                            }
                        },
                        bookingProduct: {
                            include: {
                                purchase: true,
                                bookingProductVariants: true,
                                priceRanges: true,
                                productShipping: {
                                    include: {
                                        fromCountry: true,
                                        toCountry: true,
                                    }
                                },
                            },
                        },

                    },
                }),
                this.prisma.shoppingBooking.count( { where: filter } ),
            ]);
            return { doc, totalDoc };
        });
    }

    async getAllShoppingOrderForAdminByFilterWithPagination(payload: any) {
        const { bookingStatus } = payload;
        const filter: any = {};
        if (bookingStatus == "PENDING_REJECTED_AT_WAREHOUSE_APPROVE") {
            filter.warehouseReceivingStatus = { in: ["PENDING", "REJECTED_AT_WAREHOUSE", "APPROVE"] };
        } else {
            filter.warehouseReceivingStatus = bookingStatus.toUpperCase();
        }

        return await pagination(payload, async (limit: number, offset: number, sortOrder: any) => {
            const [doc, totalDoc] = await Promise.all([
                this.prisma.shipmentBooking.findMany({
                    where: filter,
                    skip: offset,
                    take: limit,
                    orderBy: {
                        id: sortOrder,
                    },
                    include: {
                        supplierRef: true,
                        packageRef: true,
                        shippingMethodRef: true,
                        localDeliveryInfo: true,
                        categoryRef: true,
                        customerRef: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                phone: true,
                            }
                        },
                        rateRef: {
                            include: {
                                category1688: true,
                                shippingMethod: true,
                            },
                        },
                        importWarehouseRef: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        exportWarehouseRef: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        importCountryRef: {
                            select: {
                                id: true,
                                name: true,
                                isoCode: true,
                                zone: true,
                            },
                        },
                        exportCountryRef: {
                            select: {
                                id: true,
                                name: true,
                                isoCode: true,
                                zone: true,
                            },
                        },
                        // customer: true,
                    },
                }),
                this.prisma.shipmentBooking.count({ where: filter }), // total count with filter
            ]);
            return { doc, totalDoc };
        });
    }


}

export default new shoppingOrderRepository(new PrismaClient());
