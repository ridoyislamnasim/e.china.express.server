// BlogRepository (TypeScript version)
import prisma from '../../config/prismadatabase';
import { pagination } from '../../utils/pagination';

export class BlogRepository {
  async createBlog(payload: any, tx?: any) {
    console.log('Creating blog with payload:', payload);
    return await prisma.blog.create({ data: payload });
  }

  async getAllBlog() {
    return await prisma.blog.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async getNavBar() {
    return await prisma.blog.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBlogBySlug(slug: string) {
    return await prisma.blog.findFirst({
      where: { slug },
    });
  }

  async updateBlog(slug: string, payload: any) {
    return await prisma.blog.update({
      where: { slug: slug },
      data: payload,
    });
  }

  async deleteBlog(slug: string) {
    return await prisma.blog.delete({
      where: { slug },
    });
  }

  async getBlogWithPagination(payload: any) {
    return await pagination(payload, async (limit: number, offset: number, sortOrder: any) => {
      const [doc, totalDoc] = await Promise.all([
        prisma.blog.findMany({
          skip: offset,
          take: limit,
          orderBy: sortOrder,
        }),
        prisma.blog.count(),
      ]);
      return { doc, totalDoc };
    });
  }
}

const blogRepository = new BlogRepository();
export default blogRepository;
