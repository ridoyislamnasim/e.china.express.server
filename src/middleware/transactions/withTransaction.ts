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
    const maxRetries = parseInt(process.env.TRANSACTION_MAX_RETRIES || '5', 10);
    const baseDelay = parseInt(process.env.TRANSACTION_RETRY_DELAY_MS || '500', 10); // base delay in ms
    const timeout = parseInt(process.env.TRANSACTION_TIMEOUT_MS || '10000', 10); // transaction timeout

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await prisma.$transaction(async (tx) => {
          await handler(req, res, next, tx);
        }, { timeout });
        return; // Exit loop if successful
      } catch (error) {
        console.error(`Transaction attempt ${attempt} failed:`, error);
        if (attempt < maxRetries) {
          // exponential backoff with jitter
          const backoff = baseDelay * Math.pow(2, attempt - 1);
          const jitter = Math.floor(Math.random() * 100);
          const wait = backoff + jitter;
          console.warn(`Transaction attempt ${attempt} failed. Retrying in ${wait}ms...`);
          await sleep(wait);
        } else {
          const parsedError = parsePostgreSQLError(error);
          next(parsedError);
        }
      }
    }
  });
};

export default withTransaction;
