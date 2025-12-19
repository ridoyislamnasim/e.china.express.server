// BlogRepository (TypeScript version)
import { BlogI, CreateBlogTagRequestDto, TopicI, IIndustries, UpdateBlogRequestDto, UpdateBlogTagRequestDto } from "../../types/blog";
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
    const toBool = (val: any) => val === true || val === "true" || val === 1 || val === "1";
    const { title, details, slug, industryId, topicId, status, image, tagsArray, trendingContent, featured } = payload;
    const client = tx || this.prisma;
    console.log('Creating blog with tagsArray:', tagsArray);

    // Blog create with tags
    const blog = await client.blog.create({
      data: {
        title,
        details,
        slug,
        industryId: Number(industryId),
        topicId: Number(topicId),
        status: toBool(status),
        image,
        featured: toBool(featured),
        trendingContent: toBool(trendingContent),
        tags: {
          create: tagsArray?.map((tagId: number) => ({
            tag: { connect: { id: tagId } } // connect existing tag
          })) || [],
        },
      },
    });

    return blog;
  }

  async addTagsToBlog(blogId: number, tagIds: number[], tx?: any) {
    const client = tx || this.prisma;

    console.log('Adding tags to blog:', blogId, tagIds);

    for (const tagId of tagIds) {
      console.log(`Processing tagId: ${tagId}, blogId: ${blogId}`);
      // already exists?
      const existing = await client.blogTagOnBlog.findFirst({
        where: {
          blogId: blogId,
          tagId: tagId,
        },
      });
      if (existing) {
        continue; // skip if already exists
      }
      await client.blogTagOnBlog.create({
        data: {
          blogId: blogId,
          tagId: tagId,
        },
      });
    }

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

  async getAllTagsByPagination(payload: any) {
    return await pagination(payload, async (limit: number, offset: number, sortOrder: any) => {
      const [doc, totalDoc] = await Promise.all([
        this.prisma.blogTag.findMany({
          skip: offset,
          take: limit,
          // orderBy: sortOrder,
        }),
        this.prisma.blogTag.count(),
      ]);
      return { doc, totalDoc };
    });
  }

  async findBlogTag(id: number) {
    const result = await this.prisma.blogTag.findFirst({
      where: {
        id: id,
      },
    });
    return result;
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

  async getBlogBySlug(slug: string) {
    return await this.prisma.blog.findFirst({
      where: { slug },
    });
  }

  private buildUpdateData(payload: UpdateBlogRequestDto) {
    const data: any = {};
    if (payload.title !== undefined) data.title = payload.title;
    if (payload.details !== undefined) data.details = payload.details;
    if (payload.slug !== undefined) data.slug = payload.slug;
    if (payload.industryId !== undefined) data.industryId = Number(payload.industryId);
    if (payload.topicId !== undefined) data.topicId = Number(payload.topicId);
    const toBool = (val: any) => val === true || val === "true" || val === 1 || val === "1";
    if (payload.status !== undefined) data.status = toBool(payload.status);
    if ((payload as any).featured !== undefined) data.featured = toBool((payload as any).featured);
    if ((payload as any).trendingContent !== undefined) data.trendingContent = toBool((payload as any).trendingContent);
    if ((payload as any).image !== undefined) data.image = (payload as any).image;
    return data;
  }

  async updateBlog(slug: string, payload: UpdateBlogRequestDto) {
    const data = this.buildUpdateData(payload);  
    console.log('Updating blog with data:', data); 
    return await this.prisma.blog.update({
      where: { slug: slug },
      data,
    });
  }

  async updateBlogById(id: number, payload: UpdateBlogRequestDto, tx?: any) {
    const client = tx || this.prisma;
    console.log('Updating blog id:', id, 'with payload:', payload);
    const data = this.buildUpdateData(payload);
    console.log('Updating blog with data:', data); 
    return await client.blog.update({
      where: { id },
      data,
    });
  }

  async removeTagsFromBlog(blogId: number, tx?: any) {
    const client = tx || this.prisma;
    return await client.blogTagOnBlog.deleteMany({
      where: { blogId },
    });
  }

  async getFeaturedBlogs(limit = 2, order: 'asc' | 'desc' = 'desc') {
    return await this.prisma.blog.findMany({
      where: { featured: true },
      orderBy: { createdAt: order },
      take: limit,
      select: { id: true, slug: true, createdAt: true },
    });
  }

  async deleteBlogById(id: number) {
    return await this.prisma.blog.delete({
      where: { id },
    });
  }

  async deleteBlog(slug: string) {
    return await this.prisma.blog.delete({
      where: { slug },
    });
  }

  async getAllBlogsByPagination(payload: any) {
    return await pagination(payload, async (limit: number, offset: number, sortOrder: any) => {
      const [doc, totalDoc] = await Promise.all([
        this.prisma.blog.findMany({
          skip: offset,
          take: limit,
          // orderBy: sortOrder,
          include: {
            tags:{
              select: {
                tag: true
              }
            },
            industry: true,
            topic: true,
          },
        }),
        this.prisma.blog.count(),
      ]);
      return { doc, totalDoc };
    });
  }




  //! ==============================
  // Tag
  // ==============================

    async createBlogTag(payload: CreateBlogTagRequestDto): Promise<any> {
    return await this.prisma.blogTag.create({ data: payload });
  }

    async findAllBlogTags() {
    return await this.prisma.blogTag.findMany();
  }

   async findBlogTagBySlug(slug: string) {
    return this.prisma.blogTag.findFirst({ where: { slug } });
  }


    async getTagById(tagId: number) {
    return await this.prisma.blogTag.findFirst({
      where: { id: tagId },
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








  //! ==============================
  // Create Topic
  // ==============================
  async createTopic(payload: TopicI, tx?: any) {
    const client = tx || prisma;
    return await client.topic.create({
      data: payload,
    });
  }

  async findTopicById(id: number) {
    return await this.prisma.topic.findFirst({
      where: { id },
    });
  }

  async findTopicBySlug(slug: string) {
    return await this.prisma.topic.findFirst({
      where: { slug },
    });
  }

  async getAllTopics() {

    return this.prisma.topic.findMany({

      orderBy: { createdAt: "desc" },
    })


  }

  async updateTopic(id: number, payload: TopicI) {
    return await this.prisma.topic.update({
      where: { id },
      data: payload,
    });
  }

  async deleteTopicById(id: number) {
    return await this.prisma.topic.delete({
      where: { id },
    });
  }

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



  //! ==============================
  // Create Industries
  // ==============================
  async createIndustries(payload: IIndustries, tx?: any) {
    const client = tx || prisma;
    return await client.industry.create({
      data: payload,
    });
  }

  async findIndustriesById(id: number) {
    return await this.prisma.industry.findFirst({
      where: { id },
    });
  }

  async findIndustriesBySlug(slug: string) {
    return await this.prisma.industry.findFirst({
      where: { slug },
    });
  }

  async getAllIndustriess() {

    return this.prisma.industry.findMany({

      orderBy: { createdAt: "desc" },
    })


  }

  async updateIndustries(id: number, payload: IIndustries) {
    return await this.prisma.industry.update({
      where: { id },
      data: payload,
    });
  }

  async deleteIndustriesById(id: number) {
    return await this.prisma.industry.delete({
      where: { id },
    });
  }

  async getAllIndustriesByPagination(payload: any) {
    return await pagination(payload, async (limit: number, offset: number, sortOrder: any) => {
      const [doc, totalDoc] = await Promise.all([
        this.prisma.industry.findMany({
          skip: offset,
          take: limit,
        }),
        this.prisma.industry.count(),
      ]);

      return { doc, totalDoc };
    });
  }

































}


const prisma = new PrismaClient();

const blogRepository = new BlogRepository(prisma);
export default blogRepository;


