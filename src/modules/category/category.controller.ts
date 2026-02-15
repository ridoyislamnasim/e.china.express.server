import { Request, Response, NextFunction } from "express";
import catchError from "../../middleware/errors/catchError";
import { responseHandler } from "../../utils/responseHandler";
import withTransaction from "../../middleware/transactions/withTransaction";
import CategoryService from "./category.service";

export class CategoryController {
  createCategory = withTransaction(
    async (req: Request, res: Response, next: NextFunction, tx: any) => {
      const payloadFiles = {
        files: req.files,
      };
      const payload = {
        name: req.body.name,
        slug: req.body.slug,
        // subCategoryRef: req.body.subCategoryRef,
        status:
          typeof req.body.status === "boolean"
            ? req.body.status
            : req.body.status === "true" || req.body.status === true,
        colorCode: req.body.colorCode,
      };
      const categoryResult = await CategoryService.createCategory(
        payloadFiles,
        payload,
        tx,
      );
      const resDoc = responseHandler(
        201,
        "Category Created successfully",
        categoryResult,
      );
      res.status(resDoc.statusCode).json(resDoc);
    },
  );

  getAllCategory = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
      const categoryResult = await CategoryService.getAllCategory();
      const resDoc = responseHandler(200, "Get All Categorys", categoryResult);
      res.status(resDoc.statusCode).json(resDoc);
    },
  );

  getCategoryWithPagination = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
      let payload = {
        page: req.query.page,
        limit: req.query.limit,
        order: req.query.order,
      };
      const category = await CategoryService.getCategoryWithPagination(payload);
      const resDoc = responseHandler(
        200,
        "Categorys get successfully",
        category,
      );
      res.status(resDoc.statusCode).json(resDoc);
    },
  );

  getSingleCategory = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
      const slug = req.params.slug as string;
      const categoryResult = await CategoryService.getSingleCategory(slug);
      const resDoc = responseHandler(
        201,
        "Single Category successfully",
        categoryResult,
      );
      res.status(resDoc.statusCode).json(resDoc);
    },
  );

  getSingleCategoryWithSlug = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
      const slug = req.params.slug as string;
      const categoryResult =
        await CategoryService.getSingleCategoryWithSlug(slug);
      const resDoc = responseHandler(
        201,
        "Single Category successfully",
        categoryResult,
      );
      res.status(resDoc.statusCode).json(resDoc);
    },
  );

  getNavBar = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
      console.log("Fetching Navbar Data...");
      const navBarResult = await CategoryService.getNavBar();
      const resDoc = responseHandler(201, "Navbar successfully", navBarResult);
      res.status(resDoc.statusCode).json(resDoc);
    },
  );

  updateCategory = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
      const slug = req.params.slug as string;
      const payloadFiles = {
        files: req.files,
      };
      const payload = {
        name: req.body.name,
        slug: req.body.slug,
        // subCategoryRef: req.body.subCategoryRef,
        status:
          typeof req.body.status === "boolean"
            ? req.body.status
            : req.body.status === "true" || req.body.status === true,
        colorCode: req.body.colorCode,
      };
      const categoryResult = await CategoryService.updateCategory(
        slug,
        payloadFiles,
        payload,
      );
      const resDoc = responseHandler(201, "Category Update successfully");
      res.status(resDoc.statusCode).json(resDoc);
    },
  );

  updateCategoryStatus = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
      const slug = req.params.slug as string;
      const status = req.query.status;
      const categoryResult = await CategoryService.updateCategoryStatus(
        slug,
        status,
      );
      const resDoc = responseHandler(
        201,
        "Category Status Update successfully",
      );
      res.status(resDoc.statusCode).json(resDoc);
    },
  );

  deleteCategory = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
      const slug = req.params.slug as string;
      const categoryResult = await CategoryService.deleteCategory(slug);
      const resDoc = responseHandler(200, "Category Deleted successfully");
      res.status(resDoc.statusCode).json(resDoc);
    },
  );
}

export default new CategoryController();
