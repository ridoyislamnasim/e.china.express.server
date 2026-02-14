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

  async createExpenseTransaction(data: any) {
    return await prisma.transaction.create({
      data,
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
