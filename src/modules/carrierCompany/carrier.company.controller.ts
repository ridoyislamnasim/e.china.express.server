// AuthController (TypeScript version)
import { Request, Response, NextFunction } from "express";
import { CarrierCompanyService } from "./carrier.company.service";
import carrierCompanyRepository from "./carrier.company.repository";
import { responseHandler } from "../../utils/responseHandler";
import withTransaction from "../../middleware/transactions/withTransaction";
import catchError from "../../middleware/errors/catchError";
const carrierCompanyService = new CarrierCompanyService(
  carrierCompanyRepository,
);

class CarrierCompanyController {
  createCarrierCompany = withTransaction(
    async (req: Request, res: Response, next: NextFunction, tx: any) => {
      try {
        const {
          name,
          shortName,
          code,
          carrierType,
          scacCode,
          iataCode,
          icaoCode,
          logoUrl,
          description,
          status,
        } = req.body;
        const payload = {
          name,
          shortName,
          code,
          carrierType,
          scacCode,
          iataCode,
          icaoCode,
          logoUrl,
          description,
          status,
        };

        // Accept files via multipart/form-data (upload middleware puts files on req.files)
        const files = (req as any).files;
        const carrierCompany = await carrierCompanyService.createCarrierCompany(
          payload,
          files,
        );
        const resDoc = responseHandler(
          201,
          "CarrierCompany Created successfully",
          carrierCompany,
        );
        res.status(resDoc.statusCode).json(resDoc);
      } catch (error) {
        next(error);
      }
    },
  );

  getAllCarrierCompanys = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const payload = {
        carrierType: req.query.carrierType as string | undefined,
      };
      const carrierCompanys =
        await carrierCompanyService.getAllCarrierCompanys(payload);
      const resDoc = responseHandler(
        200,
        "CarrierCompanys retrieved successfully",
        carrierCompanys,
      );
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };

  getCarrierCompanyWithPagination = withTransaction(
    async (req: Request, res: Response, next: NextFunction, tx: any) => {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const payload = { page, limit };
      const countries =
        await carrierCompanyService.getCarrierCompanyWithPagination(
          payload,
          tx,
        );
      const resDoc = responseHandler(
        200,
        "Countries retrieved successfully with pagination",
        countries,
      );
      res.status(resDoc.statusCode).json(resDoc);
    },
  );

  updateCarrierCompany = withTransaction(
    async (req: Request, res: Response, next: NextFunction, tx: any) => {
      try {
        const id = parseInt(req.params.id as string, 10);
        const {
          name,
          shortName,
          code,
          carrierType,
          scacCode,
          iataCode,
          icaoCode,
          logoUrl,
          description,
          status,
        } = req.body;
        const payload = {
          name,
          shortName,
          code,
          carrierType,
          scacCode,
          iataCode,
          icaoCode,
          logoUrl,
          description,
          status,
        };
        // If files are provided, pass them to the service so it can upload and update logoUrl
        const files = (req as any).files;
        const updatedCarrierCompany =
          await carrierCompanyService.updateCarrierCompany(
            id,
            payload,
            tx,
            files,
          );
        const resDoc = responseHandler(
          200,
          `CarrierCompany with id ${id} updated successfully`,
          updatedCarrierCompany,
        );
        res.status(resDoc.statusCode).json(resDoc);
      } catch (error) {
        next(error);
      }
    },
  );

  getSingleCarrierCompany = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = parseInt(req.params.id as string, 10);
      const carrierCompany =
        await carrierCompanyService.getCarrierCompanyById(id);
      const resDoc = responseHandler(
        200,
        "CarrierCompany retrieved successfully",
        carrierCompany,
      );
      res.status(resDoc.statusCode).json(resDoc);
    },
  );

  deleteCarrierCompany = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = parseInt(req.params.id as string, 10);
      // Implement delete logic here using carrierCompanyService
      await carrierCompanyService.deleteCarrierCompany(id);
      const resDoc = responseHandler(
        200,
        `CarrierCompany with id ${id} deleted successfully`,
        null,
      );
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      next(error);
    }
  };
}
export default new CarrierCompanyController();
