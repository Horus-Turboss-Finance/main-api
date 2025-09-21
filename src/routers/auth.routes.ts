import express from 'express';
import { signup, signin, signout } from '../controllers/auth.controller';

const router = express.Router();

/* User Auth */
router.post('/signup', signup);
router.post('/signout', signout);
router.post('/signin', signin);

export default router