import { catchSync } from "../middleware/catchError";
import { newMailNewsletterCore, sizeDBCore } from "../services/newsletter.core";
import { handleCoreResponse } from "../utils/handleCoreResponse";
import { validateAndNormalizeEmail } from "../utils/validation";

/**
 * Contrôleur pour l'inscription d'un email à la newsletter.
 */
export const newMailNewsletter = catchSync(async (req, res) => {
  const { email: rawEmail }: { email?: string } = req.body ?? {};

  // Validation + normalisation
  const email = validateAndNormalizeEmail(rawEmail);

  // Appel au core et réponse standardisée
  await handleCoreResponse(() => newMailNewsletterCore(email), res);
});

/**
 * Contrôleur pour récupérer la taille de la base de données (newsletter)
 */
export const sizeDB = catchSync(async (req, res) => {
  await handleCoreResponse(() => sizeDBCore(), res);
});