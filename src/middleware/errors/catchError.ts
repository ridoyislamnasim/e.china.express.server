import { Request, Response, NextFunction } from 'express';
import { parsePostgreSQLError } from '../../utils/errorParser';

const catchError = (controller: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res, next);
    } catch (err) {
      // console.log("Error while ", err);
      // next(err);
      // console.error("Error caught in catchError middleware:", err);
            const parsedError = parsePostgreSQLError(err);
            next(parsedError);
    }
  };
};

export default catchError;
