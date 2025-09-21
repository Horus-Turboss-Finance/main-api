/**
 * Fonction qui permet de résoudre des erreurs dans les fonctions async
 * @param errorFunction - Les parametres envoyé par express (req, res, next)
 * @returns 
 */
export const catchSync = (errorFunction : any) => async (req : any, res : any, next : any) => {
  Promise.resolve(errorFunction(req, res, next)).catch(next);
}