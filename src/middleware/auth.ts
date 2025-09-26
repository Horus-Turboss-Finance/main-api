import { ResponseException } from "./responseException";
import { User } from "../models/user.models";
import { catchSync } from "./catchError";

/**
 * Middleware d'authentification
 * Extrait et vérifie le token Bearer puis injecte l'utilisateur dans req.user
 */
export const isAuth = catchSync(async (req, res, next) => {
  let token = req.cookies?.token;
  
  if (!token && req.headers.authorization) {
    const [scheme, extractedToken] = req.headers.authorization.split(" ");
    if (scheme === "Bearer" && extractedToken) {
      token = extractedToken;
    }
  }

  if (!token) {
    throw ResponseException("No token provided").Unauthorized();
  }

  let decoded;
  try {
    decoded = User.decodeToken(token);
  } catch (e) {
    throw ResponseException(e).Forbidden();
  }

  if (!decoded.valid) throw ResponseException("Token expiré").InvalidToken();

  req.token = token;
  req.user = {
    id: decoded.id,
    mail: decoded.email,
    role: decoded.role,
  };

  next();
});