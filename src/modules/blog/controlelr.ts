import { Request, Response } from "express";
import catchError from "../../middleware/errors/catchError";
import blogService from "./blog.service";
import { responseHandler } from "../../utils/responseHandler";

export default new (class BlogController {
  getAllBlog = catchError(async (req: Request, res: Response) => {
    const data = await blogService.getAllBlogs(req.query);
    const resDoc = responseHandler(200, "Blogs retrieved successfully", data);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getBlogById = catchError(async (req: Request, res: Response) => {
    const blog = await blogService.getBlogById(req.params.id);
    const resDoc = responseHandler(200, "Blog retrieved successfully", blog);
    res.status(resDoc.statusCode).json(resDoc);
  });

  createBlog = catchError(async (req: Request, res: Response) => {
    const blog = await blogService.createBlog(req.body);
    const resDoc = responseHandler(201, "Blog created successfully", blog);
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateBlog = catchError(async (req: Request, res: Response) => {
    const blog = await blogService.updateBlog(req.params.id, req.body);
    const resDoc = responseHandler(200, "Blog updated successfully", blog);
    res.status(resDoc.statusCode).json(resDoc);
  });

  deleteBlog = catchError(async (req: Request, res: Response) => {
    const result = await blogService.deleteBlog(req.params.id);
    const resDoc = responseHandler(200, result.message, result.data);
    res.status(resDoc.statusCode).json(resDoc);
  });
})();
