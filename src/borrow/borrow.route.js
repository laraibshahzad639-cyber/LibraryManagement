import express from 'express';
import { authenticationMiddleware } from '../middleware/auth.middleware.js';
import {
  addBorrowBooksController,
  borrowHistoryController,
  getBorrowBooksController,
  getMyBorowBooksController,
  getOverdueBorrowRecordsController,
  returnBorrowBooksController,
} from './borrow.controller.js';
import { isAdmin } from '../middleware/role.middleware.js';

const borrowRoute = express.Router();
borrowRoute.post(
  '/:bookId',
  authenticationMiddleware,
  addBorrowBooksController
);
borrowRoute.get('/my', authenticationMiddleware, getMyBorowBooksController);
borrowRoute.get('/history', authenticationMiddleware, borrowHistoryController);
borrowRoute.get(
  '/overdue',
  authenticationMiddleware,
  getOverdueBorrowRecordsController
);
borrowRoute.get(
  '/my-overdue',
  authenticationMiddleware,
  getOverdueBorrowRecordsController
);
borrowRoute.get(
  '/',
  authenticationMiddleware,
  isAdmin,
  getBorrowBooksController
);
borrowRoute.patch(
  '/:id/return',
  authenticationMiddleware,
  returnBorrowBooksController
);

export { borrowRoute };
