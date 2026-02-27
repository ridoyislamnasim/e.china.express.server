// transaction.service.ts
import prisma from "../../config/prismadatabase";
import { TransactionCategory } from "../../types/transaction";
import { NotFoundError, BadRequestError } from "../../utils/errors";
import transactionRepository from "./transaction.repository";

export class TransactionService {
  async createTransaction(payload: any, tx: any) {
    const { fromWalletId, toWalletId, amount } = payload;

    return await tx.transaction.create({
      data: payload,
    });
  }

  async createCurrencyTransaction(payload: any, tx: any) {
    const {
      fromId,
      toId,
      currency,
      buyRate,
      sellRate,
      amount,
      note,
      category,
    } = payload;

    // Validate required fields
    if (!fromId || !toId) {
      throw new BadRequestError("Sender and recipient are required");
    }

    if (!amount || amount <= 0) {
      throw new BadRequestError("Valid amount is required");
    }

    // Get sender's wallet (assuming users have a default wallet)
    const senderWallet = await tx.wallet.findFirst({
      where: {
        userId: fromId,
        // You might want to specify which wallet type/currency
        // currency: currency // If wallets are currency-specific
      },
    });

    if (!senderWallet) {
      throw new NotFoundError("Sender wallet not found");
    }

    // Check if sender has sufficient balance
    // if (Number(senderWallet.balance) < Number(amount)) {
    //   throw new BadRequestError("Insufficient balance");
    // }

    // Get recipient's wallet
    const recipientWallet = await tx.wallet.findFirst({
      where: {
        userId: toId,
        // currency: currency // If wallets are currency-specific
      },
    });

    if (!recipientWallet) {
      throw new NotFoundError("Recipient wallet not found");
    }
    const transferAmount = Number(amount);

    await tx.wallet.update({
      where: { id: senderWallet.id },
      data: {
        balance: senderWallet.balance - transferAmount,
      },
    });

    await tx.wallet.update({
      where: { id: recipientWallet.id },
      data: {
        balance: recipientWallet.balance + transferAmount,
      },
    });

    return await tx.transaction.create({
      data: {
        fromId,
        toId,
        category: category || "CURRENCY",
        currency,
        buyRate: Number(buyRate),
        sellRate: Number(sellRate),
        amount: Number(amount),
        note,
      },
    });
  }

  async createExpenseTransaction(payload: any) {
    const { amount } = payload;

    if (!amount || Number(amount) <= 0) {
      throw new BadRequestError("Invalid amount");
    }

    return await transactionRepository.createTransaction({
      ...payload,
      amount: Number(amount),
      category: "EXPENSE", // enforce category
    });
  }

  async getExpenses(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [total, transactions] = await Promise.all([
      prisma.transaction.count({
        where: { category: TransactionCategory.EXPENSE },
      }),
      prisma.transaction.findMany({
        where: { category: TransactionCategory.EXPENSE },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: transactions,
    };
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
