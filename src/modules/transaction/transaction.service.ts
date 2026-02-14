// transaction.service.ts
import { NotFoundError, BadRequestError } from "../../utils/errors";
import transactionRepository from "./transaction.repository";

export class TransactionService {

  async createTransaction(payload: any, tx: any) {

    const {
      fromId,
      toId,
      amount,
      category,
      buyRate,
      sellRate
    } = payload;

    if (!toId) throw new BadRequestError("Receiver required");

    if (amount <= 0) throw new BadRequestError("Invalid amount");

    // Deduct sender balance
    const sender = await tx.user.findUnique({ where: { id: fromId } });
    if (!sender) throw new NotFoundError("Sender not found");

    if (sender.balance < amount)
      throw new BadRequestError("Insufficient balance");

    await tx.user.update({
      where: { id: fromId },
      data: { balance: { decrement: amount } },
    });

    await tx.user.update({
      where: { id: toId },
      data: { balance: { increment: amount } },
    });

    return await transactionRepository.createTransaction(payload, tx);
  }

  async getUserTransactions(userId: number) {
    return await transactionRepository.getTransactionsByUser(userId);
  }

  async getSingleTransaction(id: string) {
    const transaction = await transactionRepository.getTransactionById(id);
    if (!transaction) throw new NotFoundError("Transaction not found");
    return transaction;
  }
}

export default new TransactionService();
