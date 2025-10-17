import prisma from '../../config/prismadatabase';
import { pagination } from '../../utils/pagination';

export class SubCategoryRepository {
  async createSubCategory(payload: any, tx?: any) {
    return await prisma.subCategory.create({
      data: {
        ...payload,
        categoryRef: { connect: { id: Number(payload.categoryRef) } },
      },
    });
  }

  async getAllSubCategory() {
    return await prisma.subCategory.findMany({
        include: { categoryRef: true },
    });
  }

  async getSingleSubCategory(slug: string, includeRelations: any) {
    return await prisma.subCategory.findUnique({
      where: { slug },
      include: includeRelations,
    });
  }

  async updateSubCategory(slug: string, payload: any, tx?: any) {
    return await prisma.subCategory.update({
      where: { slug },
      data: {
        ...payload,
        categoryRef: { connect: { id: Number(payload.categoryRef) } },
      },
    });
  }

  async getSubCategoryWithPagination(payload: any) {
    return await pagination(payload, async (limit: number, offset: number, sortOrder: any) => {
      const [doc, totalDoc] = await Promise.all([
        prisma.subCategory.findMany({
          skip: offset,
          take: limit,
          orderBy: { createdAt: sortOrder === 1 ? 'asc' : 'desc' },
          include: { categoryRef: true },
        }),
        prisma.subCategory.count(),
      ]);
      return { doc, totalDoc };
    });
  }

    async deleteSubCategory(slug: string) {
    return await prisma.subCategory.delete({
        where: { slug },
    });
    }
}

const subCategoryRepository = new SubCategoryRepository();
export default subCategoryRepository;
