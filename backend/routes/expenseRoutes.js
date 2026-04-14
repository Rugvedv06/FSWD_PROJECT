import express from 'express';
import { getExpenses, addExpense, deleteExpense, updateExpense } from '../controllers/expenseController.js';

const router = express.Router();

router.route('/')
  .get(getExpenses)
  .post(addExpense);

router.route('/:id')
  .delete(deleteExpense)
  .patch(updateExpense);

export default router;