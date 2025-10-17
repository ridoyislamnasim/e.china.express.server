import { Request, Response, NextFunction } from 'express';
import { parsePostgreSQLError } from '../../utils/errorParser';

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const code = err.statusCode ? err.statusCode : 500;
  const message = err.message;
console.error('Global Error Handler:', err); // Log the error for debugging
// console.error('Global Error Handler:', err.statusCode); // Log the error for debugging
//   console.error('Global Error Handler:', err.message); // Log the error for debugging

  if (err.status == undefined) {
     const parsedError = parsePostgreSQLError(err);
  console.error('Parsed Error:', parsedError); // Log the parsed error for debugging
    return res.status(code).json({
      statusCode: code,
      status: parsedError.status,
      message: parsedError.message,
      errors: parsedError.errors || {},
    });
  }else{
        res.status(code).json({
    statusCode: code,
    status: 'error',
    message,
  });        
  }

  // res.status(code).json({err, message });
};

export default globalErrorHandler;
