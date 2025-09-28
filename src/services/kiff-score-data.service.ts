import { standardDeviation, mean } from "../utils/math/stats";
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


export function detectOutlierSpending(transactions: TransactionFindReturnType[], threshold = 3): boolean {
  if (transactions.length < 2) return false;

  const amounts = transactions.map(t => Math.abs(Number((t.amount))));
  const avg = mean(amounts);
  const stdDev = standardDeviation(amounts);
  const lastTransaction = transactions[0];

  // Si la dernière transaction est > X écart-types de la moyenne, c'est suspect
  return stdDev > 0 && Math.abs(Number(lastTransaction.amount) - avg) > threshold * stdDev;
}

export function computeDataConfidence(transactions: TransactionFindReturnType[]): number {
  const uniqueDays = new Set(transactions.map(t => new Date(t.date).toISOString().slice(0, 10))).size;
  const uniqueCategories = new Set(transactions.map(t => t.categoryId)).size;

  let score = 0;
  if (transactions.length > 30) score += 0.4;
  if (uniqueCategories > 5) score += 0.3;
  if (uniqueDays > 20) score += 0.3;

  return Math.min(1, score);
}