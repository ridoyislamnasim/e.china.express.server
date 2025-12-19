import { Request, Response, NextFunction } from "express";
import catchError from "../../middleware/errors/catchError";
import { responseHandler } from "../../utils/responseHandler";
import withTransaction from "../../middleware/transactions/withTransaction";
import BlogService from "./blog.service";
import { BlogI, CreateBlogRequestDto, IIndustries, TopicI, UpdateBlogRequestDto, UpdateBlogTagRequestDto } from "../../types/blog";
import { string } from "zod";

export class BlogController {

  // ==============================
  //  Blog
  // ==============================

  async getAllBlogs(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const resDoc = await BlogService.getAllBlogs(page, limit);
      const result = responseHandler(200, "Blogs fetched successfully", resDoc);
      res.status(result.statusCode).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAllBlogTags(req: Request, res: Response, next: NextFunction) {

    const resDoc = await BlogService.getAllBlogTags();
    const result = responseHandler(200, "Blog tags fetched successfully", resDoc);
    res.status(result.statusCode).json(result);

  }


  // getAllBlogsByPagination = catchError(async (req: Request, res: Response, next: NextFunction) => {
  //   let payload = {
  //     page: req.query.page,
  //     limit: req.query.limit,
  //     order: req.query.order,
  //   };
  //   const blog = await BlogService.getAllBlogsByPagination(payload);
  //   const resDoc = responseHandler(200, "Blogs get successfully", blog);
  //   res.status(resDoc.statusCode).json(resDoc);
  // });


  createBlog = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    const user = req.user?.user_info_encrypted?.id?.toString() ?? null;
    const payloadFiles = {
      files: req.files,
    };

    const { title, details, tagIds, industryId, topicId, status, trendingContent, featured }: BlogI = req.body;

    const payload = {
      user,
      title,
      details,
      tagIds,
      industryId,
      topicId,
      status,
      trendingContent,
      featured,

    };

    const blogResult = await BlogService.createBlog(payloadFiles, payload, tx);
    const resDoc = responseHandler(201, "Blog Created successfully", blogResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateBlog = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user?.user_info_encrypted?.id?.toString() ?? null;
    const slug = req.params.slug;
    const payloadFiles = {
      files: req.files,
    };
    const { title, details, tagIds, industryId, topicId, status, featured, trendingContent }: BlogI = req.body;

    const payload = {
      user,
      title: title ?? undefined,
      details: details ?? undefined,
      tagIds,
      industryId: industryId ?? 0,
      topicId: topicId ?? 0,
      status,
      featured,
      trendingContent,
    };
    const blogResult = await BlogService.updateBlog(slug, payloadFiles, payload);
    const resDoc = responseHandler(201, "Blog Update successfully", blogResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

   getSingleBlog = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug;
    const blogResult = await BlogService.getSingleBlog(slug);
    const resDoc = responseHandler(201, "Single Blog successfully", blogResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  deleteBlog = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug;
    const blogResult = await BlogService.deleteBlog(slug);
    const resDoc = responseHandler(200, "Blog Deleted successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });


  getSingleBlogWithSlug = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug;
    const blogResult = await BlogService.getSingleBlogWithSlug(slug);
    const resDoc = responseHandler(201, "Single Blog successfully", blogResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllBlogsByPagination = catchError(async (req: Request, res: Response, next: NextFunction) => {
    let payload = {
      page: req.query.page,
      limit: req.query.limit,
      order: req.query.order,
    };
    const blog = await BlogService.getAllBlogsByPagination(payload);
    const resDoc = responseHandler(200, "Blogs get successfully", blog);
    res.status(resDoc.statusCode).json(resDoc);
  });

  deleteBlogBySlug = catchError(async (req: Request, res: Response) => {
    const slugStr = req.params.slug;

    const result = await BlogService.deleteBlogBySlug(slugStr);

    const resDoc = responseHandler(200, "Blog deleted successfully", result);
    res.status(resDoc.statusCode).json(resDoc);
  });






  // ==============================
  //  Tag
  // ==============================

  createBlogTag = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const title = req.body.title;

    const result = await BlogService.createBlogTag(title);
    const resDoc = responseHandler(201, "Blog Created successfully", result);
    res.status(resDoc.statusCode).json(resDoc);
  });

 

  getSingleBlogTag = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const tagId = Number(req.params.id);
    const blogResult = await BlogService.getSingleBlogTag(tagId);
    const resDoc = responseHandler(201, "single tag successfully", blogResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateTag = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const { title }: UpdateBlogTagRequestDto = req.body;
    const payload = { title };
    const blogResult = await BlogService.updateBlogTag(id, payload);
    const resDoc = responseHandler(201, "Blog Status Update successfully", blogResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  deleteTag = catchError(async (req: Request, res: Response) => {
    const slugStr = req.params.slug;

    const result = await BlogService.deleteTag(slugStr);

    const resDoc = responseHandler(200, "Blog tag deleted successfully", result);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getBlogsByTags = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    const { tags } = req.body; // expect array of strings from checkboxes

    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return res.status(400).json(responseHandler(400, "Tags array is required"));
    }

    console.log("Filtering blogs by tags:", tags);

    // call service with tx (optional, in case you want transaction for complex logic)
    const blogs = await BlogService.getBlogsByTags(tags, tx);

    const resDoc = responseHandler(200, "Blogs fetched successfully", blogs);
    res.status(resDoc.statusCode).json(resDoc);
  });


  getAllTagsByPagination = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    let payload = {
      page: req.query.page,
      limit: req.query.limit,
      order: req.query.order,
    };
    const blog = await BlogService.getAllTagsByPagination(payload);
    const resDoc = responseHandler(200, "Tags get successfully", blog);
    res.status(resDoc.statusCode).json(resDoc);
  })



  // ==============================
  //  Topic
  // ==============================


  createTopic = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {

    const { title }: TopicI = req.body;

    const payload = {
      title,
    };

    const result = await BlogService.createTopic(payload, tx);

    const resDoc = responseHandler(201, "Topic created successfully", result);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllTopics = catchError(async (req: Request, res: Response, next: NextFunction) => {


    const result = await BlogService.getAllTopics();

    const resDoc = responseHandler(200, "Topics fetched successfully", result);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSingleTopic = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const topicId = Number(req.params.id);

    const result = await BlogService.getSingleTopic(topicId);

    const resDoc = responseHandler(200, "Topic fetched successfully", result);
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateTopic = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const topicId = Number(req.params.id);

    const { title }: TopicI = req.body;

    const payload = {

      title

    };

    const result = await BlogService.updateTopic(topicId, payload);

    const resDoc = responseHandler(200, "Topic updated successfully", result);
    res.status(resDoc.statusCode).json(resDoc);
  });

  deleteTopic = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const topicId = Number(req.params.id);

    const result = await BlogService.deleteTopic(topicId);

    const resDoc = responseHandler(200, "Topic deleted successfully", result);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllTopicByPagination = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const payload = {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
      order: req.query.order || "asc",
    };
    console.log("🚀 ~ blog.controller.ts:272 ~ BlogController ~ payload:", payload)


    const result = await BlogService.getAllTopicByPagination(payload);

    const resDoc = responseHandler(200, "Topics fetched successfully", result);
    res.status(resDoc.statusCode).json(resDoc);
  });





  // ==============================
  //  Industries
  // ==============================

  createIndustries = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {

    const { title }: IIndustries = req.body;

    const payload = {
      title,
    };

    const result = await BlogService.createIndustries(payload, tx);

    const resDoc = responseHandler(201, "Industries created successfully", result);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllIndustriess = catchError(async (req: Request, res: Response, next: NextFunction) => {


    const result = await BlogService.getAllIndustriess();

    const resDoc = responseHandler(200, "Industriess fetched successfully", result);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSingleIndustries = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const topicId = Number(req.params.id);

    const result = await BlogService.getSingleIndustries(topicId);

    const resDoc = responseHandler(200, "Industries fetched successfully", result);
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateIndustries = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const topicId = Number(req.params.id);

    const { title }: IIndustries = req.body;

    const payload = {

      title

    };

    const result = await BlogService.updateIndustries(topicId, payload);

    const resDoc = responseHandler(200, "Industries updated successfully", result);
    res.status(resDoc.statusCode).json(resDoc);
  });

  deleteIndustries = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const topicId = Number(req.params.id);

    const result = await BlogService.deleteIndustries(topicId);

    const resDoc = responseHandler(200, "Industries deleted successfully", result);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllIndustriesByPagination = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const payload = {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
      order: req.query.order || "asc",
    };
    console.log("🚀 ~ blog.controller.ts:272 ~ BlogController ~ payload:", payload)


    const result = await BlogService.getAllIndustriesByPagination(payload);

    const resDoc = responseHandler(200, "Industriess fetched successfully", result);
    res.status(resDoc.statusCode).json(resDoc);
  });




}

export default new BlogController();
