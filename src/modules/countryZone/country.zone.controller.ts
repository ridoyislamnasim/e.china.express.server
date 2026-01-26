// AuthController (TypeScript version)
import { Request, Response, NextFunction } from 'express';
import { CountryZoneService } from './country.zone.service';
import countryZoneRepository from './country.zone.repository';
import { responseHandler } from '../../utils/responseHandler';
import withTransaction from '../../middleware/transactions/withTransaction';
import catchError from '../../middleware/errors/catchError';
const countryZoneService = new CountryZoneService(countryZoneRepository);

class CountryZoneController {
  createCountryZone = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    try {
      const { name, zoneCode } = req.body;
      const payload = {
        name,
        zoneCode,
      };
      const countryZone = await countryZoneService.createCountryZone(payload);
      const resDoc = responseHandler(201, 'CountryZone Created successfully', countryZone);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  });

  getAllCountryZone = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const countries = await countryZoneService.getAllCountries();
      const resDoc = responseHandler(200, 'Countries retrieved successfully', countries);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };

  getCountryZoneForShipping = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const countryZone = await countryZoneService.getCountryZoneForShipping();
      const resDoc = responseHandler(200, 'CountryZone for shipping retrieved successfully', countryZone);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };

  exportCountryZoneData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const exportResult = await countryZoneService.exportCountryZoneData();
      const resDoc = responseHandler(200, 'CountryZone data exported successfully', exportResult);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };
  

  getCountryZoneWithPagination = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const payload = { page, limit };
      const countries = await countryZoneService.getCountryZoneWithPagination(payload, tx);
      const resDoc = responseHandler(200, 'Countries retrieved successfully with pagination', countries);
      res.status(resDoc.statusCode).json(resDoc);
  });

  updateCountryZone = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { name, zoneCode } = req.body;
      const payload = {
        name,
        zoneCode
      };
      // Implement update logic here using countryZoneService
      const updatedCountryZone = await countryZoneService.updateCountryZone(id, payload, tx);
      const resDoc = responseHandler(200, `CountryZone with id ${id} updated successfully`, updatedCountryZone);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  });

  getSingleZone = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id, 10);
    const countryZone = await countryZoneService.getCountryZoneById(id);
    const resDoc = responseHandler(200, 'CountryZone retrieved successfully', countryZone);
    res.status(resDoc.statusCode).json(resDoc);
  });

  deleteCountryZone = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      // Implement delete logic here using countryZoneService
      await countryZoneService.deleteCountryZone(id);
      const resDoc = responseHandler(200, `CountryZone with id ${id} deleted successfully`, null);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };
}
export default new CountryZoneController();