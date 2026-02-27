// AuthController (TypeScript version)
import { Request, Response, NextFunction } from "express";
import { responseHandler } from "../../utils/responseHandler";
import { RateWeightCategoriesService } from "./rateWeightCategories.service";
import rateWeightCategoriesRepository from "./rateWeightCategories.repository";
const rateWeightCategoriesService = new RateWeightCategoriesService(
  rateWeightCategoriesRepository,
);
class RateWeightCategoriesController {
  createRateWeightCategories = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { label, min_weight, max_weight, boxSize } = req.body;
      const payload = {
        label,
        min_weight,
        max_weight,
        boxSize,
      };
      const shippingMethod =
        await rateWeightCategoriesService.createRateWeightCategories(payload);
      const resDoc = responseHandler(
        201,
        "Rate weight categories created successfully",
        shippingMethod,
      );
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };
  getAllRateWeightCategories = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const rateWeightCategories =
        await rateWeightCategoriesService.getAllRateWeightCategories();
      const resDoc = responseHandler(
        200,
        "Rate weight categories retrieved successfully",
        rateWeightCategories,
      );
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };

  async getRateWeightCategoriesWithPagination(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      let payload = {
        page: Number(req.query.page),
        limit: Number(req.query.limit),
        order: req.query.order,
      };
      const rateWeightCategories =
        await rateWeightCategoriesService.getRateWeightCategoriesWithPagination(
          payload,
        );
      const resDoc = responseHandler(
        200,
        "Rate weight categories retrieved successfully",
        { ...rateWeightCategories },
      );
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  }
  async updateRateWeightCategories(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { id } = req.params;
    const { label, min_weight, max_weight, boxSize } = req.body;
    const payload = {
      label,
      min_weight,
      max_weight,
      boxSize,
    };
    const updatedCategory =
      await rateWeightCategoriesService.updateRateWeightCategories(
        id as string,
        payload,
      );
    const resDoc = responseHandler(
      200,
      "Rate weight categories updated successfully",
      updatedCategory,
    );
    res.status(resDoc.statusCode).json(resDoc);
  }

  async deleteRateWeightCategories(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = req.params;
      const deletedCategory =
        await rateWeightCategoriesService.deleteRateWeightCategories(
          id as string,
        );
      const resDoc = responseHandler(
        200,
        "Rate weight categories deleted successfully",
        deletedCategory,
      );
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  }
}
export default new RateWeightCategoriesController();
