/**
 * Liste stricte et typée des permissions disponibles dans l'application.
 * Convention : <ressource>:<action>[:<scope>]
 *   - ressource : entité concernée (user, transaction, ...)
 *   - action    : opération autorisée (view, create, update, delete, ...)
 *   - scope     : "own" = données personnelles, "any" = toutes données (administration/modération)
 */
export type PermissionType =
  /* --- Gestion de son propre compte utilisateur --- */
  | 'user:view:own'       /* Voir ses propres informations utilisateur */
  | 'user:update:own'     /* Modifier ses propres informations */
  | 'user:delete:own'     /* Supprimer son propre compte */

  /* --- Gestion / modération de comptes utilisateurs --- */
  | 'user:view:any'       /* Voir les informations de n'importe quel utilisateur */
  | 'user:create:any'       /*Créer n'importe quel utilisateur */
  | 'user:update:any'     /* Modifier les informations de n'importe quel utilisateur */
  | 'user:delete:any'     /* Supprimer le compte de n'importe quel utilisateur */

  /* --- Gestion de ses propres transactions --- */
  | 'transaction:view:own'    /* Voir ses transactions */
  | 'transaction:create:own'  /* Créer une transaction pour soi */
  | 'transaction:update:own'  /* Modifier ses transactions */
  | 'transaction:delete:own'  /* Supprimer ses transactions */

  /* --- Gestion de transactions globales (administration/modération) --- */
  | 'transaction:view:any'    /* Voir toutes les transactions */
  | 'transaction:create:any'  /* Créer une transaction pour n'importe quel utilisateur */
  | 'transaction:update:any'  /* Modifier la transaction de n'importe quel utilisateur */
  | 'transaction:delete:any' /* Supprimer la transaction de n'importe quel utilisateur */

  /* --- Gestion de ses propres comptes bancaires --- */
  | 'bank-account:view:own'    /* Voir tous les comptes */
  | 'bank-account:create:own'  /* Créer un compte bancaire pour soi */
  | 'bank-account:update:own'  /* Modifier son compte bancaire */
  | 'bank-account:delete:own' /* Supprimer son compte bancaire */

  /* --- Gestion des comptes bancaires globales (administration/modération) --- */
  | 'bank-account:view:any'    /* Voir tous les le compte bancaire */
  | 'bank-account:create:any'  /* Créer un compte bancaire pour n'importe quel utilisateur */
  | 'bank-account:update:any'  /* Modifier le compte bancaire de n'importe quel utilisateur */
  | 'bank-account:delete:any' /* Supprimer le compte bancaire de n'importe quel utilisateur */

  /* --- Gestion de ses propres catégories --- */
  | 'transaction-category:view:own'    /* Voir toutes les catégories */
  | 'transaction-category:create:own'  /* Créer une catégories pour soi */
  | 'transaction-category:update:own'  /* Modifier sa catégories */
  | 'transaction-category:delete:own' /* Supprimer sa catégories */

  /* --- Gestion des catégories globales (administration/modération) --- */
  | 'transaction-category:view:any'    /* Voir toutes les catégories */
  | 'transaction-category:create:any'  /* Créer une catégorie pour n'importe quel utilisateur */
  | 'transaction-category:update:any'  /* Modifier la catégorie de n'importe quel utilisateur */
  | 'transaction-category:delete:any'; /* Supprimer la catégorie de n'importe quel utilisateur */

/**
 * Rôles disponibles dans le système.
 * - ADMIN : Accès complet à toutes les ressources.
 * - STAFF_MODERATOR : Accès de modération (gestion d'autres utilisateurs, transactions globales).
 * - USER : Accès limité à ses propres données.
 */
export type RoleType = 'ADMIN' | 'STAFF_MODERATOR' | 'USER';

/**
 * Mapping des roles avec clés explicites pour éviter les fautes de frappe.
 * Typé en `as const` pour bénéficier de la complétion et d'une sécurité maximale au compile-time.
 */
export enum Roles {
  ADMIN = "ADMIN",
  STAFF_MODERATORS = "STAFF_MODERATOR",
  USER = "USER"
}

/**
 * Mapping des permissions avec clés explicites pour éviter les fautes de frappe.
 * Utilisation : Permissions.UserViewOwn, Permissions.TransactionUpdateAny, etc.
 * Typé en `as const` pour bénéficier de la complétion et d'une sécurité maximale au compile-time.
 */
export enum Permissions {
  /* --- Gestion de son propre compte utilisateur --- */
  UserViewOwn = 'user:view:own',
  UserUpdateOwn = 'user:update:own',
  UserDeleteOwn = 'user:delete:own',

  /* --- Gestion / modération de comptes utilisateurs --- */
  UserViewAny = 'user:view:any',
  UserCreateAny = 'user:create:any',
  UserUpdateAny = 'user:update:any',
  UserDeleteAny = 'user:delete:any',

  /* --- Gestion de ses propres transactions --- */
  TransactionViewOwn = 'transaction:view:own',
  TransactionCreateOwn = 'transaction:create:own',
  TransactionUpdateOwn = 'transaction:update:own',
  TransactionDeleteOwn = 'transaction:delete:own',

  /* --- Gestion de transactions globales --- */
  TransactionViewAny = 'transaction:view:any',
  TransactionCreateAny = 'transaction:create:any',
  TransactionUpdateAny = 'transaction:update:any',
  TransactionDeleteAny = 'transaction:delete:any',

  /* --- Gestion de ses propres comptes bancaires --- */
  BankAccountViewOwn = 'bank-account:view:own', 
  BankAccountCreateOwn = 'bank-account:create:own',
  BankAccountUpdateOwn = 'bank-account:update:own',
  BankAccountDeleteOwn = 'bank-account:delete:own',

  /* --- Gestion des comptes bancaires globales (administration/modération) --- */
  BankAccountViewAny = 'bank-account:view:any',
  BankAccountCreateAny = 'bank-account:create:any',
  BankAccountUpdateAny = 'bank-account:update:any',
  BankAccountDeleteAny = 'bank-account:delete:any',

  /* --- Gestion de ses propres catégories --- */
  TransactionCategoryViewOwn = 'transaction-category:view:own',
  TransactionCategoryCreateOwn = 'transaction-category:create:own',
  TransactionCategoryUpdateOwn = 'transaction-category:update:own',
  TransactionCategoryDeleteOwn = 'transaction-category:delete:own',

  /* --- Gestion des catégories globales (administration/modération) --- */
  TransactionCategoryViewAny = 'transaction-category:view:any',
  TransactionCategoryCreateAny = 'transaction-category:create:any', 
  TransactionCategoryUpdateAny = 'transaction-category:update:any', 
  TransactionCategoryDeleteAny = 'transaction-category:delete:any', 
};