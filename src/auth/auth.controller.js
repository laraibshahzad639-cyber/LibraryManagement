import { errorMessage } from '../utils/errorMessage.js';
import { getMyUsers, loginUser, registerUser } from './auth.service.js';
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import { sucessMessage } from '../utils/sucessMessage.js';

export const registerUserController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !name.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      return errorMessage(res, 400, 'Name ,Email  and Password are required ');
    }
    const normalizeEmail = email.trim().toLowerCase();
    const existingEmail = await loginUser(normalizeEmail);
    if (existingEmail) {
      return errorMessage(res, 400, 'Email already exist');
    }
    const hashedPassword = await argon2.hash(password);

    const user = await registerUser({
      name,
      email: normalizeEmail,
      password: hashedPassword,
    });
    const { password: _password, ...safeUser } = user;
    return sucessMessage(res, 201, 'User register sucessfully', safeUser);
  } catch (error) {
    console.log('check error', error);
    next(error);
  }
};
export const loginUserController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !email.trim() ||
      !password.trim()
    ) {
      return errorMessage(res, 400, 'Email and Password are required');
    }

    const normalizeEmail = email.trim().toLowerCase();

    const user = await loginUser(normalizeEmail);
    if (!user) {
      return errorMessage(res, 401, 'Invalid Email or Password');
    }

    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      return errorMessage(res, 401, 'Invalid Email or Password');
    }

    if (!user.isActive) {
      return errorMessage(res, 403, 'Your account has been deactivated');
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const accessToken = jwt.sign(
      { userId: user.id, role: user.role, isActive: user.isActive },
      process.env.JWT_SECRET,
      {
        expiresIn: '2d',
        algorithm: 'HS256',
      }
    );

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 2 * 24 * 60 * 60 * 1000,
      path: '/',
    });
    const { password: _password, ...safeUser } = user;

    return sucessMessage(res, 200, 'Login successful', {
      user: safeUser,
    });
  } catch (error) {
    console.error('Login Error:', error);
    next(error);
  }
};
export const logoutUserController = async (req, res, next) => {
  try {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 2 * 24 * 60 * 60 * 1000,
      path: '/',
    });
    return sucessMessage(res, 200, 'logout sucessfull');
  } catch (error) {
    next(error);
  }
};
export const getMyUsersController = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const myUser = await getMyUsers(userId);
    if (!myUser) {
      return errorMessage(res, 404, 'User not found ');
    }
    const { password: _password, ...safeUser } = myUser;

    return sucessMessage(
      res,
      200,
      'My user profile fetched successfully',
      safeUser
    );
  } catch (error) {
    console.error('getMyUsersController', error);
    next(error);
  }
};
