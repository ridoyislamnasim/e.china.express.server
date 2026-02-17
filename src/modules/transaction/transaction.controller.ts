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

      const transaction = await transactionService.createTransaction(
        payload,
        tx,
      );

      const resDoc = responseHandler(
        201,
        "Transaction completed successfully",
        transaction,
      );

      res.status(resDoc.statusCode).json(resDoc);
    },
  );

  createExpenseTransaction = catchError(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = getAuthUserId(req);

      const payload = {
        ...req.body,
        fromId: userId,
        toId: userId, // self expense
      };

      const transaction =
        await transactionService.createExpenseTransaction(payload);

      const resDoc = responseHandler(
        201,
        "Expense created successfully",
        transaction,
      );

      res.status(resDoc.statusCode).json(resDoc);
    },
  );

  getExpenses = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    try {
      const result = await transactionService.getExpenses(page, limit);
      res.status(200).json({
        statusCode: 200,
        message: "Expenses retrieved successfully",
        ...result,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ statusCode: 500, message: "Server error" });
    }
  };

  getUserTransactions = catchError(async (req: Request, res: Response) => {
    const userId = getAuthUserId(req);

    const transactions = await transactionService.getUserTransactions(userId);

    const resDoc = responseHandler(200, "Transactions retrieved", transactions);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSingleTransaction = catchError(async (req: Request, res: Response) => {
    const id = req.params.id;

    const transaction = await transactionService.getSingleTransaction(id);

    const resDoc = responseHandler(200, "Transaction retrieved", transaction);
    res.status(resDoc.statusCode).json(resDoc);
  });
}

export default new TransactionController();
