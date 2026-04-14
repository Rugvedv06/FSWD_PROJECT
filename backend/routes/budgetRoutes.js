import express from 'express';
import { getBudgets, setBudget, deleteBudget } from '../controllers/budgetController.js';

const router = express.Router();

router.route('/')
  .get(getBudgets)
  .post(setBudget);

router.route('/:id')
  .delete(deleteBudget);

export default router;
