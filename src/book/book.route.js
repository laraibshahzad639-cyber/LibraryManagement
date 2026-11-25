import express from 'express';
import { authenticationMiddleware } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/role.middleware.js';
import {
  AddBooksController,
  getAllBooksController,
  getBookByIdController,
} from './book.controller.js';
const router1 = express.Router();
router1.post('/', authenticationMiddleware, isAdmin, AddBooksController);
router1.get('/', authenticationMiddleware, getAllBooksController);
router1.get('/:id', authenticationMiddleware, getBookByIdController);
export { router1 };
