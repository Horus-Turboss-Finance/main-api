import express, { RequestHandler } from 'express';
import { newMailNewsletter, sizeDB } from '../controllers/newsletter.controller';

const router = express.Router();

/* New customer email post */
router.post('/email', newMailNewsletter  as RequestHandler);
/* sum email in db */
router.post('/size', sizeDB as RequestHandler);

export default router