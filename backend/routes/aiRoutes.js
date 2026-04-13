import express from 'express';
import { chatWithAI, predictAffordability } from '../controllers/aiController.js';

const router = express.Router();

router.get('/analysis', analyzeSpending);
router.post('/chat', chatWithAI);
router.post('/afford', predictAffordability);

export default router;