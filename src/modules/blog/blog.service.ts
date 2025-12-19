import { NotFoundError } from "../../utils/errors";
// import { BaseService } from '../base/base.service';
import blogRepository from "./blog.repository";
import ImgUploader from "../../middleware/upload/ImgUploder";
import { slugGenerate } from "../../utils/slugGenerate";
import { NextFunction } from "express";
import { BlogI, TopicI, IIndustries, UpdateBlogRequestDto, UpdateBlogTagRequestDto } from "../../types/blog";
import { Payer } from "@aws-sdk/client-s3";
// import { removeUploadFile } from '../../middleware/upload/removeUploadFile';

export class BlogService {
  private repository: typeof blogRepository;
  constructor(repository: typeof blogRepository) {
    this.repository = repository;
  }


  // ==============================
  // Blog
  // ==============================
  //done
  async getAllBlogs(page = 1, limit = 10): Promise<any> {
    if (page <= 0 || limit <= 0) {
      const error = new Error("Oops! Page number and items per page should be at least 1.");
      (error as any).statusCode = 400;
      throw error;
    }

    const offset = (page - 1) * limit;
    return await blogRepository.findAllBlogs(offset, limit);
  }

  async getAllBlogTags(): Promise<any> {
    return await blogRepository.findAllBlogTags();
  }

  async createBlog(payloadFiles: any, payload: any, tx?: any) {
    const { title, details, tagIds, industryId, topicId, status, trendingContent, featured } = payload;
    const { files } = payloadFiles;
    if (!files) throw new Error('image is required');
    console.log('Creating blog with files:', files);
    const images = await ImgUploader(files);
    for (const key in images) {
      payload[key] = images[key];
    }
    // both  are required
    if (!title || !details || !industryId || !topicId) throw new NotFoundError("Title, Details, Industry, and Topic are required.");

    payload.slug = slugGenerate(payload.title);
    const existing = await this.repository.findSlug(payload.slug);
    if (existing) {
      const error = new Error(`Blog with title "${payload.title}" already exists.`);
      (error as any).statusCode = 400;
      throw error;
    }

    let tagsArray: number[] = [];

    if (typeof tagIds === "string") {
      try {
        tagsArray = JSON.parse(tagIds); // '[1,2,4]' → [1, 2, 4]
        if (!Array.isArray(tagsArray)) {
          tagsArray = []; // safeguard
        }
      } catch (error) {
        console.error("Invalid tagIds format", error);
        tagsArray = [];
      }
    } else if (Array.isArray(tagIds)) {
      tagsArray = tagIds;
    } else if (typeof tagIds === "number") {
      tagsArray = [tagIds];
    }

    for (const tagId of tagsArray) {
      // check tagId exists
      const tag = await this.repository.findBlogTag(tagId);
      if (!tag) {
        throw new Error(`Tag with ID ${tagId} does not exist.`);
      }
    }

    // Enforce: maximum 2 featured blogs. If incoming is featured=true and already 2 exist,
    // unfeature the oldest among the currently featured before creating the new one.
    if (featured === true) {
      const currentFeatured = await this.repository.getFeaturedBlogs(2, 'desc');
      if (currentFeatured.length >= 2) {
        const toUnfeature = currentFeatured[currentFeatured.length - 1];
        await this.repository.updateBlogById(toUnfeature.id, { featured: false } as any, tx);
      }
    }
    payload.tagsArray = tagsArray;

    console.log('Creating blog with payload:', payload);

    // Create blog first
    const createdBlog = await this.repository.createBlog(payload, tx);

    // Then add tags if tagIds provided
    if (tagsArray && tagsArray.length > 0 && createdBlog.id) {
      await this.repository.addTagsToBlog(createdBlog.id, tagsArray, tx);
    }

    return createdBlog;
  }


  async updateBlog(slug: string, payloadFiles: any, payload: UpdateBlogRequestDto) {
    const { files } = payloadFiles || {};
    const { title, details, tagIds, industryId, topicId, status, featured } = payload;
    console.log('Updating blog with payload:', payload);

    // Validate required fields
    if (!title || !details) {
      const error = new Error(`Title and details are required.`);
      (error as any).statusCode = 400;
      throw error;
    }

    // Find existing blog
    const existingBlog = await this.repository.findSlug(slug);
    if (!existingBlog) {
      const error = new Error(`Blog with slug "${slug}" does not exist.`);
      (error as any).statusCode = 404;
      throw error;
    }

    // Handle slug if title changed
    let newSlug = slug;
    if (title !== existingBlog.title) {
      newSlug = slugGenerate(title);
      const slugConflict = await this.repository.findSlug(newSlug);
      if (slugConflict && slugConflict.id !== existingBlog.id) {
        const error = new Error(`A blog with title "${title}" already exists.`);
        (error as any).statusCode = 400;
        throw error;
      }
      payload.slug = newSlug;
    }

    // Handle image upload
    if (files && files.length > 0) {
      const images = await ImgUploader(files);
      for (const key in images) {
        (payload as any)[key] = images[key];
      }
    }

    // Parse tagIds
    let tagsArray: number[] = [];
    if (typeof tagIds === "string") {
      try {
        tagsArray = JSON.parse(tagIds);
        if (!Array.isArray(tagsArray)) tagsArray = [];
      } catch (error) {
        console.error("Invalid tagIds format", error);
        tagsArray = [];
      }
    } else if (Array.isArray(tagIds)) {
      tagsArray = tagIds;
    } else if (typeof tagIds === "number") {
      tagsArray = [tagIds];
    }

    // Validate tags exist
    for (const tagId of tagsArray) {
      const tag = await this.repository.findBlogTag(tagId);
      if (!tag) {
        throw new Error(`Tag with ID ${tagId} does not exist.`);
      }
    }

    // Remove tagIds from payload as it's handled separately
    const { tagIds: _, ...updatePayload } = payload as any;

    // Enforce: maximum 2 featured blogs. If setting featured=true and this
    // blog isn't already one of the two, unfeature the oldest among current featured.
    if (updatePayload.featured === true) {
      const currentFeatured = await this.repository.getFeaturedBlogs(2, 'desc');
      const isAlreadyFeatured = currentFeatured.some((b) => b.id === existingBlog.id);
      if (!isAlreadyFeatured && currentFeatured.length >= 2) {
        const toUnfeature = currentFeatured[currentFeatured.length - 1];
        await this.repository.updateBlogById(toUnfeature.id, { featured: false } as any);
      }
    }

    // Update blog by id to avoid slug-where conflict
    const updatedBlog = await this.repository.updateBlogById(existingBlog.id, updatePayload);

    // Update tags if provided
    if (tagsArray.length > 0 && updatedBlog.id) {
      // Remove old tags
      await this.repository.removeTagsFromBlog(updatedBlog.id);
      // Add new tags
      await this.repository.addTagsToBlog(updatedBlog.id, tagsArray);
    }

    return updatedBlog;
  }


  

  async getSingleBlog(slug: string) {
    const blogData = await this.repository.getBlogBySlug(slug);
    if (!blogData) throw new NotFoundError("Blog Not Found");
    return blogData;
  }

  async getBlogsByTags(tags: string[], tx?: any) {
    const blogs = await blogRepository.getBlogsByTags(tags, tx);
    return blogs;
  }


  //todo
  async getAllBlogsByPagination(payload: any) {
    return await this.repository.getAllBlogsByPagination(payload);
  }

  async getSingleBlogWithSlug(slug: string) {
    const blogData = await this.repository.getBlogBySlug(slug);
    if (!blogData) throw new NotFoundError("Blog Not Found");
    return blogData;
  }



  // async updateBlog(slug: string, payloadFiles: any, payload: any) {
  //   const { files } = payloadFiles || {};
  //   let oldBlog = null;
  //   oldBlog = await this.repository.getBlogBySlug(slug);

  // // Check if the title has changed, and update the slug if necessary
  // if (oldBlog && payload.title && payload.title !== oldBlog.title) {
  //   payload.slug = slugGenerate(payload.title);
  // }
  //   if (files?.length) {
  //     const images = await ImgUploader(files);
  //     for (const key in images) {
  //       payload[key] = images[key];
  //     }
  //   }
  //   const blogData = await this.repository.updateBlog(slug, payload);
  //   // Remove old files if replaced
  //   if (files?.length && oldBlog?.image) {
  //     // await removeUploadFile(oldBlog.image);
  //   }
  //   return blogData;
  // }

  async deleteBlog(slug: string) {
    // TODO: Remove files if needed
    return await this.repository.deleteBlog(slug); // Or use a delete method
  }


  // ==============================
  // Tag
  // ==============================

  async updateBlogTag(id: number, payload: UpdateBlogTagRequestDto) {
    payload.slug = slugGenerate(payload.title!);

    const doesNewTItleExist = await this.repository.findBlogSlugTag(payload.slug);
    if (doesNewTItleExist) {
      const error = new Error(`Blog tag "${payload.title}" already exists.`);
      (error as any).statusCode = 400;
      throw error;
    }
    payload.slug = slugGenerate(payload.title!);

    const updatedTag = await this.repository.updateBlogTag(id, payload);
    return updatedTag;
  }

  async deleteBlogBySlug(slug: string) {
    const existing = await this.repository.findSlug(slug);

    if (!existing) {
      const error = new Error(`Blog "${slug}" not found.`);
      (error as any).statusCode = 404;
      throw error;
    }

    const deleted = await this.repository.deleteBlogById(existing.id);
    return deleted;
  }

  async deleteTag(slug: string) {
    const existing = await this.repository.findBlogSlugTag(slug);

    if (!existing) {
      const error = new Error(`Blog tag "${slug}" not found.`);
      (error as any).statusCode = 404;
      throw error;
    }

    const deleted = await this.repository.deleteBlogTagById(existing.id);
    return deleted;
  }


  async getAllTagsByPagination(payload: any) {
    return await this.repository.getAllTagsByPagination(payload);
  }

  async createBlogTag(title: string) {
    if (!title) {
      const error = new Error("Missing required field: title");
      (error as any).statusCode = 400;
      throw error;
    }
    try {
      let slug = slugGenerate(title);
      const existingSlug = await this.repository.findBlogSlugTag(slug);
      if (existingSlug) {
        const error = new Error(`Blog tag with title "${title}" already exists.`);
        (error as any).statusCode = 400;
        throw error;
      }

      const payload = { slug, title };
      const newTag = await this.repository.createBlogTag(payload);

      return newTag;
    } catch (error) {
      console.error("Error creating blog tag:", error);
      throw error;
    }
  }


  async getSingleBlogTag(tagId: number) {
    const SingleTag = await this.repository.getTagById(tagId);
    if (!SingleTag) throw new NotFoundError("Blog Not Found");
    return SingleTag;
  }





  // ==============================
  //  Topic
  // ==============================
  async createTopic(payload: any, tx?: any) {
    const { title, } = payload;

    if (!title) {
      const error = new Error("Missing required field: title ");
      (error as any).statusCode = 400;
      throw error;
    }

    let slug = slugGenerate(title);

    const existing = await this.repository.findTopicBySlug(slug);
    if (existing) {
      const error = new Error(`Topic with title "${title}" already exists.`);
      (error as any).statusCode = 400;
      throw error;
    }

    const data: TopicI = {
      title,
      slug,
    };

    const topic = await this.repository.createTopic(data, tx);
    return topic;
  }

  async getAllTopics() {
    return await this.repository.getAllTopics();
  }

  async getSingleTopic(id: number) {
    const existing = await this.repository.findTopicById(id);

    if (!existing) {
      const error = new Error(`Topic with id "${id}" not found.`);
      (error as any).statusCode = 404;
      throw error;
    }

    return existing;
  }

  async updateTopic(id: number, payload: TopicI) {
    const existing = await this.repository.findTopicById(id);

    if (!existing) {
      const error = new Error(`Topic does not exist.`);
      (error as any).statusCode = 400;
      throw error;
    }

    if (payload.title) {
      const slug = slugGenerate(payload.title);
      const ifSlugExist = await this.repository.findTopicBySlug(slug);
      if (ifSlugExist) {
        const error = new Error(`Topic already exist.`);
        (error as any).statusCode = 400;
        throw error;
      }
      payload.slug = slug
    }

    const updated = await this.repository.updateTopic(id, payload);
    return updated;
  }

  async deleteTopic(id: number) {
    const existing = await this.repository.findTopicById(id);

    if (!existing) {
      const error = new Error(`Topic not found.`);
      (error as any).statusCode = 404;
      throw error;
    }


    return await this.repository.deleteTopicById(id);
  }

  async getAllTopicByPagination(payload: any) {
    return await this.repository.getAllTopicByPagination(payload);
  }





  // ==============================
  //  Industries
  // ==============================
  async createIndustries(payload: any, tx?: any) {
    const { title, } = payload;

    if (!title) {
      const error = new Error("Missing required field: title ");
      (error as any).statusCode = 400;
      throw error;
    }

    let slug = slugGenerate(title);

    const existing = await this.repository.findIndustriesBySlug(slug);
    if (existing) {
      const error = new Error(`Industries with title "${title}" already exists.`);
      (error as any).statusCode = 400;
      throw error;
    }

    const data: IIndustries = {
      title,
      slug,
    };

    const topic = await this.repository.createIndustries(data, tx);
    return topic;
  }

  async getAllIndustriess() {
    return await this.repository.getAllIndustriess();
  }

  async getSingleIndustries(id: number) {
    const existing = await this.repository.findIndustriesById(id);

    if (!existing) {
      const error = new Error(`Industries with id "${id}" not found.`);
      (error as any).statusCode = 404;
      throw error;
    }

    return existing;
  }

  async updateIndustries(id: number, payload: IIndustries) {
    const existing = await this.repository.findIndustriesById(id);

    if (!existing) {
      const error = new Error(`Industries does not exist.`);
      (error as any).statusCode = 400;
      throw error;
    }

    if (payload.title) {
      const slug = slugGenerate(payload.title);
      const ifSlugExist = await this.repository.findIndustriesBySlug(slug);
      if (ifSlugExist) {
        const error = new Error(`Industries already exist.`);
        (error as any).statusCode = 400;
        throw error;
      }
      payload.slug = slug
    }

    const updated = await this.repository.updateIndustries(id, payload);
    return updated;
  }

  async deleteIndustries(id: number) {
    const existing = await this.repository.findIndustriesById(id);

    if (!existing) {
      const error = new Error(`Industries not found.`);
      (error as any).statusCode = 404;
      throw error;
    }


    return await this.repository.deleteIndustriesById(id);
  }

  async getAllIndustriesByPagination(payload: any) {
    return await this.repository.getAllIndustriesByPagination(payload);
  }




}

export default new BlogService(blogRepository);
