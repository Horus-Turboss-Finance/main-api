import { Router } from "express";
import {
  listBankAccounts,
  addBankAccount,
  editBankAccount,
  removeBankAccount,
  listTransactionCategories,
  addTransactionCategory,
  editTransactionCategory,
  removeTransactionCategory,
} from "../controllers/settings.controller";
import { isAuth } from "../middleware/auth";
import { checkPermission } from "../middleware/roles";
import { PermissionsManager } from "../config/roles";

const router = Router();
const perms = new PermissionsManager();

// ----- BANK ACCOUNTS -----
router.get("/accounts", isAuth, checkPermission(perms.Permissions.BankAccountViewOwn), listBankAccounts);
router.post("/accounts", isAuth, checkPermission(perms.Permissions.BankAccountCreateOwn), addBankAccount);
router.put("/accounts/:id", isAuth, checkPermission(perms.Permissions.BankAccountUpdateOwn), editBankAccount);
router.delete("/accounts/:id", isAuth, checkPermission(perms.Permissions.BankAccountDeleteOwn), removeBankAccount);

// ----- TRANSACTION CATEGORIES -----
router.get("/categories", isAuth, checkPermission(perms.Permissions.TransactionCategoryViewOwn), listTransactionCategories);
router.post("/categories", isAuth, checkPermission(perms.Permissions.TransactionCategoryCreateOwn), addTransactionCategory);
router.put("/categories/:id", isAuth, checkPermission(perms.Permissions.TransactionCategoryUpdateOwn), editTransactionCategory);
router.delete("/categories/:id", isAuth, checkPermission(perms.Permissions.TransactionCategoryDeleteOwn), removeTransactionCategory);

export default router;