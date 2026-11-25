import express from 'express';
import { authenticationMiddleware } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/role.middleware.js';
import {
  getAdminDashboardController,
  getUserDashboardController,
} from './dashboard.controller.js';
const dashboardRoute = express.Router();
dashboardRoute.get(
  '/admin',
  authenticationMiddleware,
  isAdmin,
  getAdminDashboardController
);
dashboardRoute.get(
  '/user',
  authenticationMiddleware,
  getUserDashboardController
);
export { dashboardRoute };
