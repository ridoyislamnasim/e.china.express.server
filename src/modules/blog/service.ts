import blogRepository from "./blog.repository";
import { CreateBlogDTO, UpdateBlogDTO } from "../../types/blog";
import { NotFoundError } from "../../utils/errors";

export default new (class BlogService {
  async getAllBlogs(payload: any) {
    const page = Number(payload.page) || 1;
    const limit = Number(payload.limit) || 10;

    if (page <= 0 || limit <= 0) {
      const err: any = new Error("Please provide valid page & limit values.");
      err.statusCode = 400;
      throw err;
    }

    return await blogRepository.getAllBlogs(page, limit);
  }

  async getBlogById(id: string) {
    const blogId = Number(id);

    if (isNaN(blogId)) {
      const err: any = new Error("Invalid blog ID.");
      err.statusCode = 400;
      throw err;
    }

    const blog = await blogRepository.getBlogById(blogId);

    if (!blog) throw new NotFoundError(`Blog with ID ${blogId} not found.`);

    return blog;
  }

  async createBlog(data: CreateBlogDTO) {
    return await blogRepository.createBlog(data);
  }

  async updateBlog(id: string, data: UpdateBlogDTO) {
    const blogId = Number(id);

    const exists = await blogRepository.getBlogById(blogId);
    if (!exists) throw new NotFoundError(`Blog with ID ${blogId} not found.`);

    return await blogRepository.updateBlog(blogId, data);
  }

  async deleteBlog(id: string) {
    const blogId = Number(id);

    const exists = await blogRepository.getBlogById(blogId);
    if (!exists) throw new NotFoundError(`Blog with ID ${blogId} not found.`);

    const deleted = await blogRepository.deleteBlog(blogId);

    return {
      message: `Blog with ID ${blogId} deleted successfully.`,
      data: deleted,
    };
  }
})();
