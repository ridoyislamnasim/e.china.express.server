// Category1688Repository (TypeScript version)
import prisma from '../../config/prismadatabase';
import { Prisma } from '@prisma/client';
import { pagination } from '../../utils/pagination';




export class Category1688Repository {
  async createCategory1688(payload: any, tx?: any) {
    return await prisma.category1688.create({ data: payload });
  }

  

  async getAllCategory1688() {
    // return await prisma.category1688.findMany();
    const categories = await prisma.category1688.findMany({
      orderBy: [{ level: "asc" }, { translatedName: "asc" }]
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

  async getCategoryIdBySubcategory(categoryId: number): Promise<any> {
    return await prisma.category1688.findMany({
      where: { parentCateId: categoryId },
    });
  }

  async getCategoryById(categoryId: number): Promise<any> {
    return await prisma.category1688.findUnique({
      where: { categoryId },
    });
  }
  async updateCategoryRateFlagToggle(categoryId: number, isRateCategory: boolean): Promise<any> {
    console.log('Updating categoryId:', categoryId, 'to isRateCategory:', isRateCategory);
    return await prisma.category1688.update({
      where: { categoryId },
      data: { isRateCategory: Boolean(isRateCategory) } as unknown as Prisma.Category1688UpdateInput,
    });
  }

  async getCategoriesForRateCalculation(): Promise<any> {
  //  find lavel 1 categories than this catgeory make tree  isRateCategory is true
  // level: 1 or isRateCategory: true
    const categories = await prisma.category1688.findMany({
      where: {
        OR: [
          { level: 1 },
          { isRateCategory: true }
        ]
      },
      // Order first by level (so top-level categories come first), then
      // alphabetically by translatedName so lists appear in human-friendly order.
      orderBy: [{ level: "asc" }, { translatedName: "asc" }]
    });
   return this.buildCategoryTree(categories);
  }


}

const category1688Repository = new Category1688Repository();
export default category1688Repository;
