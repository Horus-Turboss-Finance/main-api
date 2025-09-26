import { catchSync } from "../middleware/catchError";
import { ensureAtLeastOneField, handleCoreResponse } from "../utils/handleCoreResponse";
import { getUserProfile, updateUserProfile, deleteUserAccount, updateUserEmail, updateUserPassword } from "../services/user.core";
import { getUserIdOrThrow, validateAndNormalizeEmail, validateStringField } from "../utils/validation";

/**
 * GET /user/@me
 */
export const getMyProfile = catchSync(async (req, res) => {
  const id = getUserIdOrThrow(req);
  await handleCoreResponse(() => getUserProfile({ id }), res);
});

/**
 * PUT /user/@me
 */
export const updateMyProfile = catchSync(async (req, res) => {
  const id = getUserIdOrThrow(req);
  const { pseudo, name } = req.body ?? {};

  ensureAtLeastOneField({ pseudo, name })

  if (name) validateStringField(name, "Nom", 16);
  if (pseudo) validateStringField(pseudo, "Pseudo", 16);

  await handleCoreResponse(() => updateUserProfile({ id, data: {pseudo, name} }), res);
});

/**
 * PUT /user/@me/email
 */
export const updateMyEmail = catchSync(async (req, res) => {
  const id = getUserIdOrThrow(req);
  const { password } = req.body ?? {};
  let { email } = req.body ?? {};

  email = validateAndNormalizeEmail(email);
  validateStringField(password, "Password");

  await handleCoreResponse(() => updateUserEmail({ id, data: {email, password} }), res);
});

/**
 * PUT /user/@me/credential
 */
export const updateMyPassword = catchSync(async (req, res) => {
  const id = getUserIdOrThrow(req);
  const { oldPassword, newPassword } = req.body ?? {};

  validateStringField(newPassword, "NewPassword");
  validateStringField(oldPassword, "Oldpassword");

  await handleCoreResponse(() => updateUserPassword({ id, data: {newPassword, oldPassword} }), res);
});

/**
 * DELETE /user/@me
 */
export const deleteMyAccount = catchSync(async (req, res) => {
  const id = getUserIdOrThrow(req);
  await handleCoreResponse(() => deleteUserAccount({ id }), res);
});