"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const pagination_1 = require("../../utils/pagination");
const prisma = new client_1.PrismaClient();
class WishListRepository {
    async createWishList(payload) {
        const { userRef, productRef } = payload;
        const existingWishList = await prisma.wishlist.findFirst({
            where: {
                userRef: { id: Number(userRef) },
                productRef: { id: Number(productRef) },
            },
        });
        if (existingWishList) {
            // delete existing wishList
            await prisma.wishlist.delete({
                where: { id: existingWishList.id },
            });
            return;
        }
        return await prisma.wishlist.create({
            data: {
                userRef: { connect: { id: Number(userRef) } },
                productRef: { connect: { id: Number(productRef) } },
            },
        });
    }
    async getAllWishList(payload) {
        const userRef = Number(payload.userRef);
        const productRef = Number(payload.productRef);
        const query = {};
        if (userRef) {
            query.userRef = { id: userRef };
        }
        if (productRef) {
            query.productRef = { id: productRef };
        }
        return await prisma.wishlist.findMany({
            where: query,
            include: {
                userRef: true,
                productRef: true,
            }
        });
    }
    async getWishListWithPagination(payload) {
        try {
            const userRef = Number(payload.userRef);
            const wishLists = await (0, pagination_1.pagination)(payload, async (limit, offset, sortOrder) => {
                const query = userRef ? { userRef: { id: userRef } } : {};
                console.log('WishList query:', query);
                const wishLists = await prisma.wishlist.findMany({
                    where: query,
                    skip: offset,
                    take: limit,
                    orderBy: { createdAt: sortOrder },
                    include: {
                        userRef: true,
                        productRef: true,
                    },
                });
                const totalWishList = await prisma.wishlist.count();
                return { doc: wishLists, totalDoc: totalWishList };
            });
            return wishLists;
        }
        catch (error) {
            console.error('Error getting wishLists with pagination:', error);
            throw error;
        }
    }
    async getSingleWishList(id) {
        return await prisma.wishlist.findUnique({
            where: { id: Number(id) },
        });
    }
    async deleteWishList(id) {
        return await prisma.wishlist.delete({
            where: { id: Number(id) },
        });
    }
}
exports.default = new WishListRepository();
