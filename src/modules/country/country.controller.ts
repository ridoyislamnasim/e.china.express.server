// AuthController (TypeScript version)
import { Request, Response, NextFunction } from 'express';
import { CountryService } from './country.service';
import countryRepository from './country.repository';
import { responseHandler } from '../../utils/responseHandler';
import withTransaction from '../../middleware/transactions/withTransaction';
const countryService = new CountryService(countryRepository);

class CountryController {
  createCountry = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    try {
      const { name, status, isoCode, ports, countryZoneId, isShippingCountry,isFreight } = req.body;
      const payload = {
        name,
        status,
        isoCode,
        ports,
        countryZoneId,
        isShippingCountry,
        isFreight,
      };
      // Pass the transaction client down to the service so all DB ops are contained in the same transaction
      const country = await countryService.createCountry(payload, tx);
      const resDoc = responseHandler(201, 'Country Created successfully', country);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  });

  getAllCountry = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const countries = await countryService.getAllCountries();
      const resDoc = responseHandler(200, 'Countries retrieved successfully', countries);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };

  getCountryForShipping = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const country = await countryService.getCountryForShipping();
      const resDoc = responseHandler(200, 'Country for shipping retrieved successfully', country);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };

  exportCountryData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const exportResult = await countryService.exportCountryData();
      const resDoc = responseHandler(200, 'Country data exported successfully', exportResult);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };

  getAllPorts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Normalize query param which may be string | string[] | undefined
      const portTypeRaw = req.query.portType;
      const portType = Array.isArray(portTypeRaw) ? portTypeRaw[0] : portTypeRaw;
      const payload: any = {};
      if (typeof portType === 'string' && portType.trim().length > 0) {
        payload.portType = portType.trim();
      }

      const ports = await countryService.getAllPorts(payload);
      const resDoc = responseHandler(200, 'Ports retrieved successfully', ports);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };
  

  getCountryWithPagination = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const payload = { page, limit };
      const countries = await countryService.getCountryWithPagination(payload, tx);
      const resDoc = responseHandler(200, 'Countries retrieved successfully with pagination', countries);
      res.status(resDoc.statusCode).json(resDoc);
  });

  updateCountry = withTransaction(async (req: Request, res: Response, next: NextFunction, tx: any) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { name, status, isoCode, ports, countryZoneId, isShippingCountry, isFreight } = req.body;
      const payload = {
        name,
        status,
        isoCode,
        ports,
        countryZoneId,
        isShippingCountry,
        isFreight,
      };
      // Implement update logic here using countryService
      const updatedCountry = await countryService.updateCountry(id, payload, tx);
      const resDoc = responseHandler(200, `Country with id ${id} updated successfully`, updatedCountry);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  });

  deleteCountry = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      // Implement delete logic here using countryService
      await countryService.deleteCountry(id);
      const resDoc = responseHandler(200, `Country with id ${id} deleted successfully`, null);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };
}
export default new CountryController();