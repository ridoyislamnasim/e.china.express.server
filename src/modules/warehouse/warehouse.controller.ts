import { Request, Response, NextFunction } from 'express';
import catchError from '../../middleware/errors/catchError';
import { responseHandler } from '../../utils/responseHandler';
import withTransaction from '../../middleware/transactions/withTransaction';
import WarehouseService from './warehouse.service';

class WarehouseController {
  // Create a warehouse item
  createWarehouse = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    console.log("Creating warehouse with body:", req.user, req.body);
    const payload = {
      name: req.body.name,
      totalCapacity: req.body.totalCapacity,
      location: req.body.location,
      status: req.body.status,
      countryId: req.body.countryId,
    };
    const warehouseResult = await WarehouseService.createWarehouse(payload);
    const resDoc = responseHandler(
      201,
      'Warehouse Created successfully',
      warehouseResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  // getUserAllWarehouseById = catchError(async (req: Request, res: Response) => {
  //   const userId = req.params.id;
  //   const warehouseResult = await WarehouseService.getUserAllWarehouseById(userId);
  //   const resDoc = responseHandler(200, 'Get All Warehouses', warehouseResult);
  //   res.status(resDoc.statusCode).json(resDoc);
  // });

  // // Get all warehouse items by user with calculation
  // getAllWarehouseByUser = catchError(async (req: Request, res: Response) => {
  //   console.log('Fetching all warehouses for user...', req.params);
  //   console.log('Fetching all warehouses for user...', req.query);
  //   const { userRef, coupon, productRef, inventoryRef } = req.query;
  //   const payload: any = { userRef, productRef, inventoryRef };
  //   if (coupon) {
  //     payload.coupon = coupon;
  //   }
  //   const warehouseResult = await WarehouseService.getAllWarehouseByUser(payload);
  //   const resDoc = responseHandler(
  //     200,
  //     ` ${warehouseResult?.message} `,
  //     warehouseResult?.data
  //   );
  //   res.status(resDoc.statusCode).json(resDoc);
  // });

  // getWarehouseWithPagination = catchError(async (req: Request, res: Response) => {
  //   const userId = req.query.userId as string;
  //   const payload = {
  //     userId,
  //     page: Number(req.query.page),
  //     limit: Number(req.query.limit),
  //     order: req.query.order,
  //   };
  //   const warehouse = await WarehouseService.getWarehouseWithPagination(payload);
  //   const resDoc = responseHandler(200, 'Warehouses get successfully', warehouse);
  //   res.status(resDoc.statusCode).json(resDoc);
  // });

  // getSingleWarehouse = catchError(async (req: Request, res: Response) => {
  //   const id = Number(req.params.id);
  //   const warehouseResult = await WarehouseService.getSingleWarehouse(id);
  //   const resDoc = responseHandler(201, 'Single Warehouse successfully', warehouseResult);
  //   res.status(resDoc.statusCode).json(resDoc);
  // });

  // updateWarehouse = catchError(async (req: Request, res: Response) => {
  //   const id = Number(req.params.id);
  //   const payload = {
  //     quantity: req.body.quantity,
  //     userRef: req.body.userRef,
  //     productRef: req.body.productRef,
  //     inventoryRef: req.body.inventoryRef,
  //   };
  //   await WarehouseService.updateWarehouse(id, payload);
  //   const resDoc = responseHandler(201, 'Warehouse Update successfully');
  //   res.status(resDoc.statusCode).json(resDoc);
  // });

  // Update warehouse quanity with calculation
  // updateWarehouseQuantity = catchError(async (req: Request, res: Response) => {
  //   console.log("Updating warehouse quantity...", req.params, req.query, req.body);
  //   try {
  //     const warehouseId = Number(req.params.id);
  //     const { increment, decrement, update } = req.query;
  //     let newQuantity;
  //     // Fetch the current warehouse item
  //     const currentWarehouse = await WarehouseService.getSingleWarehouse(warehouseId);
  //     console.log("Current warehouse item:", currentWarehouse);
  //     if (!currentWarehouse) {
  //       return res.status(404).json({
  //         success: false,
  //         message: 'Warehouse not found',
  //       });
  //     }
  //     if (increment === 'true') {
  //       // Increment quantity
  //       newQuantity = currentWarehouse.quantity + 1;
  //     } else if (decrement === 'true') {
  //       // Decrement quantity, ensuring it doesn't drop below 1
  //       newQuantity = Math.max(1, currentWarehouse.quantity - 1);
  //     } else if (update === 'true') {
  //       // Update with a specific value from body
  //       const { quantity } = req.body;
  //       if (!quantity || quantity < 1) {
  //         return res.status(400).json({
  //           success: false,
  //           message: 'Invalid quantity provided',
  //         });
  //       }
  //       newQuantity = Number(quantity);
  //     } else {
  //       return res.status(400).json({
  //         success: false,
  //         message: 'Invalid operation, specify increment, decrement, or update',
  //       });
  //     }
  //     // Update the warehouse quantity in the database
  //     const updatedWarehouse = await WarehouseService.updateWarehouseQuantity(
  //       Number(warehouseId),
  //       newQuantity
  //     );
  //     return res.status(200).json({
  //       success: true,
  //       data: updatedWarehouse,
  //     });
  //   } catch (error: any) {
  //     res.status(500).json({
  //       success: false,
  //       message: error.message,
  //     });
  //   }
  // });

  // // Delete a warehouse item
  // deleteWarehouse = catchError(async (req: Request, res: Response) => {
  //   const id = req.params.id;
  //   await WarehouseService.deleteWarehouse(id);
  //   const resDoc = responseHandler(200, 'Warehouse Deleted successfully');
  //   res.status(resDoc.statusCode).json(resDoc);
  // });


  // // Buy Now Warehouse
  // createBuyNowWarehouse = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
  //   const payload = {
  //     quantity: Number(req.body.quantity) || 1,
  //     userRef: req.body.userRef,
  //     productRef: req.body.productRef,
  //     inventoryRef: Number(req.body.inventoryRef),
  //   };
  //   const warehouseResult = await WarehouseService.createBuyNowWarehouse(payload);
  //   const resDoc = responseHandler(
  //     201,
  //     'Warehouse Created successfully',
  //     warehouseResult
  //   );
  //   res.status(resDoc.statusCode).json(resDoc);
  // });

  // getAllBuyNowWarehouseByUser = catchError(async (req: Request, res: Response) => {
  //   console.log('Fetching all warehouses for user...', req.params);
  //   console.log('Fetching all warehouses for user...', req.query);
  //   const { userRef, coupon, productRef, inventoryRef } = req.query;
  //   const payload: any = { userRef, productRef, inventoryRef };
  //   if (coupon) {
  //     payload.coupon = coupon;
  //   }
  //   const warehouseResult = await WarehouseService.getAllBuyNowWarehouseByUser(payload);
  //   const resDoc = responseHandler(
  //     200,
  //     ` ${warehouseResult?.message} `,
  //     warehouseResult?.data
  //   );
  //   res.status(resDoc.statusCode).json(resDoc);
  // });
  // // Update warehouse quanity with calculation
  // updateBuyNowWarehouseQuantity = catchError(async (req: Request, res: Response) => {
  //   console.log("Updating warehouse quantity...", req.params, req.query, req.body);
  //   try {
  //     const warehouseId = Number(req.params.id);
  //     const { increment, decrement, update } = req.query;
  //     let newQuantity = 0;
  //     // Fetch the current warehouse item
  //     const currentWarehouse = await WarehouseService.getSingleBuyNowWarehouse(warehouseId);
  //     console.log("Current warehouse item:", currentWarehouse);
  //     if (!currentWarehouse) {
  //       return res.status(404).json({
  //         success: false,
  //         message: 'Warehouse not found',
  //       });
  //     }
  //     if (increment === 'true') {
  //       // Increment quantity
  //       newQuantity = (currentWarehouse.quantity ?? 0) + 1;
  //     } else if (decrement === 'true') {
  //       // Decrement quantity, ensuring it doesn't drop below 1
  //       newQuantity = Math.max(1, (currentWarehouse.quantity ?? 0) - 1);
  //     } else if (update === 'true') {
  //       // Update with a specific value from body
  //       const { quantity } = req.body;
  //       if (!quantity || quantity < 1) {
  //         return res.status(400).json({
  //           success: false,
  //           message: 'Invalid quantity provided',
  //         });
  //       }
  //       newQuantity = Number(quantity);
  //     } else {
  //       return res.status(400).json({
  //         success: false,
  //         message: 'Invalid operation, specify increment, decrement, or update',
  //       });
  //     }
  //     // Update the warehouse quantity in the database
  //     const updatedWarehouse = await WarehouseService.updateBuyNowWarehouseQuantity(
  //       Number(warehouseId),
  //       newQuantity
  //     );
  //     return res.status(200).json({
  //       success: true,
  //       data: updatedWarehouse,
  //     });
  //   } catch (error: any) {
  //     res.status(500).json({
  //       success: false,
  //       message: error.message,
  //     });
  //   }
  // });
}

export default new WarehouseController();
