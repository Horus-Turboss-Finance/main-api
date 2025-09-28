import express, { RequestHandler } from 'express';
import { signup, signin, signout } from '../controllers/auth.controller';

const router = express.Router();

/* User Auth */
router.post('/signup', signup as RequestHandler);
router.post('/signout', signout as RequestHandler);
router.post('/signin', signin as RequestHandler);

export default router