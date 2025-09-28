import { catchSync } from "../middleware/catchError";
import { FINANCIAL_PLATFORMS } from "../types/financial-platforms.types";
import { ensureAtLeastOneField, handleCoreResponse } from '../utils/handleCoreResponse';
import { 
  getUserIdOrThrow, 
  validateBankAccountInput, 
  validateTransactionCategoryInput 
} from "../utils/validation";
import {
  getBankAccounts,
  createBankAccount,
  updateBankAccount,
  deleteBankAccount,
  getTransactionCategories,
  createTransactionCategory,
  updateTransactionCategory,
  deleteTransactionCategory,
} from "../services/settings.core";

// ----------------- BANK ACCOUNTS -----------------
export const listBankAccounts = catchSync(async (req, res) => {
  const userId = getUserIdOrThrow(req);
  await handleCoreResponse(() => getBankAccounts({ userId }), res);
});

export const addBankAccount = catchSync(async (req, res) => {
  const userId = getUserIdOrThrow(req);
  const { label, type, balance, icon } = req.body ?? {};

  validateBankAccountInput({ label, type, balance, icon });

  const ParsedIcon = FINANCIAL_PLATFORMS[icon as keyof typeof FINANCIAL_PLATFORMS]
  
  await handleCoreResponse(() => createBankAccount({ userId, label, type, balance, icon: ParsedIcon }), res);
});

export const editBankAccount = catchSync(async (req, res) => {
  const userId = getUserIdOrThrow(req);
  const { id } = req.params;
  const { label, balance } = req.body ?? {};

  ensureAtLeastOneField({ label, balance })

  validateBankAccountInput({ label, balance, partial: true });

  await handleCoreResponse(() =>
    updateBankAccount({ id: Number(id), userId, data: { label, balance } }),
    res
  );
});

export const removeBankAccount = catchSync(async (req, res) => {
  const userId = getUserIdOrThrow(req);
  const { id } = req.params;
  await handleCoreResponse(() => deleteBankAccount({ id: Number(id), userId }), res);
});

// ----------------- TRANSACTION CATEGORIES -----------------
export const listTransactionCategories = catchSync(async (req, res) => {
  const userId = getUserIdOrThrow(req);
  await handleCoreResponse(() => getTransactionCategories({ userId }), res);
});

export const addTransactionCategory = catchSync(async (req, res) => {
  const userId = getUserIdOrThrow(req);
  const { name, icon, base, type } = req.body ?? {};
  
  validateTransactionCategoryInput({ name, icon, base, type });
  
  await handleCoreResponse(() => createTransactionCategory({ userId, name, icon, base_category: base, type }), res);
});

export const editTransactionCategory = catchSync(async (req, res) => {
  const userId = getUserIdOrThrow(req);
  const { id } = req.params;
  const { name, icon } = req.body ?? {};

  ensureAtLeastOneField({ name, icon })

  validateTransactionCategoryInput({ name, icon, partial: true });

  await handleCoreResponse(() => updateTransactionCategory({ id: Number(id), userId, name, icon }), res);
});

export const removeTransactionCategory = catchSync(async (req, res) => {
  const userId = getUserIdOrThrow(req);
  const { id } = req.params;

  await handleCoreResponse(() => deleteTransactionCategory({ id: Number(id), userId }), res);
});