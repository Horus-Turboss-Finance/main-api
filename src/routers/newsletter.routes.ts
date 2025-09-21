import express from 'express';
import { newMailNewsletter, sizeDB } from '../controllers/newsletter.controller';

const router = express.Router();

/* New customer email post */
router.post('/email', newMailNewsletter);
/* sum email in db */
router.post('/size', sizeDB);

export default router