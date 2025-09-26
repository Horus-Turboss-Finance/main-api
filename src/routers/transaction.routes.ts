import { RequestHandler, Router } from "express";
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
router.get("/", isAuth as RequestHandler, checkPermission(perms.Permissions.TransactionViewOwn) as RequestHandler, getMyTransactions as RequestHandler);
router.get("/:id", isAuth as RequestHandler, checkPermission(perms.Permissions.TransactionViewOwn) as RequestHandler, getMyTransactionById as RequestHandler);
router.post("/", isAuth as RequestHandler, checkPermission(perms.Permissions.TransactionCreateOwn) as RequestHandler, createMyTransaction as RequestHandler);
router.put("/:id", isAuth as RequestHandler, checkPermission(perms.Permissions.TransactionUpdateOwn) as RequestHandler, updateMyTransaction as RequestHandler);
router.delete("/:id", isAuth as RequestHandler, checkPermission(perms.Permissions.TransactionDeleteOwn) as RequestHandler, deleteMyTransaction as RequestHandler);

export default router;
