// BlogRepository (TypeScript version)
import { BlogI, CreateBlogTagRequestDto, TopicI, UpdateBlogRequestDto, UpdateBlogTagRequestDto } from "../../types/blog";
import { pagination } from "../../utils/pagination";
import { Blog, PrismaClient } from '@prisma/client';
import { BaseRepository } from "../base/base.repository";

export class BlogRepository extends BaseRepository<Blog> {


    private prisma: PrismaClient;
  
    constructor(prisma: PrismaClient) {
          super(prisma.blog);
      this.prisma = prisma;
    }


  async createBlog(payload: any, tx?: any) {
    return await this.prisma.blog.create({ data: payload });
  }

  async createBlogTag(payload: CreateBlogTagRequestDto): Promise<any> {
    return await this.prisma.blogTag.create({ data: payload });
  }

  async findSlug(slug: string) {
    const result = await this.prisma.blog.findFirst({
      where: {
        slug: slug,
      },
    });
    return result;
  }

  // Get all tags (with optional pagination)
  async findAllBlogs(offset = 0, limit = 10) {
    const [blogs, total] = await Promise.all([
      this.prisma.blog.findMany({
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.blog.count(),
    ]);

    return { blogs, total };
  }

  async findAllBlogTags(offset = 0, limit = 10) {
    const [blogTags, totalResult] = await Promise.all([
      this.prisma.blogTag.findMany({
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.$queryRaw<{ count: number }[]>`SELECT COUNT(*)::int AS count FROM "BlogTag"`,
    ]);

    const total = totalResult[0]?.count ?? 0;

    return { blogTags, total };
  }

  async findBlogSlugTag(slug: string) {
    const result = await this.prisma.blogTag.findFirst({
      where: {
        slug: slug,
      },
    });
    return result;
  }

  async getAllBlog() {
    return await this.prisma.blog.findMany({ orderBy: { createdAt: "desc" } });
  }

  async getNavBar() {
    return await this.prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async getBlogBySlug(slug: string) {
    return await this.prisma.blog.findFirst({
      where: { slug },
    });
  }

  async updateBlog(slug: string, payload: UpdateBlogRequestDto) {
    return await this.prisma.blog.update({
      where: { slug: slug },
      data: payload,
    });
  }

  async deleteBlogById(id: number) {
    return await this.prisma.blog.delete({
      where: { id },
    });
  }

  async deleteBlogTagById(id: number) {
    return await this.prisma.blogTag.delete({
      where: { id },
    });
  }

  async updateBlogTag(id: number, payload: UpdateBlogTagRequestDto): Promise<any> {
    return await this.prisma.blogTag.update({
      where: { id: id },
      data: payload,
    });
  }

  async findBlogTagBySlug(slug: string) {
    return this.prisma.blogTag.findFirst({ where: { slug } });
  }

  async deleteBlog(slug: string) {
    return await this.prisma.blog.delete({
      where: { slug },
    });
  }

  async getBlogsByTags(tags: string[], tx?: any) {
    const client = tx || prisma;
    return client.blog.findMany({
      where: {
        tags: {
          hasSome: tags,
        },
        status: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getBlogWithPagination(payload: any) {
    return await pagination(payload, async (limit: number, offset: number, sortOrder: any) => {
      const [doc, totalDoc] = await Promise.all([
        this.prisma.blog.findMany({
          skip: offset,
          take: limit,
          orderBy: sortOrder,
        }),
        this.prisma.blog.count(),
      ]);
      return { doc, totalDoc };
    });
  }













//! ==============================
  // Create Topic
  // ==============================
  async createTopic(payload: TopicI, tx?: any) {
    const client = tx || prisma;
    return await client.topic.create({
      data: payload,
    });
  }

  // ==============================
  // Find Topic by ID
  // ==============================
  async findTopicById(id: number) {
    return await this.prisma.topic.findFirst({
      where: { id },
    });
  }

  // ==============================
  // Find Topic by Slug
  // ==============================
  async findTopicBySlug(slug: string) {
    return await this.prisma.topic.findFirst({
      where: { slug },
    });
  }

  // ==============================
  // Get All Topics (with pagination)
  // ==============================
  async getAllTopics() {
     
   return   this.prisma.topic.findMany({

        orderBy: { createdAt: "desc" },
      })
    

    }

  // ==============================
  // Update Topic
  // ==============================
  async updateTopic(id: number, payload: TopicI) {
    return await this.prisma.topic.update({
      where: { id },
      data: payload,
    });
  }

  // ==============================
  // Delete Topic
  // ==============================
  async deleteTopicById(id: number) {
    return await this.prisma.topic.delete({
      where: { id },
    });
  }

  // ==============================
  // Pagination Helper
  // ==============================
  async getAllTopicByPagination(payload: any) {
    return await pagination(payload, async (limit: number, offset: number, sortOrder: any) => {
      const [doc, totalDoc] = await Promise.all([
        this.prisma.topic.findMany({
          skip: offset,
          take: limit,
        }),
        this.prisma.topic.count(),
      ]);

      return { doc, totalDoc };
    });
  }





































}


const prisma = new PrismaClient();

const blogRepository = new BlogRepository(prisma);
export default blogRepository;


