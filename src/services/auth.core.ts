import { handleCoreError, handleOnlyDataCore } from "../utils/handleCoreResponse";
import { HTTP_CODE } from "../middleware/responseException";
import { CoreResponse } from "../types/@types.core";
import { User } from "../models/user.models";
import bcrypt from "bcryptjs"

export const signinCore = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): CoreResponse<string> => {
  try {
    const storedUser = await User.login({ email });

    const isValid = await bcrypt.compare(password, storedUser?.password ?? "");
    if (!isValid) return ["Email ou mot de passe invalide", HTTP_CODE.Unauthorized];

    return [storedUser.token, HTTP_CODE.Success];
  } catch (e) {
    return handleCoreError("auth", "SigninCore", e, {
      "404": ["Email ou mot de passe invalide", HTTP_CODE.Unauthorized],
    });
  }
};

export const signupCore = async ({
  password,
  pseudo,
  avatar,
  email,
  name,
}: {
  password: string;
  pseudo: string;
  avatar: string;
  email: string;
  name: string;
}): CoreResponse<number|string> => {
  const hash = bcrypt.hashSync(password, 10);
  return handleOnlyDataCore(
    () => User.insert({
    password: hash,
    avatar,
    pseudo,
    email,
    name,
    }), {
      "Email exist": ["Email déjà existant", HTTP_CODE.BadRequest],
      "Nom exist": ["Nom déjà existant", HTTP_CODE.BadRequest],
    }, "auth", "SignupCore"
  )
}