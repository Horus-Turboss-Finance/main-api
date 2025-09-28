import express, { RequestHandler } from 'express';
import { newMessagePost } from '../controllers/contact.controller';

const router = express.Router();

/* New message post */
router.post('/form', newMessagePost as RequestHandler);

export default router