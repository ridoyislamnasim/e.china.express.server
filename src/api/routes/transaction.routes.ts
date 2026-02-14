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

TransactionRoute.get("/:id", transactionController.getSingleTransaction);

export default TransactionRoute;
