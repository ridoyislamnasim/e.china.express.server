// transaction.controller.ts
import { Request, Response, NextFunction } from "express";
import catchError from "../../middleware/errors/catchError";
import withTransaction from "../../middleware/transactions/withTransaction";
import { responseHandler } from "../../utils/responseHandler";
import transactionService from "./transaction.service";
import { getAuthUserId } from "../../utils/auth.helper";

class TransactionController {

  createTransaction = withTransaction(
    async (req: Request, res: Response, next: NextFunction, tx: any) => {

      const userId = getAuthUserId(req);

      const payload = {
        ...req.body,
        fromId: userId,
      };

      const transaction = await transactionService.createTransaction(payload, tx);

      const resDoc = responseHandler(
        201,
        "Transaction completed successfully",
        transaction
      );

      res.status(resDoc.statusCode).json(resDoc);
    }
  );

  getUserTransactions = catchError(
    async (req: Request, res: Response) => {

      const userId = getAuthUserId(req);

      const transactions = await transactionService.getUserTransactions(userId);

      const resDoc = responseHandler(200, "Transactions retrieved", transactions);
      res.status(resDoc.statusCode).json(resDoc);
    }
  );

  getSingleTransaction = catchError(
    async (req: Request, res: Response) => {

      const id = req.params.id;

      const transaction = await transactionService.getSingleTransaction(id);

      const resDoc = responseHandler(200, "Transaction retrieved", transaction);
      res.status(resDoc.statusCode).json(resDoc);
    }
  );
}

export default new TransactionController();
