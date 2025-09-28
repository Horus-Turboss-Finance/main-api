import { RoleType } from "../types/@types.roles";
import { BankAccount } from "../models/bankAccount.models";
import { validate as validateEmail } from "email-validator";
import { ResponseException } from "../middleware/responseException";
import { TransactionCategory } from "../models/transactionCategory.models";
import { ALLOWED_BANK_ACCOUNT_TYPES } from "../types/bank-account.types";
import { FINANCIAL_PLATFORMS_ICON_KEY } from "../types/financial-platforms.types";
import { defaultCategories, TRANSACTION_ICON_CATEGORY } from "../types/@types.transactionCategoryIcons";
import { Request } from "express";

/** ===================== Generic Validators ===================== */

/**
 * Valide et normalise un email
 */
export function validateAndNormalizeEmail(email?: string): string {
  if (!email || typeof email !== "string" || !validateEmail(email.toLowerCase()))
    throw ResponseException('Email vide ou invalide').BadRequest();
  return email.toLowerCase();
}

/**
 * Valide un champ texte avec longueur optionnelle
 */
export function validateStringField(value: unknown | undefined, fieldName: string, maxLength?:number) {
  if (!value || typeof value !== "string")
    throw ResponseException(`${fieldName} vide ou invalide`).BadRequest();
  if (maxLength && value.length > maxLength)
    throw ResponseException(`${fieldName} invalide ou contenant plus de ${maxLength} caractères`).BadRequest();
}

/**
 * Valide un champ nombre
 */
export function validateNumberField(value: string | number | undefined, fieldName: string) {
  if (typeof value !== "number" || isNaN(value))
    throw ResponseException(`${fieldName} invalide`).BadRequest();
}

/**
 * Valide un champ date
 */
export function validateDateField(value: string | undefined, fieldName: string) {
  if (!value || new Date(value).toDateString() == 'Invalid Date')
    throw ResponseException(`${fieldName} vide ou invalide`).BadRequest();
}

/**
 * Valide un booléen obligatoire
 */
export function validateBooleanField(value: boolean | undefined, fieldName: string) {
  if (typeof value !== "boolean" || !value)
    throw ResponseException(`${fieldName} non cochée ou invalide`).BadRequest();
}

/**
 * Valide un champ avec un ensemble d'options autorisées
 */
export function validateOptionField<T>(
  value: T | undefined,
  fieldName: string,
  allowedValues: T[],
  required = true
) {
  if (required && value === undefined)
    throw ResponseException(`${fieldName} est obligatoire`).BadRequest();
  if (value && !allowedValues.includes(value))
    throw ResponseException(`${fieldName} invalide, doit être une des suivantes : ${allowedValues.join(", ")}`).BadRequest();
}

/**
 * Vérifie qu'une ressource appartient bien à l'utilisateur
 */
export async function validateOwnership(
  resourceId: number | undefined,
  userId: number,
  model: { findById: (args: { id: number; userId: number }) => Promise<unknown> },
  errorCode: string
) {
  if (!resourceId) return;
  try {
    await model.findById({ id: resourceId, userId });
  } catch {
    throw new Error(errorCode);
  }
}

/**
 * Vérifie plusieurs ressources en parallèle
 */
export async function validateResourcesOwnership(userId: number, data: { categoryId?: number; bankId?: number }) {
  await Promise.all([
    validateOwnership(data.categoryId, userId, TransactionCategory, "403-category"),
    validateOwnership(data.bankId, userId, BankAccount, "403-wallet"),
  ]);
}

/** ===================== Request Helpers ===================== */

/**
 * Récupère le rôle utilisateur ou lance une erreur
 */
export const getUserRoleOrThrow = (req: Request): RoleType => {
  const role = req.user?.role as RoleType | undefined;
  if (!role) throw ResponseException("Role manquant").Unauthorized();
  return role;
};

/**
 * Récupère l'ID utilisateur ou lance une erreur
 */
export function getUserIdOrThrow(req: Request) {
  const userId = req.user?.id;
  if (!userId) throw ResponseException("Utilisateur non authentifié").Unauthorized();
  return userId;
}

/** ===================== Domain Validators ===================== */

/**
 * Valide l'entrée d'un compte bancaire
 */
export function validateBankAccountInput({
  label,
  type,
  balance,
  icon,
  partial = false,
}: {
  label?: string;
  type?: unknown;
  balance?: number;
  icon?: string;
  partial?: boolean;
}) {
  if (!partial || label) validateStringField(label, "Label", 16);
  if (!partial || type) validateOptionField(type, "Type de compte", ALLOWED_BANK_ACCOUNT_TYPES, !partial);
  if (!partial || balance !== undefined) validateNumberField(balance, "Balance")
  if (!partial || icon) validateOptionField(icon, "Icône", FINANCIAL_PLATFORMS_ICON_KEY, !partial);
}

/**
 * Valide l'entrée d'une catégorie de transaction
 */
export function validateTransactionCategoryInput({
  name,
  icon,
  base,
  type,
  partial = false,
}: {
  name?: string;
  icon?: unknown;
  base?: string;
  type?: number;
  partial?: boolean;
}) {
  if (!partial && base) validateStringField(base, 'Catégorie de base', 45);
  if (!partial || name) validateStringField(name, "Nom", 45);
  if (!partial) validateOptionField(type, "Type de catégorie", [1, 2], true);
  if (!partial || icon) validateOptionField(icon, "Icône", TRANSACTION_ICON_CATEGORY, false);
}

/**
 * Valide l'entrée d'une catégorie de transaction
 */
export function validateTransaction({
  date,
  type,
  amount,
  bankId,
  status,
  categoryId,
  baseCategory,
  description,
  partial = false,
}: {
  date?: string;
  type?: string;
  status?: string;
  amount?: number;
  bankId?: number;
  categoryId?: number;
  description?: string;
  baseCategory?:string;
  partial?: boolean;
}) {
  if (!partial || date) validateDateField(date, "date");
  if (bankId) validateNumberField(bankId, "bankId");
  if (description) validateStringField(description, "description", 1024);
  if (categoryId) validateNumberField(categoryId, "categoryId");
  if (!partial || amount !== undefined ) validateNumberField(amount, "amount");
  if (baseCategory) validateOptionField(baseCategory, "baseCategory", defaultCategories, false);
  if (!partial || type) validateOptionField(type, "type", ["credit", "debit", "transfert"], false);
  if (!partial || status) validateOptionField(status, "status", ["pending", "completed", "failed"], false);
}