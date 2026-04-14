import express from 'express';
import { getUserProfile, updateIncome } from '../controllers/userController.js';

const router = express.Router();

router.get('/profile', getUserProfile);
router.patch('/income', updateIncome);

export default router;
