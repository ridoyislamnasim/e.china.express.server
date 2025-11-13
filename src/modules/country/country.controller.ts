// AuthController (TypeScript version)
import { Request, Response, NextFunction } from 'express';
import { CountryService } from './country.service';
import countryRepository from './country.repository';
import { responseHandler } from '../../utils/responseHandler';
const countryService = new CountryService(countryRepository);

export const createCountry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, warehouseId, status, isoCode } = req.body;
        const payload = {
      name,
      warehouseId: warehouseId ?? null, // Set to null if undefined
      status,
      isoCode,
    };
    const country = await countryService.createCountry(payload);
    const resDoc = responseHandler(201, 'User Created successfully', country);
    res.status(resDoc.statusCode).json(resDoc);
  } catch (error) {
    next(error);
  }
};

