import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../types/user.types";

/**
 * Fonction qui permet de résoudre des erreurs dans les fonctions async
 * @param errorFunction - Les parametres envoyé par express (req, res, next)
 * @returns 
 */
export const catchSync = (errorFunction : (req : Request & CustomRequest, res : Response, next : NextFunction) => void) => async (req : Request & CustomRequest, res : Response, next : NextFunction) => {
  Promise.resolve(errorFunction(req, res, next)).catch(next);
}