import express from 'express';
import { isAuth } from '../middleware/auth';
import { Permissions } from '../types/@types.roles';
import { checkPermission } from '../middleware/roles';
import { getKiffScore } from '../controllers/kiff-score.controller';
import { getMyProfile, updateMyProfile, deleteMyAccount, updateMyEmail, updateMyPassword } from '../controllers/user.controller';

const router = express.Router();

/**
 * @route GET /user/@me
 * @desc Récupère les informations de l'utilisateur connecté
 * @access Authenticated
 */
router.get('/@me', isAuth, checkPermission(Permissions.UserViewOwn), getMyProfile);

/**
 * @route PUT /user/@me
 * @desc Met à jour les informations de l'utilisateur connecté
 * @access Authenticated
 */
router.put('/@me', isAuth, checkPermission(Permissions.UserUpdateOwn), updateMyProfile);

/**
 * @route GET /user/@me/kiff-score
 * @desc Récupère le kiff score de l'utilisateur
 * @access Authenticated
 */
router.get('/@me/kiff-score', isAuth, checkPermission(Permissions.UserViewOwn), getKiffScore);

/**
 * @route PUT /user/@me/email
 * @desc Met à jour l'email  de l'utilisateur connecté
 * @access Authenticated
 */
router.put('/@me/email', isAuth, checkPermission(Permissions.UserUpdateOwn), updateMyEmail);

/**
 * @route PUT /user/@me/credential
 * @desc Met à jour le mot de passe de l'utilisateur connecté
 * @access Authenticated
 */
router.put('/@me/credential', isAuth, checkPermission(Permissions.UserUpdateOwn), updateMyPassword);

/**
 * @route DELETE /user/@me
 * @desc Supprime le compte de l'utilisateur connecté
 * @access Authenticated
 */
router.delete('/@me', isAuth, checkPermission(Permissions.UserDeleteOwn), deleteMyAccount);

export default router;
