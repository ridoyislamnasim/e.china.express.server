import { Request, Response, NextFunction } from 'express';
import catchError from '../../middleware/errors/catchError';
import {responseHandler} from '../../utils/responseHandler';
import withTransaction from '../../middleware/transactions/withTransaction';
import BlogService from './blog.service';




export class BlogController {
  createBlog = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    const payloadFiles = {
      files: req.files,
    };
    const payload = {
      title: req.body.title,
      details: req.body.details,
    };
    console.log("blog playload", payload)
    const blogResult = await BlogService.createBlog(
      payloadFiles,
      payload,
      tx
    );
    const resDoc = responseHandler(
      201,
      'Blog Created successfully',
      blogResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

























  getAllBlog = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const blogResult = await BlogService.getAllBlog();
    const resDoc = responseHandler(200, 'Get All Blogs', blogResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getBlogWithPagination = catchError(async (req: Request, res: Response, next: NextFunction) => {
    let payload = {
      page: req.query.page,
      limit: req.query.limit,
      order: req.query.order,
    };
    const blog = await BlogService.getBlogWithPagination(payload);
    console.log("🚀 ~ blog.controller.ts:70 ~ BlogController ~ blog:", blog)
    const resDoc = responseHandler(200, 'Blogs get successfully', blog);
    res.status(resDoc.statusCode).json(resDoc);
  });


  getSingleBlog = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug;
    const blogResult = await BlogService.getSingleBlog(slug);
    const resDoc = responseHandler(
      201,
      'Single Blog successfully',
      blogResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSingleBlogWithSlug = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug;
    const blogResult = await BlogService.getSingleBlogWithSlug(slug);
    const resDoc = responseHandler(
      201,
      'Single Blog successfully',
      blogResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getNavBar = catchError(async (req: Request, res: Response, next: NextFunction) => {
    console.log('Fetching Navbar Data...');
    const navBarResult = await BlogService.getNavBar();
    const resDoc = responseHandler(
      201,
      'Navbar successfully',
      navBarResult
    );
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
    const blogResult = await BlogService.updateBlog(
      slug,
      payloadFiles,
      payload
    );
    const resDoc = responseHandler(201, 'Blog Update successfully');
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateBlogStatus = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug;
    const status = req.query.status;
    const blogResult = await BlogService.updateBlogStatus(
      slug,
      status
    );
    const resDoc = responseHandler(201, 'Blog Status Update successfully');
    res.status(resDoc.statusCode).json(resDoc);
  });

  deleteBlog = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug;
    const blogResult = await BlogService.deleteBlog(slug);
    const resDoc = responseHandler(200, 'Blog Deleted successfully');
    res.status(resDoc.statusCode).json(resDoc);
  });
}

export default new BlogController();
