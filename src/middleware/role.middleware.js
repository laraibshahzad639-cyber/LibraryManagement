import { errorMessage } from '../utils/errorMessage.js';

export const isAdmin = async (req, res, next) => {
  if (req.user?.role !== 'ADMIN') {
    return errorMessage(res, 403, 'Forbidden Admin access required ');
  }
  next();
};
