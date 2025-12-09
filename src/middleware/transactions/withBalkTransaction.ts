import { Request, Response, NextFunction } from 'express';
import catchError from '../errors/catchError';
import prisma from '../../config/prismadatabase';

import { Prisma, PrismaClient } from '@prisma/client';
import { parsePostgreSQLError } from '../../utils/errorParser';
import { sleep } from '../../utils/date'; 

export type TransactionClient = Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">;

const withBalkTransaction = (
  handler: (
    req: Request,
    res: Response,
    next: NextFunction,
    tx: TransactionClient
  ) => Promise<any>
) => {
  return catchError(async (req: Request, res: Response, next: NextFunction) => {
    const maxRetries = 3;
    const retryDelay = 1000;
    const transactionTimeout = 30000;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await prisma.$transaction(async (tx) => {
          await handler(req, res, next, tx);
        }, {
          timeout: transactionTimeout
        });
        return;
      } catch (error) {
        console.error(`Transaction attempt ${attempt} failed:`, error);

        if (attempt < maxRetries) {
          console.warn(`Transaction attempt ${attempt} failed. Retrying in ${retryDelay}ms...`);
          await sleep(retryDelay);
        } else {
          const parsedError = parsePostgreSQLError(error);
          if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2028') {
            }
          }
          next(parsedError);
          return;
        }
      }
    }
  });
};

export default withBalkTransaction;