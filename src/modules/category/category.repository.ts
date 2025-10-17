// CategoryRepository (TypeScript version)
import prisma from '../../config/prismadatabase';
import { pagination } from '../../utils/pagination';

export class CategoryRepository {
  async createCategory(payload: any, tx?: any) {
    return await prisma.category.create({ data: payload });
  }

  async getAllCategory() {
    return await prisma.category.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async getNavBar() {
    return await prisma.category.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        subCategories: {
          include: {
            childCategories: {
              include: {
                subChildCategories: true,
              },
            },
          },
        },
      },
    });
  }

  async getCategoryById(categorySlug: string) {
    return await prisma.category.findUnique({
      where: { slug: categorySlug},
      include: {
        subCategories: true,
      },
    });
  }

  async getCategoryBySlug(slug: string) {
    return await prisma.category.findFirst({
      where: { slug },
      include: {
        subCategories: true,
      },
    });
  }

  async updateCategory(slug: string, payload: any) {
    return await prisma.category.update({
      where: { slug: slug},
      data: payload,
    });
  }

  async deleteCategory(slug: string) {
    return await prisma.category.delete({
      where: { slug },
    });
  }

  async getCategoryWithPagination(payload: any) {
    return await pagination(payload, async (limit: number, offset: number, sortOrder: any) => {
      const [doc, totalDoc] = await Promise.all([
        prisma.category.findMany({
          skip: offset,
          take: limit,
          // orderBy: sortOrder,
        }),
        prisma.category.count(),
      ]);
      return { doc, totalDoc };
    });
  }
}

const categoryRepository = new CategoryRepository();
export default categoryRepository;
