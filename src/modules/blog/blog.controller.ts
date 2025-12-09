import { Request, Response, NextFunction } from "express";
import catchError from "../../middleware/errors/catchError";
import { responseHandler } from "../../utils/responseHandler";
import withTransaction from "../../middleware/transactions/withTransaction";
import BlogService from "./blog.service";
import { BlogI, CreateBlogRequestDto, UpdateBlogRequestDto, UpdateBlogTagRequestDto } from "../../types/blog";

export class BlogController {
  //done

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
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const resDoc = await BlogService.getAllBlogTags(page, limit);
      const result = responseHandler(200, "Blog tags fetched successfully", resDoc);
      res.status(result.statusCode).json(result);
    } catch (error) {
      next(error);
    }
  }

  createBlog = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    const payloadFiles = {
      files: req.files,
    };
    const { image, title, slug, author, details, tags, status, createdAt, updatedAt, files }: BlogI = req.body;

    const payload = {
      image,
      title,
      slug,
      author,
      details,
      tags,
      status,
      createdAt,
      updatedAt,
      files,
    };

    console.log("blog playload", payload);
    const blogResult = await BlogService.createBlog(payloadFiles, payload, tx);
    const resDoc = responseHandler(201, "Blog Created successfully", blogResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  createBlogTag = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const title = req.body.title;

    const result = await BlogService.createBlogTag(title);
    const resDoc = responseHandler(201, "Blog Created successfully", result);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSingleBlog = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug;
    const blogResult = await BlogService.getSingleBlog(slug);
    const resDoc = responseHandler(201, "Single Blog successfully", blogResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateBlogBySlug = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const slugStr = req.params.slug;
    const { image, title, slug, author, details, tags, status, files }: UpdateBlogRequestDto = req.body;
    const payload = { image, title, slug, author, details, tags, status, files };
    const blogResult = await BlogService.updateBlog(slugStr, payload);
    const resDoc = responseHandler(201, "Blog Status Update successfully", blogResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateBlogTagBySlug = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const slugStr = req.params.slug;
    const { title, slug }: UpdateBlogTagRequestDto = req.body;
    const payload = { title, slug };
    const blogResult = await BlogService.updateBlogTag(slugStr, payload);
    const resDoc = responseHandler(201, "Blog Status Update successfully", blogResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  deleteBlogTagBySlug = catchError(async (req: Request, res: Response) => {
    const slugStr = req.params.slug;

    const result = await BlogService.deleteBlogTagBySlug(slugStr);

    const resDoc = responseHandler(200, "Blog tag deleted successfully", result);
    res.status(resDoc.statusCode).json(resDoc);
  });

  deleteBlogBySlug = catchError(async (req: Request, res: Response) => {
    const slugStr = req.params.slug;

    const result = await BlogService.deleteBlogBySlug(slugStr);

    const resDoc = responseHandler(200, "Blog deleted successfully", result);
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


  


  //todo

  getSingleBlogWithSlug = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug;
    const blogResult = await BlogService.getSingleBlogWithSlug(slug);
    const resDoc = responseHandler(201, "Single Blog successfully", blogResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getBlogWithPagination = catchError(async (req: Request, res: Response, next: NextFunction) => {
    let payload = {
      page: req.query.page,
      limit: req.query.limit,
      order: req.query.order,
    };
    const blog = await BlogService.getBlogWithPagination(payload);
    const resDoc = responseHandler(200, "Blogs get successfully", blog);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getNavBar = catchError(async (req: Request, res: Response, next: NextFunction) => {
    console.log("Fetching Navbar Data...");
    const navBarResult = await BlogService.getNavBar();
    const resDoc = responseHandler(201, "Navbar successfully", navBarResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateBlog = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug;
    const payloadFiles = {
      files: req.files,
    };
    const payload = {
      title: req.body.title,
      details: req.body.details,
    };
    const blogResult = await BlogService.updateBlog(slug, payload);
    const resDoc = responseHandler(201, "Blog Update successfully", blogResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  deleteBlog = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug;
    const blogResult = await BlogService.deleteBlog(slug);
    const resDoc = responseHandler(200, "Blog Deleted successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });
}

export default new BlogController();
