// Category1688Repository (TypeScript version)
import prisma from '../../config/prismadatabase';
import { pagination } from '../../utils/pagination';




export class Category1688Repository {
  async createCategory1688(payload: any, tx?: any) {
    return await prisma.category1688.create({ data: payload });
  }

  

  async getAllCategory1688() {
    // return await prisma.category1688.findMany();
    const categories = await prisma.category1688.findMany({
  orderBy: { level: "asc" }
});
   return this.buildCategoryTree(categories);
  }


  // Helper: Build parent-child nested tree
  private buildCategoryTree(categories: any[]) {
    const map: Record<number, any> = {};
    const roots: any[] = [];

    // Prepare map
    categories.forEach(cat => {
      map[cat.categoryId] = { ...cat, children: [] };
    });

    // Connect parent-child
    categories.forEach(cat => {
      if (cat.parentCateId && map[cat.parentCateId]) {
        map[cat.parentCateId].children.push(map[cat.categoryId]);
      } else {
        roots.push(map[cat.categoryId]); // top-level category
      }
    });

    return roots;
  }

  async getNavBar() {
    // return await prisma.category1688.findMany({
    //   orderBy: { createdAt: 'desc' },
    //   include: {
    //     subCategories: {
    //       include: {
    //         childCategories: {
    //           include: {
    //             subChildCategories: true,
    //           },
    //         },
    //       },
    //     },
    //   },
    // });
  }

  async getCategory1688ById(category1688Slug: string) {
    // return await prisma.category1688.findUnique({
    //   where: { slug: category1688Slug},
    //   include: {
    //     subCategories: true,
    //   },
    // });
  }
  
  async getCategory1688ByCategoryId(categoryId: number) {
    return await prisma.category1688.findUnique({
      where: { categoryId },
    });
  }

  async getCategory1688BySlug(slug: string) {
    // return await prisma.category1688.findFirst({
    //   where: { slug },
    //   include: {
    //     subCategories: true,
    //   },
    // });
  }

  async updateCategory1688(slug: string, payload: any) {
    // return await prisma.category1688.update({
    //   where: { slug: slug},
    //   data: payload,
    // });
   
  }

  async createOrUpdateCategory1688From1688Data(  result: any) {
    const { categoryId, translatedName, leaf, level, parentCateId } = result;
       const finalParentId = (!parentCateId || Number(parentCateId) === 0)
    ? null
    : Number(parentCateId);
    return await prisma.category1688.upsert({
      where: { categoryId },
      update: {
        translatedName,
        leaf,
        level: Number(level),
        parentCateId: finalParentId,
      },
      create: {
        categoryId,
        translatedName,
        leaf,
        level: Number(level),
        parentCateId: finalParentId,
      },
    });
  }

  async deleteCategory1688(slug: string) {
    // return await prisma.category1688.delete();
  }

  async getCategory1688WithPagination(payload: any) {
    return await pagination(payload, async (limit: number, offset: number, sortOrder: any) => {
      const [doc, totalDoc] = await Promise.all([
        prisma.category1688.findMany({
          skip: offset,
          take: limit,
          // orderBy: sortOrder,
        }),
        prisma.category1688.count(),
      ]);
      return { doc, totalDoc };
    });
  }
}

const category1688Repository = new Category1688Repository();
export default category1688Repository;
