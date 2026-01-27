// AuthController (TypeScript version)
import { Request, Response, NextFunction } from 'express';
import { ContainerService } from './container.service';
import containerRepository from './container.repository';
import { responseHandler } from '../../utils/responseHandler';
import withTransaction from '../../middleware/transactions/withTransaction';
import catchError from '../../middleware/errors/catchError';
const containerService = new ContainerService(containerRepository);

class ContainerController {
  createContainer = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    try {

      const { name, code, description, lengthFt, heightFt, widthFt, internalVolumeCbm, maxPayloadKg, tareWeightKg, containerClass, isReefer, isHazmatAllowed, isActive } = req.body;
      const payload = {
        name, code, description, lengthFt, heightFt, widthFt, internalVolumeCbm, maxPayloadKg, tareWeightKg, containerClass, isReefer, isHazmatAllowed, isActive
      };
      const container = await containerService.createContainer(payload);
      const resDoc = responseHandler(201, 'Container Created successfully', container);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  });

  getAllContainers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const containers = await containerService.getAllContainers();
      const resDoc = responseHandler(200, 'Containers retrieved successfully', containers);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };


  

  getContainerWithPagination = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const payload = { page, limit };
      const countries = await containerService.getContainerWithPagination(payload, tx);
      const resDoc = responseHandler(200, 'Countries retrieved successfully with pagination', countries);
      res.status(resDoc.statusCode).json(resDoc);
  });

  updateContainer = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { name, code, description, lengthFt, heightFt, widthFt, internalVolumeCbm, maxPayloadKg, tareWeightKg, containerClass, isReefer, isHazmatAllowed, isActive } = req.body;
      const payload = {
        name, code, description, lengthFt, heightFt, widthFt, internalVolumeCbm, maxPayloadKg, tareWeightKg, containerClass, isReefer, isHazmatAllowed, isActive
      };
      // Implement update logic here using containerService
      const updatedContainer = await containerService.updateContainer(id, payload, tx);
      const resDoc = responseHandler(200, `Container with id ${id} updated successfully`, updatedContainer);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  });

  getSingleContainer = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id, 10);
    const container = await containerService.getContainerById(id);
    const resDoc = responseHandler(200, 'Container retrieved successfully', container);
    res.status(resDoc.statusCode).json(resDoc);
  });

  deleteContainer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      // Implement delete logic here using containerService
      await containerService.deleteContainer(id);
      const resDoc = responseHandler(200, `Container with id ${id} deleted successfully`, null);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };
}
export default new ContainerController();