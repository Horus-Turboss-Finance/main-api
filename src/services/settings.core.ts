import { TransactionCategory } from "../models/transactionCategory.models";
import { handleOnlyDataCore } from "../utils/handleCoreResponse";
import { HTTP_CODE } from "../middleware/responseException";
import { BankAccount } from "../models/bankAccount.models";
import { Transaction } from "../models/transaction.models";
import { CoreResponse } from "../types/@types.core";

export const getBankAccounts = async ({ userId }: { userId: number }): CoreResponse<string | Awaited<ReturnType<typeof BankAccount.findAllByUserId>>> => {
  return handleOnlyDataCore(
    () => BankAccount.findAllByUserId({ userId }),
    {"404": ["Compte bancaire introuvable", HTTP_CODE.NotFound]},
    "settings", "getBankAccounts"
  )
};

export const createBankAccount = async ({
  userId,
  label,
  type,
  balance,
  icon,
}: {
  userId: number;
  label: string;
  type: string;
  balance: number;
  icon: string;
}): CoreResponse<string | Awaited<ReturnType<typeof BankAccount.insert>>> => {
  return handleOnlyDataCore(
    () => BankAccount.insert({ userId, label, type, balance, icon }),
    {}, "settings", "createBankAccount"
  )
};

export const updateBankAccount = async ({
  id,
  userId,
  data,
}: {
  id: number;
  userId: number;
  data: Partial<{ label: string; balance: number; }>;
}): CoreResponse<string | Awaited<ReturnType<typeof BankAccount.findById>>> => {
  return handleOnlyDataCore(
    () => BankAccount.updateById({ id, userId, data }),
    {"404": ["Compte bancaire introuvable", HTTP_CODE.NotFound]},
    "settings", "updateBankAccount"
  )
};

export const deleteBankAccount = async ({ id, userId }: { id: number; userId: number }): CoreResponse<string> => {
  return handleOnlyDataCore(
    async () => {
      if(await Transaction.existsByAccountId({ id, userId })) throw new Error('bank-200')
      return BankAccount.deleteById({ id, userId }).then(() => "Compte bancaire supprimé avec succès")
    },
    {
      "404": ["Compte bancaire introuvable", HTTP_CODE.NotFound],
      "bank-200": ["Impossible de supprimer le compte : des transactions y sont encore associées", HTTP_CODE.BadRequest]
    },
    "settings", "deleteBankAccount"
  )
};

export const getTransactionCategories = async ({ userId }: { userId: number }): CoreResponse<string | Awaited<ReturnType<typeof TransactionCategory.findAllByUserId>>> => {
  return handleOnlyDataCore(
    () => TransactionCategory.findAllByUserId({ userId }),
    {"404": ["Catégorie de transaction introuvable", HTTP_CODE.NotFound],},
    "settings", "getTransactionCategories"
  )
};

export const createTransactionCategory = async ({ userId, name, icon, base_category, type }: { userId: number; name: string; icon: string, base_category: string, type: 1|2 }): CoreResponse<string | Awaited<ReturnType<typeof TransactionCategory.insert>>> => {
  return handleOnlyDataCore(
    () => TransactionCategory.insert({ userId, name, icon, base_category, type }).then(() => "Catégorie de dépense enregistrée avec succès"),
    {}, "settings", "createTransactionCategory"
  )
};

export const updateTransactionCategory = async ({ id, userId, name, icon }: { id: number; userId: number; name?: string; icon?: string }): CoreResponse<string | Awaited<ReturnType<typeof TransactionCategory.updateById>>> => {
  return handleOnlyDataCore(
    () => TransactionCategory.updateById({ id, userId, name, icon }),
    {"404": ["Catégorie de transaction introuvable", HTTP_CODE.NotFound],},
    "settings", "updateTransactionCategory"
  )
};

export const deleteTransactionCategory = async ({ id, userId }: { id: number; userId: number }): CoreResponse<string> => {
  return handleOnlyDataCore(
  async () => {
    if(await Transaction.existsByCategoryId({ id, userId })) throw new Error('category-200')
    return TransactionCategory.deleteById({ id, userId }).then(() => "Catégorie de dépense supprimée avec succès")
  },
  {
    "404": ["Compte bancaire introuvable", HTTP_CODE.NotFound],
    "category-200": ["Impossible de supprimer la catégorie : des transactions y sont encore associées", HTTP_CODE.BadRequest]
  },
  "settings", "deleteBankAccount"
)
};