// transaction.types.ts
export enum TransactionCategory {
  LOCAL = "LOCAL",
  CURRENCY = "CURRENCY",
  RUPEE = "RUPEE",
  EXPENSE = "EXPENSE"
}

export interface CreateTransactionDTO {
  category: TransactionCategory;
  fromWalletId: string;
  toWalletId: string;
  amount: number;
  note?: string;
  method?: string;
  currency?: string;
  buyRate?: number;
  sellRate?: number;
}

export interface TransactionFilters {
  page: number;
  limit: number;
  category?: string;
}

export interface TransactionResponse {
  id: string;
  category: TransactionCategory;
  fromId: number;
  toId: number;
  amount: number;
  method: string | null;
  note: string | null;
  currency: string | null;
  buyRate: number | null;
  sellRate: number | null;
  createdAt: Date;
  updatedAt: Date;
  sender?: {
    id: number;
    name: string | null;
    email: string;
  };
  receiver?: {
    id: number;
    name: string | null;
    email: string;
  };
}