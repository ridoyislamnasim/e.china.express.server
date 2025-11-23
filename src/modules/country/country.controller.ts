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
      const { name, status, isoCode, ports, zone } = req.body;
      const payload = {
        name,
        status,
        isoCode,
        ports,
        zone,
      };
      const country = await countryService.createCountry(payload);
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
      const { name, status, isoCode, ports, zone } = req.body;
      const payload = {
        name,
        status,
        isoCode,
        ports,
        zone,
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