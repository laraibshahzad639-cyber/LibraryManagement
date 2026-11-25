import express from 'express';
import {
  getMyUsersController,
  loginUserController,
  logoutUserController,
  registerUserController,
} from '../auth/auth.controller.js';
import { authenticationMiddleware } from '../middleware/auth.middleware.js';
const route = express.Router();
route.post('/', registerUserController);
route.post('/login', loginUserController);
route.post('/logout', logoutUserController);
route.get('/me', authenticationMiddleware, getMyUsersController);
export { route };
