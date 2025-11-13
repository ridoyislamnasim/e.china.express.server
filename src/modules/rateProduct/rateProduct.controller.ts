// AuthController (TypeScript version)
import { Request, Response, NextFunction } from 'express';
import { responseHandler } from '../../utils/responseHandler';
import { RatePorductService } from './rateProduct.service';
import ratePorductRepository from './rateProduct.repository';
const rateProductService = new RatePorductService(ratePorductRepository);

export const createRateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryName, categoryShCode, categoryDescription, subCategoryName, subCategoryShCode, subCagetoryDescription, subHeadingName, subHeadingShCode, subHeadingDescription, productName, productShCode, status } = req.body;
    const payload = {
      productName,
      productShCode,
      status,
      // Include additional options
      categoryName: categoryName ?? null,
      categoryShCode: categoryShCode ?? null,
      categoryDescription: categoryDescription ?? null,
      subCategoryName: subCategoryName ?? null,
      subCategoryShCode: subCategoryShCode ?? null,
      subCagetoryDescription: subCagetoryDescription ?? null,
      subHeadingName: subHeadingName ?? null,
      subHeadingShCode: subHeadingShCode ?? null,
      subHeadingDescription: subHeadingDescription ?? null,
    };
    const shippingMethod = await rateProductService.createRateProduct(payload);
    const resDoc = responseHandler(201, 'Rate weight categories created successfully', shippingMethod);
    res.status(resDoc.statusCode).json(resDoc);
  } catch (error) {
    next(error);
  }
};

