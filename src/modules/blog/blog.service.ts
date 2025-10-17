import { NotFoundError } from '../../utils/errors';
// import { BaseService } from '../base/base.service';
import blogRepository from './blog.repository';
import ImgUploader from '../../middleware/upload/ImgUploder';
import { slugGenerate } from '../../utils/slugGenerate';
// import { removeUploadFile } from '../../middleware/upload/removeUploadFile';

export class BlogService {
  private repository: typeof blogRepository;
  constructor(repository: typeof blogRepository) {
    this.repository = repository;
  }

  async createBlog(payloadFiles: any, payload: any, tx?: any) {
    const { title, details } = payload;
    // both  are required
    if (!title || !details) throw new NotFoundError('Title and Details are required');
    const { files } = payloadFiles || {};

    if (files?.length) {
      const images = await ImgUploader(files);
      // console.log('Images uploaded is images ater upload:', images);
      for (const key in images) {
        payload[key] = images[key];
      }
    }
    payload.slug = slugGenerate(payload.title);
    return await this.repository.createBlog(payload, tx);
  }

  async getAllBlog() {
    return await this.repository.getAllBlog();
  }

  async getBlogWithPagination(payload: any) {
    return await this.repository.getBlogWithPagination(payload);
  }

  async getSingleBlog(slug: string) {
    const blogData = await this.repository.getBlogBySlug(slug);
    if (!blogData) throw new NotFoundError('Blog Not Found');
    return blogData;
  }

  async getSingleBlogWithSlug(slug: string) {
    const blogData = await this.repository.getBlogBySlug(slug);
    if (!blogData) throw new NotFoundError('Blog Not Found');
    return blogData;
  }

  async getNavBar() {
    console.log('Fetching Navbar Data...');
    const navbarData = await this.repository.getNavBar();
    console.log('Navbar Data:', navbarData);
    if (!navbarData) throw new NotFoundError('Navbar Not Found');
    return navbarData;
  }

  async updateBlog(slug: string, payloadFiles: any, payload: any) {
    const { files } = payloadFiles || {};
    let oldBlog = null;
    oldBlog = await this.repository.getBlogBySlug(slug);

  // Check if the title has changed, and update the slug if necessary
  if (oldBlog && payload.title && payload.title !== oldBlog.title) {
    payload.slug = slugGenerate(payload.title);
  }
    if (files?.length) {
      const images = await ImgUploader(files);
      for (const key in images) {
        payload[key] = images[key];
      }
    }
    const blogData = await this.repository.updateBlog(slug, payload);
    // Remove old files if replaced
    if (files?.length && oldBlog?.image) {
      // await removeUploadFile(oldBlog.image);
    }
    return blogData;
  }

  async updateBlogStatus(slug: string, status: any) {
    if (!status) throw new NotFoundError('Status is required');
    // status = status === 'true';
    return await this.repository.updateBlog(slug, { status });
  }

  async deleteBlog(slug: string) {
    // TODO: Remove files if needed
    return await this.repository.deleteBlog(slug); // Or use a delete method
  }
}

export default new BlogService(blogRepository);
