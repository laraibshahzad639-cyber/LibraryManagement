import express from 'express';
import { authenticationMiddleware } from '../middleware/auth.middleware.js';

import {
  addCategoriesController,
  deleteCategorriesController,
  getCategoryController,
  updateCatehoriesControllers,
} from './category.controller.js';
import { isAdmin } from '../middleware/role.middleware.js';
const CategoryRoute = express.Router();
CategoryRoute.post(
  '/',
  authenticationMiddleware,
  isAdmin,
  addCategoriesController
);

CategoryRoute.get('/', authenticationMiddleware, getCategoryController);

CategoryRoute.delete(
  '/:id',
  authenticationMiddleware,
  isAdmin,
  deleteCategorriesController
);

CategoryRoute.patch(
  '/:id',
  authenticationMiddleware,
  isAdmin,
  updateCatehoriesControllers
);
export { CategoryRoute };
