import express from 'express';
import {
  deleteUsersController,
  getUsersByIdController,
  getUsersController,
  UsersSatusController,
} from './user.controller.js';
import { authenticationMiddleware } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/role.middleware.js';

const router = express.Router();
router.get('/', authenticationMiddleware, getUsersController);
router.get('/:id', getUsersByIdController);
router.delete('/:id', deleteUsersController);
router.patch(
  '/:id/status',
  authenticationMiddleware,
  isAdmin,
  UsersSatusController
);
export { router };
