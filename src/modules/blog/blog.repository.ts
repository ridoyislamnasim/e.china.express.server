// BlogRepository (TypeScript version)
import prisma from "../../config/prismadatabase";
import { BlogI, CreateBlogTagRequestDto, UpdateBlogRequestDto, UpdateBlogTagRequestDto } from "../../types/blog";
import { pagination } from "../../utils/pagination";

export class BlogRepository {
  async createBlog(payload: any, tx?: any) {
    return await prisma.blog.create({ data: payload });
  }

  async createBlogTag(payload: CreateBlogTagRequestDto): Promise<any> {
    return await prisma.blogTag.create({ data: payload });
  }

  async findSlug(slug: string) {
    const result = await prisma.blog.findFirst({
      where: {
        slug: slug,
      },
    });
    return result;
  }

  // Get all tags (with optional pagination)
  async findAllBlogs(offset = 0, limit = 10) {
    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.blog.count(),
    ]);

    return { blogs, total };
  }

  async findAllBlogTags(offset = 0, limit = 10) {
    const [blogTags, total] = await Promise.all([
      prisma.blogTag.findMany({
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.blogTag.count(),
    ]);

    return { blogTags, total };
  }

  async findBlogSlugTag(slug: string) {
    const result = await prisma.blogTag.findFirst({
      where: {
        slug: slug,
      },
    });
    return result;
  }

  async getAllBlog() {
    return await prisma.blog.findMany({ orderBy: { createdAt: "desc" } });
  }

  async getNavBar() {
    return await prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async getBlogBySlug(slug: string) {
    return await prisma.blog.findFirst({
      where: { slug },
    });
  }

  async updateBlog(slug: string, payload: UpdateBlogRequestDto) {
    return await prisma.blog.update({
      where: { slug: slug },
      data: payload,
    });
  }

  async deleteBlogById(id: number) {
    return await prisma.blog.delete({
      where: { id },
    });
  }

  async deleteBlogTagById(id: number) {
    return await prisma.blogTag.delete({
      where: { id },
    });
  }

  async updateBlogTag(id: number, payload: UpdateBlogTagRequestDto): Promise<any> {
    return await prisma.blogTag.update({
      where: { id: id },
      data: payload,
    });
  }

  async findBlogTagBySlug(slug: string) {
    return prisma.blogTag.findFirst({ where: { slug } });
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
