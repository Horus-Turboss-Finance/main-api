import { ClassResponseExceptions, ResponseException } from "./responseException";
import { NextFunction, Request, Response } from "express";
import { logger } from "../services/logger";

/**
 * Middleware global de gestion des erreurs
 * - Standardise le format JSON de sortie
 * - Log les erreurs 500 côté serveur
 */
export const ResponseProtocole = (err: Error &  {
    status: number;
    data: string;
} & unknown, req: Request, res: Response, next: NextFunction) => {
  const originalError = err;

  let firstResponse = ResponseException().UnknownError();
  
  if (err instanceof ClassResponseExceptions) {
    firstResponse = err;
  }

  // Log uniquement les erreurs serveur critiques
  if (!firstResponse || firstResponse.status >= 500) {
    logger.error("Server Error", {
      message: originalError.message,
      stack: originalError.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip
    });
  }

  return res.status(err.status).json(err);
  next();
};
