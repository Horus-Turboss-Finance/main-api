import { catchSync } from "../middleware/catchError";
import { signinCore, signupCore } from "../services/auth.core";
import { handleCoreAuthResponse } from "../utils/handleCoreResponse";
import { validateAndNormalizeEmail, validateStringField } from "../utils/validation";
import { HTTP_CODE } from '../middleware/responseException';

/**
 * Contrôleur d'inscription
 */
export const signup = catchSync(async(req, res) => {
  const { password, email: rawEmail, name } = req.body ?? {};

  validateStringField(name, "name", 16)
  validateStringField(password, "password")
  const email = validateAndNormalizeEmail(rawEmail);
  
  const avatar = "https://cashsight.fr/logo.png";

  await handleCoreAuthResponse(() =>     
    signupCore({ email, password, name, pseudo: name, avatar }),
    res
  );
});

/**
 * Contrôleur de connexion
 */
export const signin = catchSync(async(req, res) => {
  const { email: rawEmail, password } = req.body ?? {};

  validateStringField(password, "password")
  const email = validateAndNormalizeEmail(rawEmail);

  await handleCoreAuthResponse(() => signinCore({ email, password }), res);
});

export const signout = catchSync(async(req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
  handleCoreAuthResponse(() => new Promise((reso) => reso(["Déconnexion réussie", HTTP_CODE.Success])), res);
});