// routes/transaction.routes.ts
import { Router } from "express";
import {
  getMyTransactions,
  getMyTransactionById,
  createMyTransaction,
  updateMyTransaction,
  deleteMyTransaction,
} from "../controllers/transaction.controller";
import { isAuth } from "../middleware/auth";
import { checkPermission } from "../middleware/roles";
import { PermissionsManager } from "../config/roles";

const router = Router();
const perms = new PermissionsManager();

// ----- TRANSACTIONS -----
router.get("/", isAuth, checkPermission(perms.Permissions.TransactionViewOwn), getMyTransactions);
router.get("/:id", isAuth, checkPermission(perms.Permissions.TransactionViewOwn), getMyTransactionById);
router.post("/", isAuth, checkPermission(perms.Permissions.TransactionCreateOwn), createMyTransaction);
router.put("/:id", isAuth, checkPermission(perms.Permissions.TransactionUpdateOwn), updateMyTransaction);
router.delete("/:id", isAuth, checkPermission(perms.Permissions.TransactionDeleteOwn), deleteMyTransaction);

export default router;
