import { PrismaClient, WalletStatus, Currency } from "@prisma/client";
const prisma = new PrismaClient();

class WalletRepository {
  async createWallet(data: any, tx?: any) {
    const client = tx || prisma;
    return await client.wallet.create({
      data: {
        ...data,
        // Logic for auto-generating card details
        cardNumber: `62${Math.floor(Math.random() * 10000000000000)}`,
        expiryDate: "12/29",
        cvv: "123",
      },
    });
  }

  async getWalletsByUser(userId: number) {
    return await prisma.wallet.findMany({
      where: { userId },
      include: { transactions: { take: 5, orderBy: { createdAt: "desc" } } },
    });
  }

  async getWalletById(id: string) {
    return await prisma.wallet.findUnique({
      where: { id },
      include: { transactions: true },
    });
  }

  async updateStatus(id: string, status: WalletStatus) {
    return await prisma.wallet.update({
      where: { id },
      data: { status },
    });
  }
}

export default new WalletRepository();
