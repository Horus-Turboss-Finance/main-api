import { RequestHandler, Router } from "express";
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
router.get("/accounts", isAuth as RequestHandler, checkPermission(perms.Permissions.BankAccountViewOwn) as RequestHandler, listBankAccounts as RequestHandler);
router.post("/accounts", isAuth as RequestHandler, checkPermission(perms.Permissions.BankAccountCreateOwn) as RequestHandler, addBankAccount as RequestHandler);
router.put("/accounts/:id", isAuth as RequestHandler, checkPermission(perms.Permissions.BankAccountUpdateOwn) as RequestHandler, editBankAccount as RequestHandler);
router.delete("/accounts/:id", isAuth as RequestHandler, checkPermission(perms.Permissions.BankAccountDeleteOwn) as RequestHandler, removeBankAccount as RequestHandler);

// ----- TRANSACTION CATEGORIES -----
router.get("/categories", isAuth as RequestHandler, checkPermission(perms.Permissions.TransactionCategoryViewOwn) as RequestHandler, listTransactionCategories as RequestHandler);
router.post("/categories", isAuth as RequestHandler, checkPermission(perms.Permissions.TransactionCategoryCreateOwn) as RequestHandler, addTransactionCategory as RequestHandler);
router.put("/categories/:id", isAuth as RequestHandler, checkPermission(perms.Permissions.TransactionCategoryUpdateOwn) as RequestHandler, editTransactionCategory as RequestHandler);
router.delete("/categories/:id", isAuth as RequestHandler, checkPermission(perms.Permissions.TransactionCategoryDeleteOwn) as RequestHandler, removeTransactionCategory as RequestHandler);

export default router;