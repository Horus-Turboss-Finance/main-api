import { BankAccount, BankFindReturnType } from "../models/bankAccount.models";
import { Transaction, TransactionFindReturnType } from "../models/transaction.models";

export async function fetchUserAccounts(userId: number): Promise<BankFindReturnType[]> {
  return await BankAccount.findAllByUserId({ userId }).catch(() => []);
}


export async function fetchUserTransactions(userId: number, limit: number): Promise<TransactionFindReturnType[]> {
  return await Transaction.findAllByUserId({ userId, limit, offset: 0 }).catch(() => []);
}

export function splitTransactions(transactions: TransactionFindReturnType[]): {
  credits: TransactionFindReturnType[],
  debits: TransactionFindReturnType[]
} {
  return {
    credits: transactions.filter(t => t.type === "credit"),
    debits: transactions.filter(t => t.type === "debit")
  };
}