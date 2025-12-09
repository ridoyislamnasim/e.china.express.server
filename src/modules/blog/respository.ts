// import { Prisma } from "@prisma/client";
// import { CreateBlogRequestDto, UpdateBlogRequestDto } from "../../types/blog";

// export default new (class BlogRepository {
//   private prisma = Prisma;

//   async getAllBlogs(page: number, limit: number) {
//     const skip = (page - 1) * limit;

//     const [blogs, total] = await Promise.all([
//       this.prisma.blog.findMany({
//         skip,
//         take: limit,
//         orderBy: { createdAt: "desc" },
//       }),
//       this.prisma.blog.count(),
//     ]);

//     return { blogs, total };
//   }

//   async getBlogById(id: number) {
//     return await this.prisma.blog.findUnique({ where: { id } });
//   }

//   async createBlog(data: CreateBlogRequestDto) {
//     return await this.prisma.blog.create({ data });
//   }

//   async updateBlog(id: number, data: UpdateBlogRequestDto) {
//     return await this.prisma.blog.update({
//       where: { id },
//       data,
//     });
//   }

//   async deleteBlog(id: number) {
//     return await this.prisma.blog.delete({ where: { id } });
//   }
// })();
