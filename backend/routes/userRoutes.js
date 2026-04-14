import express from 'express';
import { getUserProfile, updateIncome, updateProfile, changePassword } from '../controllers/userController.js';

const router = express.Router();

router.get('/profile', getUserProfile);
router.patch('/income', updateIncome);
router.patch('/profile', updateProfile);
router.patch('/password', changePassword);

export default router;
