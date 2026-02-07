import { Request, Response, NextFunction } from 'express';
import catchError from '../errors/catchError';
import prisma from '../../config/prismadatabase';

// Generic transaction wrapper for Prisma/PostgreSQL

import { Prisma, PrismaClient } from '@prisma/client';
import { parsePostgreSQLError } from '../../utils/errorParser';
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
    const timeout = parseInt(process.env.TRANSACTION_TIMEOUT_MS || '10000', 10); // transaction timeout

    try {
      await prisma.$transaction(async (tx) => {
        await handler(req, res, next, tx);
      }, { timeout });
      return;
    } catch (error) {
      console.error(`Transaction failed:`, error);
      const parsedError = parsePostgreSQLError(error);
      next(parsedError);
    }
  });
};

export default withTransaction;
