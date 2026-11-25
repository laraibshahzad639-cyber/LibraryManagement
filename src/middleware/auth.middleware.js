import jwt from 'jsonwebtoken';

import { errorMessage } from '../utils/errorMessage.js';
import { sucessMessage } from '../utils/sucessMessage.js';
import { getUsersById } from '../user/user.service.js';

export const authenticationMiddleware = async (req, res, next) => {
  const accessToken = req.cookies?.access_token;

  if (!accessToken) {
    return errorMessage(res, 401, 'Authentication required');
  }

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not configured');

    return errorMessage(res, 500, 'Server configuration error');
  }

  let decoded;

  try {
    decoded = jwt.verify(accessToken, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
    });
  } catch (error) {
    return errorMessage(res, 401, 'Invalid or expired token');
  }

  if (!decoded.userId || typeof decoded.userId !== 'string') {
    return errorMessage(res, 401, 'Invalid token payload');
  }

  try {
    const user = await getUsersById(decoded.userId);

    if (!user) {
      return errorMessage(res, 401, 'User not found');
    }

    if (user.isActive === false) {
      return errorMessage(res, 403, 'Your account has been deactivated');
    }

    req.user = {
      userId: user.id,
      role: user.role,
      isActive: user.isActive,
    };

    return next();
  } catch (error) {
    return next(error);
  }
};
