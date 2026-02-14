// transaction.repository.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class TransactionRepository {
  async createTransaction(data: any, tx?: any) {
    const client = tx || prisma;
    return await client.transaction.create({
      data,
    });
  }

  async createExpenseTransaction(data: any, tx?: any) {
    const client = tx || prisma;

    return await client.transaction.create({
      data: {
        ...data,
        method: data.method ? String(data.method) : null,
        dailyCost: data.dailyCost ? String(data.dailyCost) : null,
        expenseCategory: data.expenseCategory
          ? String(data.expenseCategory)
          : null,
      },
    });
  }

  async getTransactionsByUser(userId: number) {
    return await prisma.transaction.findMany({
      where: {
        OR: [
          //   { fromId: userId },
          //   { toId: userId }
        ],
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getTransactionById(id: string) {
    return await prisma.transaction.findUnique({
      where: { id },
    });
  }
}

export default new TransactionRepository();
