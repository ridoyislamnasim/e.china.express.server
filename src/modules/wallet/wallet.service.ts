import { NotFoundError } from "../../utils/errors";
import { BaseService } from "../base/base.service";
import walletRepository from "./wallet.repository";
import { WalletStatus, Currency } from "@prisma/client";

export class WalletService extends BaseService<typeof walletRepository> {
  // 1. Explicitly define the repository property
  protected repository: typeof walletRepository;

  constructor(repository: typeof walletRepository) {
    super(repository);
    // 2. Assign the repository so it's accessible via 'this'
    this.repository = repository;
  }

  async createManualWallet(userId: number, payload: any, tx?: any) {
    const walletData = {
      ...payload,
      userId,
      status: "inactive", // New manual wallets start as inactive
      balance: 0,
    };
    return await this.repository.createWallet(walletData, tx);
  }

  async getWalletsByUserId(userId: number) {
    return await this.repository.getWalletsByUser(userId);
  }

  async getSingleWallet(id: string, userId: number) {
    console.log("Service - Looking for wallet:", { id, userId });

    const wallet = await this.repository.getWalletById(id);

    console.log("Service - Found wallet:", wallet);

    if (!wallet) {
      throw new NotFoundError("Wallet not found");
    }

    if (wallet.userId !== userId) {
      throw new NotFoundError("Wallet not found or unauthorized");
    }

    return wallet;
  }

  async updateWalletStatus(id: string, status: string) {
    const validStatus = status as WalletStatus;
    const wallet = await this.repository.updateStatus(id, validStatus);
    if (!wallet) throw new NotFoundError("Wallet not found");
    return wallet;
  }
}

export default new WalletService(walletRepository);
