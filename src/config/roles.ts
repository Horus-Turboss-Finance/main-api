import { PermissionType, RoleType, Permissions } from "../types/@types.roles";

/**
 * Centralise la gestion des permissions par rôle.
 * Implémentation basée sur un mapping strict `RoleType -> Set<PermissionType>` :
 *  - Vérification en O(1) via Set.has()
 *  - Pas de doublon de permissions
 *  - Extensible facilement (nouveaux rôles ou permissions)
 */
export class PermissionsManager {
  /** Mapping des permissions par rôle */
  private rolePermissions: Record<RoleType, Set<PermissionType>>;

  /** Référence aux constantes de permissions disponibles */
  public Permissions: typeof Permissions;

  constructor() {
    this.Permissions = Permissions;

    this.rolePermissions = {
      /**
       * ADMIN
       * Accès complet : gestion de son compte, des autres utilisateurs,
       * de toutes les transactions et comptes bancaires.
       */
      ADMIN: new Set<PermissionType>([
        Permissions.UserViewOwn,
        Permissions.UserUpdateOwn,
        Permissions.UserDeleteOwn,
        Permissions.UserViewAny,
        Permissions.UserCreateAny,
        Permissions.UserUpdateAny,
        Permissions.UserDeleteAny,
        Permissions.TransactionViewOwn,
        Permissions.TransactionCreateOwn,
        Permissions.TransactionUpdateOwn,
        Permissions.TransactionDeleteOwn,
        Permissions.TransactionViewAny,
        Permissions.TransactionCreateAny,
        Permissions.TransactionUpdateAny,
        Permissions.TransactionDeleteAny,
        Permissions.BankAccountCreateOwn,
        Permissions.BankAccountUpdateOwn,
        Permissions.BankAccountDeleteOwn,
        Permissions.BankAccountViewOwn,
        Permissions.BankAccountCreateAny,
        Permissions.BankAccountUpdateAny,
        Permissions.BankAccountDeleteAny,
        Permissions.BankAccountViewAny,
        Permissions.TransactionCategoryCreateOwn,
        Permissions.TransactionCategoryUpdateOwn,
        Permissions.TransactionCategoryDeleteOwn,
        Permissions.TransactionCategoryViewOwn,
        Permissions.TransactionCategoryCreateAny,
        Permissions.TransactionCategoryUpdateAny,
        Permissions.TransactionCategoryDeleteAny,
        Permissions.TransactionCategoryViewAny,
      ]),

      /**
       * STAFF_MODERATOR
       * - Accès complet sur ses propres données
       * - Accès en lecture/édition sur les utilisateurs et transactions globales
       * - Ne peut pas créer de transaction pour autrui
       */
      STAFF_MODERATOR: new Set<PermissionType>([
        Permissions.UserViewOwn,
        Permissions.UserUpdateOwn,
        Permissions.UserDeleteOwn,
        Permissions.UserViewAny,
        Permissions.UserUpdateAny,
        Permissions.TransactionViewOwn,
        Permissions.TransactionCreateOwn,
        Permissions.TransactionUpdateOwn,
        Permissions.TransactionDeleteOwn,
        Permissions.TransactionViewAny,
        Permissions.TransactionUpdateAny,
        Permissions.TransactionDeleteAny,
        Permissions.BankAccountCreateOwn,
        Permissions.BankAccountUpdateOwn,
        Permissions.BankAccountDeleteOwn,
        Permissions.BankAccountViewOwn,
        Permissions.TransactionCategoryCreateOwn,
        Permissions.TransactionCategoryUpdateOwn,
        Permissions.TransactionCategoryDeleteOwn,
        Permissions.TransactionCategoryViewOwn,
        Permissions.TransactionCategoryUpdateAny,
        Permissions.TransactionCategoryViewAny,
      ]),

      /**
       * USER
       * - Accès uniquement à ses propres données, transactions et comptes
       * - Aucun droit sur les autres utilisateurs
       */
      USER: new Set<PermissionType>([
        Permissions.UserViewOwn,
        Permissions.UserUpdateOwn,
        Permissions.UserDeleteOwn,
        Permissions.TransactionViewOwn,
        Permissions.TransactionCreateOwn,
        Permissions.TransactionUpdateOwn,
        Permissions.TransactionDeleteOwn,
        Permissions.BankAccountCreateOwn,
        Permissions.BankAccountUpdateOwn,
        Permissions.BankAccountDeleteOwn,
        Permissions.BankAccountViewOwn,
        Permissions.TransactionCategoryCreateOwn,
        Permissions.TransactionCategoryUpdateOwn,
        Permissions.TransactionCategoryDeleteOwn,
        Permissions.TransactionCategoryViewOwn,
      ]),
    };
  }

  /**
   * Vérifie si un rôle possède une permission donnée.
   */
  hasPermission(role: RoleType, permission: PermissionType): boolean {
    return this.rolePermissions[role]?.has(permission) ?? false;
  }

  /**
   * Retourne la liste des permissions d'un rôle.
   */
  getPermissions(role: RoleType): PermissionType[] {
    return Array.from(this.rolePermissions[role] ?? []);
  }
}