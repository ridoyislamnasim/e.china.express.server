import { Request, Response, NextFunction } from 'express';
import catchError from '../errors/catchError';
import prisma from '../../config/prismadatabase';

// Generic transaction wrapper for Prisma/PostgreSQL

import { Prisma, PrismaClient } from '@prisma/client';
import { parsePostgreSQLError } from '../../utils/errorParser';
import { sleep } from '../../utils/date';
// import { sleep } from '../../utils/sleep'; // Utility function for retry delays

const withTransaction = (
  handler: (
    req: Request,
    res: Response,
    next: NextFunction,
    tx: Omit<PrismaClient, "$connect"|"$disconnect"|"$on"|"$transaction"|"$use"|"$extends">
  ) => Promise<any>
) => {
  return catchError(async (req: Request, res: Response, next: NextFunction) => {
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await prisma.$transaction(async (tx) => {
          await handler(req, res, next, tx);
        }, { timeout: 10000 }); // 10-second timeout
        return; // Exit loop if successful
      } catch (error) {
        if (attempt < maxRetries) {
          console.warn(`Transaction attempt ${attempt} failed. Retrying in ${retryDelay}ms...`);
          await sleep(retryDelay);
        } else {
          const parsedError = parsePostgreSQLError(error);
          next(parsedError);
        }
      }
    }
  });
};

export default withTransaction;
