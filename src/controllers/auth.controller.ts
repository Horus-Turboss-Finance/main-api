import { Request, Response } from 'express';
import { catchSync } from "../middleware/catchError";
import { signinCore, signupCore } from "../services/auth.core";
import { handleCoreAuthResponse } from "../utils/handleCoreResponse";
import { validateAndNormalizeEmail, validateStringField } from "../utils/validation";
import { HTTP_CODE } from '../middleware/responseException';

/**
 * Contrôleur d'inscription
 */
export const signup = catchSync(async(req : Request, res : Response) => {
  const { password, email: rawEmail, name } = req.body ?? {};

  validateStringField(name, "name", 16)
  validateStringField(password, "password")
  const email = validateAndNormalizeEmail(rawEmail);
  
  let avatar = "https://cashsight.fr/logo.png";

  await handleCoreAuthResponse(() =>     
    signupCore({ email, password, name, pseudo: name, avatar }),
    res
  );
});

/**
 * Contrôleur de connexion
 */
export const signin = catchSync(async(req : Request, res : Response) => {
  const { email: rawEmail, password } = req.body ?? {};

  validateStringField(password, "password")
  const email = validateAndNormalizeEmail(rawEmail);

  await handleCoreAuthResponse(() => signinCore({ email, password }), res);
});

export const signout = catchSync(async(req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
  handleCoreAuthResponse(() => new Promise((reso, rej ) => reso(["Déconnexion réussie", HTTP_CODE.Success])), res);
});