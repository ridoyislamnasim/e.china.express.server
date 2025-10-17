import { NotFoundError } from '../../utils/errors';
// import { BaseService } from '../base/base.service';
import categoryRepository from './category.repository';
import ImgUploader from '../../middleware/upload/ImgUploder';
import { slugGenerate } from '../../utils/slugGenerate';
// import { removeUploadFile } from '../../middleware/upload/removeUploadFile';

export class CategoryService {
  private repository: typeof categoryRepository;
  constructor(repository: typeof categoryRepository) {
    this.repository = repository;
  }

  async createCategory(payloadFiles: any, payload: any, tx?: any) {
    const { files } = payloadFiles || {};
    if (files?.length) {
      const images = await ImgUploader(files);
      // console.log('Images uploaded is images ater upload:', images);
      for (const key in images) {
        payload[key] = images[key];
      }
    } 
    payload.slug = slugGenerate(payload.name);
    return await this.repository.createCategory(payload, tx);
  }

  async getAllCategory() {
    return await this.repository.getAllCategory();
  }

  async getCategoryWithPagination(payload: any) {
    return await this.repository.getCategoryWithPagination(payload);
  }

  async getSingleCategory(slug: string) {
    const categoryData = await this.repository.getCategoryById(slug);
    if (!categoryData) throw new NotFoundError('Category Not Found');
    return categoryData;
  }

  async getSingleCategoryWithSlug(slug: string) {
    const categoryData = await this.repository.getCategoryBySlug(slug);
    if (!categoryData) throw new NotFoundError('Category Not Found');
    return categoryData;
  }

  async getNavBar() {
    console.log('Fetching Navbar Data...');
    const navbarData = await this.repository.getNavBar();
    console.log('Navbar Data:', navbarData);
    if (!navbarData) throw new NotFoundError('Navbar Not Found');
    return navbarData;
  }

  async updateCategory(slug: string, payloadFiles: any, payload: any) {
    const { files } = payloadFiles || {};
    let oldCategory = null;
    if (files?.length) {
      oldCategory = await this.repository.getCategoryById(slug);
      const images = await ImgUploader(files);
      for (const key in images) {
        payload[key] = images[key];
      }
    }
    const categoryData = await this.repository.updateCategory(slug, payload);
    // Remove old files if replaced
    if (files?.length && oldCategory?.image) {
      // await removeUploadFile(oldCategory.image);
    }
    return categoryData;
  }

  async updateCategoryStatus(slug: string, status: any) {
    if (!status) throw new NotFoundError('Status is required');
    // status = status === 'true';
    return await this.repository.updateCategory(slug, { status });
  }

  async deleteCategory(slug: string) {
    // TODO: Remove files if needed
    return await this.repository.deleteCategory(slug); // Or use a delete method
  }
}

export default new CategoryService(categoryRepository);
