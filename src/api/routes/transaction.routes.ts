// routes/transaction.route.ts
import { Router } from "express";
import jwtAuth from "../../middleware/auth/jwtAuth";
import transactionController from "../../modules/transaction/transaction.controller";

const TransactionRoute = Router();

// Secure all routes
TransactionRoute.use(jwtAuth());

TransactionRoute.route("/")
  .post(transactionController.createTransaction)
  .get(transactionController.getUserTransactions);

TransactionRoute.route("/currency").post(
  transactionController.createCurrencyTransaction,
);

TransactionRoute.post(
  "/expense",
  transactionController.createExpenseTransaction,
);
TransactionRoute.get("/expenses", transactionController.getExpenses);

TransactionRoute.get("/:id", transactionController.getSingleTransaction);

export default TransactionRoute;
