import { PrismaClient } from '@prisma/client';
import { pagination } from '../../utils/pagination';
import { BookingProduct, BookingProductVariant, ProductShippingData } from '../../types/shoppingOrder.type';


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



    // -------------------------
    async getShoppingOrderWithPagination(payload: any) {
        const { userId, limit, offset } = payload;
        // pagination logic
        return await pagination(payload, async (limit: number, offset: number, sortOrder: string) => {
            const [doc, totalDoc] = await Promise.all([
                this.prisma.shoppingBooking.findMany({
                    where: { customerId: userId },
                    skip: offset,
                    take: limit,
                    orderBy: {
                        createdAt: sortOrder as 'asc' | 'desc',
                    },
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
                }),
                this.prisma.shoppingBooking.count({
                    where: { customerId: userId },
                }),
            ]);
            return { doc, totalDoc };
        });

    }

    async getAllShoppingOrdersWithPaginationForAdmin(payload: any) {
        // pagination logic
        return await pagination(payload, async (limit: number, offset: number, sortOrder: string) => {
            const [doc, totalDoc] = await Promise.all([
                this.prisma.shoppingBooking.findMany({
                    skip: offset,
                    take: limit,
                    orderBy: {
                        createdAt: sortOrder as 'asc' | 'desc',
                    },
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
                }),
                this.prisma.shoppingBooking.count(),
            ]);
            return { doc, totalDoc };
        });
    }


}

export default new shoppingOrderRepository(new PrismaClient());
