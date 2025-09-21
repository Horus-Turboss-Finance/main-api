import { Request, Response } from 'express';
import { catchSync } from "../middleware/catchError";
import { newMessagePostCore } from "../services/contact.core";
import { handleCoreResponse } from "../utils/handleCoreResponse";
import { validateAndNormalizeEmail, validateBooleanField, validateStringField } from '../utils/validation';

/**
 * Contrôleur pour la création d'un nouveau message/contact
 */
export const newMessagePost = catchSync(async (req: Request, res: Response) => {
  const { email: rawEmail, firstName, lastName, message, isChecked } = req.body ?? {};

  const email = validateAndNormalizeEmail(rawEmail);
  validateStringField(firstName, "Prénom", 20);
  validateStringField(lastName, "Nom", 20);
  validateStringField(message, "Message", 2000);
  validateBooleanField(isChecked, "Validation des conditions");

  // Remplace l'email normalisé dans le payload
  req.body.email = email;

  // Appel à la couche métier et envoi de la réponse standardisée
  await handleCoreResponse(() => newMessagePostCore(req.body), res);
});