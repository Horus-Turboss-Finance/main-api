import { Request, Response, NextFunction } from "express";
import { getUserRoleOrThrow } from "../utils/validation";
import { ResponseException } from "./responseException";
import { PermissionType } from "../types/@types.roles";
import { PermissionsManager } from "../config/roles";
import { catchSync } from "./catchError";

/* Instance unique du gestionnaire de permissions */
const permissionsManager = new PermissionsManager();

/**
 * Middleware qui vérifie si l'utilisateur possède une permission donnée.
 *
 * @param requiredPermission - Permission à vérifier (ex: "user:view:any")
 * @returns Middleware Express
 */
export const checkPermission = (requiredPermission: PermissionType) =>
catchSync(async (req: Request, _res: Response, next: NextFunction) => {
  const role = getUserRoleOrThrow(req);

  if (!permissionsManager.hasPermission(role, requiredPermission)) {
    throw ResponseException("Permissions insuffisantes").Forbidden();
  }

  next(); // OK → on passe la main
});