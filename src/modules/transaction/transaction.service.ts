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

  // async createCurrencyTransaction(payload: any, tx: any) {
  //   const {
  //     fromId,
  //     toId,
  //     currency,
  //     buyRate,
  //     sellRate,
  //     amount,
  //     note,
  //     category,
  //   } = payload;

  //   // Validate required fields
  //   if (!fromId || !toId) {
  //     throw new BadRequestError("Sender and recipient are required");
  //   }

  //   if (!amount || amount <= 0) {
  //     throw new BadRequestError("Valid amount is required");
  //   }

  //   // Get sender's wallet (assuming users have a default wallet)
  //   const senderWallet = await tx.wallet.findFirst({
  //     where: {
  //       userId: fromId,
  //       // You might want to specify which wallet type/currency
  //       // currency: currency // If wallets are currency-specific
  //     },
  //   });

  //   if (!senderWallet) {
  //     throw new NotFoundError("Sender wallet not found");
  //   }

  //   // Check if sender has sufficient balance
  //   // if (Number(senderWallet.balance) < Number(amount)) {
  //   //   throw new BadRequestError("Insufficient balance");
  //   // }

  //   // Get recipient's wallet
  //   const recipientWallet = await tx.wallet.findFirst({
  //     where: {
  //       userId: toId,
  //       // currency: currency // If wallets are currency-specific
  //     },
  //   });

  //   if (!recipientWallet) {
  //     throw new NotFoundError("Recipient wallet not found");
  //   }

  //   // Calculate total amount in BDT
  //   const totalAmount =
  //     Number(amount) * Number(buyRate) + Number(amount) * Number(sellRate);

  //   // Perform the transfer in a transaction
  //   // Update sender's wallet (decrement)
  //   await tx.wallet.update({
  //     where: { id: senderWallet.id },
  //     data: {
  //       balance: { decrement: Number(amount) },
  //     },
  //   });

  //   // Update recipient's wallet (increment)
  //   await tx.wallet.update({
  //     where: { id: recipientWallet.id },
  //     data: {
  //       balance: { increment: Number(amount) },
  //     },
  //   });

  //   // Create the transaction record
  //   return await tx.transaction.create({
  //     data: {
  //       fromId,
  //       toId,
  //       category: category || "CURRENCY",
  //       currency,
  //       buyRate: Number(buyRate),
  //       sellRate: Number(sellRate),
  //       amount: Number(amount),
  //       totalAmount: totalAmount.toString(),
  //       note,
  //     },
  //   });
  // }

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

    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      throw new BadRequestError("Valid amount is required");
    }

    // Get sender's wallet
    const senderWallet = await tx.wallet.findFirst({
      where: { userId: fromId },
    });

    if (!senderWallet) {
      throw new NotFoundError("Sender wallet not found");
    }

    // Fix: parse balance to float for reliable comparison
    const senderBalance = parseFloat(senderWallet.balance.toString());

    // if (senderBalance < parsedAmount) {
    //   throw new BadRequestError(
    //     `Insufficient balance. Available: ${senderBalance}, Required: ${parsedAmount}`,
    //   );
    // }

    // Get recipient's wallet
    const recipientWallet = await tx.wallet.findFirst({
      where: { userId: toId },
    });

    if (!recipientWallet) {
      throw new NotFoundError("Recipient wallet not found");
    }

    // Fix: totalAmount = amount * buyRate (cost in BDT to buy foreign currency)
    const parsedBuyRate = parseFloat(buyRate) || 0;
    const parsedSellRate = parseFloat(sellRate) || 0;
    const totalAmount = parsedAmount * parsedBuyRate;

    // Decrement sender's balance
    await tx.wallet.update({
      where: { id: senderWallet.id },
      data: {
        balance: { decrement: parsedAmount },
      },
    });

    // Increment recipient's balance
    await tx.wallet.update({
      where: { id: recipientWallet.id },
      data: {
        balance: { increment: parsedAmount },
      },
    });

    // Create the transaction record
    return await tx.transaction.create({
      data: {
        fromId,
        toId,
        category: category || "CURRENCY",
        currency,
        buyRate: parsedBuyRate,
        sellRate: parsedSellRate,
        amount: parsedAmount,
        totalAmount: totalAmount.toString(),
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
