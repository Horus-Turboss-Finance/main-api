import { compare, hashSync } from "bcryptjs";
import { User } from "../models/user.models";
import { CoreResponse } from "../types/@types.core";
import { HTTP_CODE } from "../middleware/responseException";
import { handleOnlyDataCore } from "../utils/handleCoreResponse";

/**
 * Récupère les informations de l'utilisateur par son ID
 */
export const getUserProfile = async ({ id }: { id: number })
: CoreResponse<string | Awaited<ReturnType<typeof User.findById>>>  => {
  return handleOnlyDataCore(
    () => {
      User.RecoveryById({id})
      return User.findById({id});
    },
    {"404":["Utilisateur introuvable", HTTP_CODE.NotFound]},
      "user", "getUserProfile"
  )
};

/**
 * Met à jour le profil de l'utilisateur connecté
 */
export const updateUserProfile = async (
  { id, data }: 
  { id: number; data: Partial<{ name: string; pseudo: string; }> })
: CoreResponse<string | Awaited<ReturnType<typeof User.updateById>>>  => {
  return handleOnlyDataCore(
    () =>  User.updateById({ id, data }),
    {
      "Nom exist": ["Nom déjà existant", HTTP_CODE.BadRequest],
      "404": ["Utilisateur introuvable", HTTP_CODE.NotFound]
    }, "user", "updateUserProfile"
  )
};

/**
 * Met à jour le profil de l'utilisateur connecté
 */
export const updateUserEmail = async (
  { id, data }: 
  { id: number; data: { email: string; password: string; } })
: CoreResponse<string | Awaited<ReturnType<typeof User.updateById>>>  => {
  return handleOnlyDataCore(
    async () =>  {
      const storedUser = await User.loginById({ id });
      const isValid = await compare(data.password, storedUser ?? "");

      if(!isValid)  throw new Error('Pass invalide')
      return User.updateById({ id, data: {email: data.email} })
    },
    {
      "Pass invalide": ["Mot de passe invalide", HTTP_CODE.BadRequest],
      "Email exist": ["Email déjà existant", HTTP_CODE.BadRequest],
      "404": ["Utilisateur introuvable", HTTP_CODE.NotFound]
    }, "user", "updateUserEmail"
  )
};

/**
 * Met à jour le profil de l'utilisateur connecté
 */
export const updateUserPassword = async (
  { id, data }: 
  { id: number; data: { oldPassword: string; newPassword: string; } })
: CoreResponse<string | Awaited<ReturnType<typeof User.updateById>>>  => {
    return handleOnlyDataCore(
    async () =>  {
      const storedUser = await User.loginById({ id });
      const isValid = await compare(data.oldPassword, storedUser);

      if(!isValid) throw new Error('Pass invalide');

      const hash = hashSync(data.newPassword, 10);
      

      await User.UpdatePass({ id, password: hash })
      return "Mot de passe mis à jour"
    },
    {
      "Pass invalide": ["Mot de passe invalide", HTTP_CODE.BadRequest],
      "404": ["Utilisateur introuvable", HTTP_CODE.NotFound]
    }, "user", "updateUserEmail"
  )
};

/**
 * Supprime le compte utilisateur
 */
export const deleteUserAccount = async ({ id }: { id: number }): CoreResponse<string> => {
  return handleOnlyDataCore(
    () =>  User.softDeleteById({ id }).then(() => "Compte supprimé avec succès"),
    {"404": ["Utilisateur introuvable", HTTP_CODE.NotFound]}, 
    "user", "deleteUserAccount"
  )
};