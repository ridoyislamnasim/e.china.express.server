// AuthController (TypeScript version)
import { Request, Response, NextFunction } from 'express';
import { responseHandler } from '../../utils/responseHandler';
import { RateFreightService } from './rate.freight.service';
import rateRepository from './rate.freight.repository';
import catchError from '../../middleware/errors/catchError';
import withTransaction from '../../middleware/transactions/withTransaction';
import withBalkTransaction from '../../middleware/transactions/withBalkTransaction';
const rateService = new RateFreightService(rateRepository);


// id Int @id @default(autoincrement())
//   routeId      Int
//   cargoType    CargoType // DG or NON_DG
//   shipmentMode ShipmentMode // FCL or LCL


//   // LCL
//   cbm Decimal? @db.Decimal(10, 2)

//   // FCL
//   containerId Int?

class RateFreightController {
  createRateFreight = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { price, routeId, cargoType, shippingMethodId, shipmentMode,containerId, cbm } = req.body;
      const payload = {
        price: Number(price),
        routeId: Number(routeId),
        cargoType: cargoType,
        shippingMethodId: Number(shippingMethodId),
        shipmentMode: shipmentMode,
        cbm: cbm ? Number(cbm) : 0,
        containerId: Number(containerId)
      };  
      const shippingMethod = await rateService.createRateFreight(payload);
      const resDoc = responseHandler(201, 'RateFreight created successfully', shippingMethod);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };


  getAllRateFreight = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rates = await rateService.getAllRateFreight();
      const resDoc = responseHandler(200, 'RateFreights retrieved successfully', rates);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  }

  findRateFreightByCriteria = catchError(async (req: Request, res: Response, next: NextFunction) => {
    console.log("req.body", req.body);
    const { shipmentMode, weight, shippingMethodId } = req.body;
    const payload: any = {
      shipmentMode,
      weight,
      shippingMethodId
    };
    const rates = await rateService.findRateFreightByCriteria(payload);
    const resDoc = responseHandler(200, 'RateFreights retrieved successfully', rates);
    res.status(resDoc.statusCode).json(resDoc);
  })


  findBookingShippingRateFreight = catchError(async (req: Request, res: Response, next: NextFunction) => {
    console.log("req.body", req.body);
    const { importCountryId, exportCountryId, weight, shippingMethodId, category1688Id } = req.body;
    const payload: any = {
      importCountryId,
      exportCountryId,
      weight,
      shippingMethodId,
      category1688Id
    };
    const rates = await rateService.findBookingShippingRateFreight(payload);
    const resDoc = responseHandler(200, 'RateFreights retrieved successfully', rates);
    res.status(resDoc.statusCode).json(resDoc);
  })

  countryMethodWiseRateFreight = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { importCountryId, exportCountryId, shippingMethodId } = req.query;
    const payload: any = {
      importCountryId,
      exportCountryId,
      shippingMethodId
    };
    const rates = await rateService.countryMethodWiseRateFreight(payload);
    const resDoc = responseHandler(200, 'Country Method Wise RateFreights retrieved successfully', rates);
    res.status(resDoc.statusCode).json(resDoc);
  })

  bulkAdjustRateFreight = withBalkTransaction(async (req: Request, res: Response, next: NextFunction, transaction: any) => {
    const { adjustIsPercent, adjustMode, amount, routeId, applyToNonEmptyOnly, exportCountryId, importCountryId, shippingMethodId } = req.body;
    const payload: any = {
      adjustIsPercent,
      adjustMode,
      amount,
      routeId,
      applyToNonEmptyOnly,
      exportCountryId,
      importCountryId,
      shippingMethodId
    };
    const result = await rateService.bulkAdjustRateFreight(payload, transaction);
    const resDoc = responseHandler(200, 'Bulk RateFreight Adjustment completed successfully', result);
    res.status(resDoc.statusCode).json(resDoc);
  });

  findShippingRateFreightForProduct = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const userRef = req.user?.user_info_encrypted?.id?.toString() ?? null;
    const { importCountryId, productId, topCategoryId, secondCategoryId } = req.body;
    const payload: any = {
      importCountryId,
      productId: Number(productId),
      categoryId: Number(topCategoryId),
      subCategoryId: Number(secondCategoryId),
      userRef
    };
    console.log("Finding shipping rate for product with payload:", payload);
    const rates = await rateService.findShippingRateFreightForProduct(payload);
    const resDoc = responseHandler(200, 'Shipping RateFreights for Product retrieved successfully', rates);
    res.status(resDoc.statusCode).json(resDoc);
  })

}

export default new RateFreightController();