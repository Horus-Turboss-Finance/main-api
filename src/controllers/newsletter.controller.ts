import { Request, Response } from 'express';
import { catchSync } from "../middleware/catchError";
import { newMailNewsletterCore, sizeDBCore } from "../services/newsletter.core";
import { handleCoreResponse } from "../utils/handleCoreResponse";
import { validateAndNormalizeEmail } from "../utils/validation";

/**
 * Contrôleur pour l'inscription d'un email à la newsletter.
 */
export const newMailNewsletter = catchSync(async (req: Request, res: Response) => {
  const { email: rawEmail }: { email?: string } = req.body ?? {};

  // Validation + normalisation
  const email = validateAndNormalizeEmail(rawEmail);

  // Appel au core et réponse standardisée
  await handleCoreResponse(() => newMailNewsletterCore(email), res);
});

/**
 * Contrôleur pour récupérer la taille de la base de données (newsletter)
 */
export const sizeDB = catchSync(async (req: Request, res: Response) => {
  await handleCoreResponse(() => sizeDBCore(), res);
});