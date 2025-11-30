import prisma from '../../config/prismadatabase';
import { pagination } from '../../utils/pagination';

export class ProductRepository {
  // async getSingleProduct(slug: string) {
  //   return await prisma.product.findFirst({
  //     where: { slug },
  //     include: {
  //       categoryRef: true,
  //       subCategoryRef: true,
  //       childCategoryRef: true,
  //       subChildCategoryRef: true,
  //       brandRef: true,
  //       // inventories: true,
  //     },
  //   });
  // }
  // async createProduct(payload: any) {
  //   console.log("inverory payload in crete ", payload);
  //   return await prisma.product.create({ data: payload });
  // }

  // async getAllProduct() {
  //   return await prisma.product.findMany({
  //     orderBy: { createdAt: 'desc' },
  //     include: {
  //       categoryRef: true,
  //       subCategoryRef: true,
  //       childCategoryRef: true,
  //       subChildCategoryRef: true,
  //       brandRef: true,
  //       // inventories: true,
  //     },
  //   });
  // }

  // async deleteProduct(slug: string) {
  //   return await prisma.product.delete({
  //     where: { slug },
  //   });
  // }

  // async updateProduct(slug: string, payload: any) {
  //   return await prisma.product.update({ where: { slug }, data: payload });
  // }

  // async getProductWithPagination(payload: any) {
  //   console.log("getProductWithPagination payload", payload);
  //   // You will need to convert all MongoDB filter logic to Prisma style here
  //   // This is a simplified version, you can expand as needed
  //   const {
  //     sortBy = 'createdAt',
  //     minPrice,
  //     maxPrice,
  //     categoryId,
  //     subCategoryId,
  //     childCategoryId,
  //     subChildCategoryId,
  //     brandId,
  //     isNewArrival,
  //     color,
  //     level,
  //     popular,
  //     bestSell,
  //     featured,
  //     gender,
  //   } = payload;

  //   // Build AND array for all filters
  //   const and: any[] = [];
  //   if (minPrice && maxPrice) {
  //     and.push({
  //       inventories: {
  //         some: {
  //           price: { gte: parseFloat(minPrice), lte: parseFloat(maxPrice) },
  //         },
  //       },
  //     });
  //   }
  //   if (categoryId) {
  //     if (Array.isArray(categoryId)) {
  //       and.push({ categoryRefId: { in: categoryId.map(Number) } });
  //     } else {
  //       and.push({ categoryRefId: Number(categoryId) });
  //     }
  //   }
  //   if (subCategoryId) {
  //     if (Array.isArray(subCategoryId)) {
  //       and.push({ subCategoryRefId: { in: subCategoryId.map(Number) } });
  //     } else {
  //       and.push({ subCategoryRefId: Number(subCategoryId) });
  //     }
  //   }
  //   if (childCategoryId) {
  //     if (Array.isArray(childCategoryId)) {
  //       and.push({ childCategoryRefId: { in: childCategoryId.map(Number) } });
  //     } else {
  //       and.push({ childCategoryRefId: Number(childCategoryId) });
  //     }
  //   }
  //   if (subChildCategoryId) {
  //     if (Array.isArray(subChildCategoryId)) {
  //       and.push({ subChildCategoryRefId: { in: subChildCategoryId.map(Number) } });
  //     } else {
  //       and.push({ subChildCategoryRefId: Number(subChildCategoryId) });
  //     }
  //   }
  //   if (color) {
  //     if (Array.isArray(color)) {
  //       and.push({
  //         inventories: {
  //           some: {
  //             OR: color.map((clr: string) => ({
  //               name: { equals: clr, mode: 'insensitive' }
  //             }))
  //           }
  //         }
  //       });
  //     } else {
  //       and.push({
  //         inventories: {
  //           some: {
  //             name: { equals: color, mode: 'insensitive' }
  //           }
  //         }
  //       });
  //     }
  //   }
  //   if (level) {
  //     if (Array.isArray(level)) {
  //       and.push({
  //         inventories: {
  //           some: {
  //             OR: level.map((lvl: string) => ({
  //               level: { equals: lvl, mode: 'insensitive' }
  //             }))
  //           }
  //         }
  //       });
  //     } else {
  //       and.push({
  //         inventories: {
  //           some: {
  //             level: { equals: level, mode: 'insensitive' }
  //           }
  //         }
  //       });
  //     }
  //   }
  //   if (brandId) and.push({ brandRef: Number(brandId) });
  //   if (gender) and.push({ gender });
  //   and.push({ publishStatus: "Publish" });
  //   const where: any = and.length > 0 ? { AND: and } : {};
  //   // Add more filters as needed

  //   // Sorting
  //   const orderBy: any = {};
  //   orderBy[sortBy] = 'desc';

  //   console.log("where", where)
  //   // Pagination
  //   return await pagination(payload, async (limit: number, offset: number) => {
  //     const [doc, totalDoc] = await Promise.all([
  //       prisma.product.findMany({
  //         where,
  //         orderBy,
  //         skip: offset,
  //         take: limit,
  //         include: {
  //           categoryRef: true,
  //           subCategoryRef: true,
  //           childCategoryRef: true,
  //           subChildCategoryRef: true,
  //           brandRef: true,
  //           // inventories: true,
  //         },
  //       }),
  //       prisma.product.count({ where }),
  //     ]);
  //     return { doc, totalDoc };
  //   });
  // }

  // async getProductWithPaginationForAdmin(payload: any) {
  //   return await pagination(payload, async (limit: number, offset: number) => {
  //     const [doc, totalDoc] = await Promise.all([
  //       prisma.product.findMany({
  //         orderBy: { createdAt: 'desc' },
  //         skip: offset,
  //         take: limit,
  //         include: {
  //           // inventories: true,
  //           categoryRef: true,
  //           subCategoryRef: true,
  //           childCategoryRef: true,
  //           subChildCategoryRef: true,
  //           brandRef: true,
  //         },
  //       }),
  //       prisma.product.count(),
  //     ]);
  //     return { doc, totalDoc };
  //   });
  // }

//   async getProductViewCount(payload: any) {
//     const { slug } = payload;
// return await prisma.product.update({
//   where: { slug },
//   data: {
//     viewProduct: {
//       increment: 1, // প্রতি কল এ এক করে বাড়বে
//     },
//   },
// });
//   }

  // async getNewArrivalsProductWithPagination(payload: any) {
  //   // Date-wise get product New Arrivals
  //   const { page = 1, limit = 10 } = payload;
  //   const offset = (page - 1) * limit; // Ensure offset is an integer
  //   console.log("payload", payload);
  //   console.log("offset", offset, "limit", limit);

  //   return await prisma.product.findMany({
  //     where: { publishStatus: "Publish" },
  //     orderBy: { createdAt: 'desc' }, // Latest first
  //     skip: offset, // Pass offset as skip
  //     take: limit, // Add take to limit the number of results
  //     include: {
  //       // inventories: true,
  //       categoryRef: true,
  //       subCategoryRef: true,
  //       childCategoryRef: true,
  //       subChildCategoryRef: true,
  //       brandRef: true,
  //     },
  //   });
  // }

  // async getTrendingProductsWithPagination(payload: any) {
  //   const {  limit = 10 } = payload;

  //   return await prisma.product.findMany({
  //     where: { publishStatus: "Publish" },
  //     orderBy: { viewProduct: 'desc' }, // Most viewed first
  //     take: Number(limit),
  //     include: {
  //       // inventories: true,
  //       categoryRef: true,
  //       subCategoryRef: true,
  //       childCategoryRef: true,
  //       subChildCategoryRef: true,
  //       brandRef: true,
  //     },
  //   });
  // }

  // async getComingSoonProductWithPagination(payload: any) {
  //   // those product publishStatus  "ComingSoon" only this product need
  //   const { page = 1, limit = 10 } = payload;
  //   const offset = (page - 1) * limit; // Ensure offset is an integer

  //   const DataTransfer = await prisma.product.findMany({
  //     where: { publishStatus: "ComingSoon" },
  //     skip: offset,
  //     take: limit,
  //     include: {
  //       // inventories: true,
  //       categoryRef: true,
  //       subCategoryRef: true,
  //       childCategoryRef: true,
  //       subChildCategoryRef: true,
  //       brandRef: true,
  //     },
  //   });
  //   console.log("transfer data", DataTransfer)
  //   return DataTransfer;
  // }

  //   async getAllProductForHomePage(payload: any) {
  //     const { limit = 10, subCategoryRef } = payload;
  //     return await prisma.product.findMany({
  //       where: { subCategoryRef: subCategoryRef ? Number(subCategoryRef) : undefined },
  //       take: limit,
  //       orderBy: { createdAt: 'desc' },
  //     });
  //   }

  // async getRelatedProduct(payload: any) {
  //   const { slug } = payload;
  //   // First, find the current product to get its categoryRef
  //   const currentProduct = await prisma.product.findUnique({
  //     where: { slug },
  //     select: { categoryRef: true },
  //   });

  //   if (!currentProduct || !currentProduct.categoryRef) {
  //     return [];
  //   }

  //   // find related products in the same category, excluding the current product
  //   return await prisma.product.findMany({
  //     where: {
  //       categoryRef: currentProduct.categoryRef,
  //       NOT: { slug },
  //       publishStatus: "Publish",
  //     },
  //     orderBy: { createdAt: 'desc' },
  //     take: 10,
  //     include: {
  //       // inventories: true,
  //       categoryRef: true,
  //       subCategoryRef: true,
  //       childCategoryRef: true,
  //       subChildCategoryRef: true,
  //       brandRef: true,
  //     },
  //   });
  // }

  // async getShopOption() {
  //   // all category and this category under e subcategory , all unique color , all unique level and other
  //   const categories = await prisma.category.findMany({
  //     select: {
  //       id: true,
  //       slug: true,
  //       name: true,
  //       subCategories: {
  //         select: {
  //           id: true,
  //           slug: true,
  //           name: true,
  //         },
  //       },
  //     },
  //   });

  //   // Get unique colors and levels from inventories
  //   // const colors = await prisma.inventory.findMany({
  //   //   select: {
  //   //     color: true,
  //   //     name: true,
  //   //   },
  //   //   distinct: ['color','name'],
  //   // });

  //   // const levels = await prisma.inventory.findMany({
  //   //   select: {
  //   //     level: true,
  //   //   },
  //   //   distinct: ['level'],
  //   // });

  //   // Get min and max price from inventory
  //   const priceAgg = await prisma.inventory.aggregate({
  //     _min: { price: true },
  //     _max: { price: true },
  //   });

  //   return {
  //     categories,
  //     colors,
  //     levels,
  //     minPrice: priceAgg._min.price,
  //     maxPrice: priceAgg._max.price,
  //   };
  // }

  //   async getSearchProduct(payload: any) {
  //     const { search } = payload;
  //     if (!search || search.trim() === '') return [];
  //     return await prisma.product.findMany({
  //       where: {
  //         OR: [
  //           { name: { contains: search, mode: 'insensitive' } },
  //           { description: { contains: search, mode: 'insensitive' } },
  //         ],
  //       },
  //       orderBy: { createdAt: 'desc' },
  //     });
  //   }

  // async getAllBestSellProduct(payload: any) {
  //   const { limit = 10 } = payload;
  //   const uniqueProducts = await prisma.orderProduct.findMany({
  //     distinct: ["productRefId"], // শুধু ইউনিক productRefId নেবে
  //     select: {
  //       productRefId: true, // শুধু আইডি নিলে
  //     },
  //   });
  //   console.log("Unique Products:", uniqueProducts);
  //   const topProducts = await prisma.orderProduct.groupBy({
  //     by: ["productRefId"], // group by productRefId
  //     _count: {
  //       productRefId: true, // কয়বার এসেছে সেটা গণনা করবে
  //     },
  //     orderBy: {
  //       _count: {
  //         productRefId: "desc", // বেশি count যেটার, সেটা উপরে আসবে
  //       },
  //     },
  //   });
  //   console.log("topProducts Products:", topProducts);

  //   // সব id একসাথে নিই
  //   const productIds = topProducts.map((p) => Number(p.productRefId));

  //   // একবারেই query
  //   const products = await prisma.product.findMany({
  //     where: { id: { in: productIds } },
  //     take: Number(limit), // limit ব্যবহার করে
  //     include: {
  //       // inventories: true,
  //       categoryRef: true,
  //       subCategoryRef: true,
  //       childCategoryRef: true,
  //       subChildCategoryRef: true,
  //       brandRef: true,
  //     },
  //   });
  //   return products;
  // }

  // async getAllDiscountedProduct(payload: any) {
  //   const { limit = 8 } = payload;
  //   return await prisma.product.findMany({
  //     where: {
  //       publishStatus: "Publish",
  //     },
  //     take: Number(limit),
  //     include: {
  //       inventories: {
  //         orderBy: {
  //           discountAmount: "desc", // বা "asc"
  //         },
  //       },
  //     },
  //   });

  // }
}

const productRepository = new ProductRepository();
export default productRepository;
