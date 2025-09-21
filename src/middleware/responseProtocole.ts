import { ResponseException } from "./responseException";
import { logger } from "../services/logger";

/**
 * Middleware global de gestion des erreurs
 * - Standardise le format JSON de sortie
 * - Log les erreurs 500 côté serveur
 */
export const ResponseProtocole = (err: Error & any, req: any, res: any, next: any) => {
  const originalError = err;

  if (!("status" in err)) {
    err = ResponseException().UnknownError();
  }

  // Log uniquement les erreurs serveur critiques
  if (err.status >= 500) {
    logger.error("Server Error", {
      message: originalError.message,
      stack: originalError.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip
    });
  }

  return res.status(err.status).json(err);
};
