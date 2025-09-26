import { isAuth } from '../middleware/auth';
import express, { RequestHandler } from 'express';
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
router.get('/@me', isAuth as RequestHandler, checkPermission(Permissions.UserViewOwn) as RequestHandler, getMyProfile as RequestHandler);

/**
 * @route PUT /user/@me
 * @desc Met à jour les informations de l'utilisateur connecté
 * @access Authenticated
 */
router.put('/@me', isAuth as RequestHandler, checkPermission(Permissions.UserUpdateOwn) as RequestHandler, updateMyProfile as RequestHandler);

/**
 * @route GET /user/@me/kiff-score
 * @desc Récupère le kiff score de l'utilisateur
 * @access Authenticated
 */
router.get('/@me/kiff-score', isAuth as RequestHandler, checkPermission(Permissions.UserViewOwn) as RequestHandler, getKiffScore as RequestHandler);

/**
 * @route PUT /user/@me/email
 * @desc Met à jour l'email  de l'utilisateur connecté
 * @access Authenticated
 */
router.put('/@me/email', isAuth as RequestHandler, checkPermission(Permissions.UserUpdateOwn) as RequestHandler, updateMyEmail as RequestHandler);

/**
 * @route PUT /user/@me/credential
 * @desc Met à jour le mot de passe de l'utilisateur connecté
 * @access Authenticated
 */
router.put('/@me/credential', isAuth as RequestHandler, checkPermission(Permissions.UserUpdateOwn) as RequestHandler, updateMyPassword as RequestHandler);

/**
 * @route DELETE /user/@me
 * @desc Supprime le compte de l'utilisateur connecté
 * @access Authenticated
 */
router.delete('/@me', isAuth as RequestHandler, checkPermission(Permissions.UserDeleteOwn) as RequestHandler, deleteMyAccount as RequestHandler);

export default router;
