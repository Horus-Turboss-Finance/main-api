import { handleOnlyDataCore } from "../utils/handleCoreResponse";
import { validateResourcesOwnership } from "../utils/validation";
import { HTTP_CODE } from "../middleware/responseException";
import { Transaction } from "../models/transaction.models";
import { CoreResponse } from "../types/@types.core";
import { BankAccount } from "../models/bankAccount.models";

/**
 * Récupère les transactions récentes d'un utilisateur
 * Supporte la pagination (limit, offset).
 */
export const getTransactions = async ({
  userId,
  limit = 50,
  offset = 0,
}: {
  userId: number;
  limit?: number;
  offset?: number;
}): CoreResponse<string | Awaited<ReturnType<typeof Transaction.findAllByUserId>>> => {
  return handleOnlyDataCore(
    () => Transaction.findAllByUserId({ userId, limit, offset }),
    { "404": ["Aucune transaction trouvée", HTTP_CODE.NotFound] },
    "transaction",
    "getTransactions"
  );
};

/**
 * Récupère une transaction par ID
 */
export const getTransactionById = async ({
  id,
  userId,
}: {
  id: number;
  userId: number;
}): CoreResponse<string | Awaited<ReturnType<typeof Transaction.findById>>> => {
  return handleOnlyDataCore(
    () => Transaction.findById({ id, userId }),
    { "404": ["Transaction introuvable", HTTP_CODE.NotFound] },
    "transaction",
    "getTransactionById"
  );
};

/**
 * Crée une nouvelle transaction
 */
export const createTransaction = async ({
  userId,
  bankId,
  categoryId,
  baseCategory,
  amount,
  type,
  status,
  date,
  description,
}: {
  userId: number;
  bankId?: number;
  categoryId?: number;
  baseCategory?:string;
  amount: number;
  type: "credit" | "debit";
  status: "pending" | "completed" | "failed";
  date: Date;
  description?: string;
}): CoreResponse<string | Awaited<ReturnType<typeof Transaction.insert>>> => {
  return handleOnlyDataCore(
    async () => {
      await validateResourcesOwnership(userId, { bankId, categoryId });
      
      if(bankId) {
        let bank = await BankAccount.findById({id: bankId, userId});
        BankAccount.updateById({ id: bankId, userId , data : { balance: Number(bank.balance) + (type == "credit" ? amount : amount * -1) }});
      }
      return Transaction.insert({ userId, bankId, categoryId, baseCategory, amount, type, status, date, description });
    },
    {
      "403-category": ["Utilisation de la catégorie impossible", HTTP_CODE.Forbidden],
      "403-wallet": ["Utilisation du compte bancaire impossible", HTTP_CODE.Forbidden],
    },
    "transaction",
    "createTransaction"
  );
};

/**
 * Met à jour une transaction
 */
export const updateTransaction = async ({
  id,
  userId,
  data,
}: {
  id: number;
  userId: number;
  data: Partial<{
    bankId: number;
    categoryId: number;
    amount: number;
    status: "pending" | "completed" | "failed";
    baseCategory:string;
    date: Date;
    description?: string;
  }>;
}): CoreResponse<string | Awaited<ReturnType<typeof Transaction.updateById>>> => {
  return handleOnlyDataCore(
    async () => {
      await validateResourcesOwnership(userId, data);
      const baseTransaction = await Transaction.findById({ id, userId });

      const oldBank = baseTransaction.bankId
        ? await BankAccount.findById({ id: baseTransaction.bankId, userId })
        : null;

      const newBank = data.bankId && data.bankId !== baseTransaction.bankId
        ? await BankAccount.findById({ id: data.bankId, userId })
        : oldBank;

      const sign = baseTransaction.type === "credit" ? 1 : -1;
      const amountDiff = (Number(data.amount ?? baseTransaction.amount) - Number(baseTransaction.amount)) * sign;

      if (oldBank && oldBank.id !== newBank?.id)
        await BankAccount.updateById({ id: oldBank.id, userId, data: { balance: Number(oldBank.balance) - sign * Number(baseTransaction.amount) } });

      if (newBank && oldBank?.id !== newBank.id)
        await BankAccount.updateById({ id: newBank.id, userId, data: { balance: Number(newBank.balance) + sign * Number(data.amount ?? baseTransaction.amount) } });

      if (newBank && oldBank?.id === newBank.id)
        await BankAccount.updateById({ id: newBank.id, userId, data: { balance: Number(newBank.balance) - sign * amountDiff } });
      
      return Transaction.updateById({ id, userId, data });
    },
    { 
      "404": ["Transaction introuvable", HTTP_CODE.NotFound],
      "403-category": ["Utilisation de la catégorie impossible", HTTP_CODE.Forbidden],
      "403-wallet": ["Utilisation du compte bancaire impossible", HTTP_CODE.Forbidden],
    },
    "transaction",
    "updateTransaction"
  );
};

/**
 * Supprime une transaction
 */
export const deleteTransaction = async ({
  id,
  userId,
}: {
  id: number;
  userId: number;
}): CoreResponse<string> => {
  return handleOnlyDataCore(
    async () => {
      const baseTransaction = await Transaction.findById({ id, userId });
      const bank = baseTransaction.bankId
        ? await BankAccount.findById({ id: baseTransaction.bankId, userId })
        : null;

      const sign = baseTransaction.type === "credit" ? 1 : -1;
      
      if(bank){
        await BankAccount.updateById({ id: bank.id, userId, data: { balance: Number(bank.balance) - sign * Number(baseTransaction.amount) } });
      }
      
      return Transaction.deleteById({ id, userId }).then(() => "Transaction supprimée avec succès")
    },
    { "404": ["Transaction introuvable", HTTP_CODE.NotFound] },
    "transaction",
    "deleteTransaction"
  );
};