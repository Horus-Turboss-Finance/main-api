import { catchSync } from "../middleware/catchError";
import { getUserIdOrThrow, validateTransaction } from "../utils/validation";
import { ensureAtLeastOneField, handleCoreResponse } from "../utils/handleCoreResponse";
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../services/transaction.core";

/**
 * GET /transaction
 * Liste les transactions récentes de l'utilisateur connecté
 */
export const getMyTransactions = catchSync(async (req, res) => {
  const userId = getUserIdOrThrow(req);

  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
  const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;

  await handleCoreResponse(() => getTransactions({ userId, limit, offset }), res);
});

/**
 * GET /transaction/:id
 * Récupère une transaction précise de l'utilisateur
 */
export const getMyTransactionById = catchSync(async (req, res) => {
  const userId = getUserIdOrThrow(req);
  const id = parseInt(req.params.id, 10);

  await handleCoreResponse(() => getTransactionById({ id, userId }), res);
});

/**
 * POST /transaction
 * Crée une nouvelle transaction
 */
export const createMyTransaction = catchSync(async (req, res) => {
  const userId = getUserIdOrThrow(req);
  let { status, date } = req.body ?? {};
  const { bankId, categoryId, amount, type, description, baseCategory } = req.body ?? {};
  
  if(!status) status = "completed";
  if(!date) date = new Date();

  validateTransaction({date, type, amount, bankId, status, categoryId, description, baseCategory});

  await handleCoreResponse(
    () =>
      createTransaction({
        userId,
        bankId,
        categoryId,
        amount,
        type,
        status,
        date: new Date(date),
        baseCategory,
        description,
      }),
    res
  );
});

/**
 * PUT /transaction/:id
 * Met à jour une transaction existante
 */
export const updateMyTransaction = catchSync(async (req, res) => {
  const userId = getUserIdOrThrow(req);
  const id = parseInt(req.params.id, 10);

  const { bankId, categoryId, amount, status, date, description, baseCategory } = req.body ?? {};

  ensureAtLeastOneField({ bankId, categoryId, amount, status, date, description, baseCategory });
  
  validateTransaction({date, amount, bankId, status, categoryId, description, baseCategory, partial: true});

  await handleCoreResponse(
    () =>
      updateTransaction({
        id,
        userId,
        data: { bankId, categoryId, amount, status, date: new Date(date), description, baseCategory },
      }),
    res
  );
});

/**
 * DELETE /transaction/:id
 * Supprime une transaction
 */
export const deleteMyTransaction = catchSync(async (req, res) => {
  const userId = getUserIdOrThrow(req);
  const id = parseInt(req.params.id, 10);

  await handleCoreResponse(() => deleteTransaction({ id, userId }), res);
});