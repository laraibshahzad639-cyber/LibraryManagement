import { errorMessage } from '../utils/errorMessage.js';
import { sucessMessage } from '../utils/sucessMessage.js';
import {
  deleteUsers,
  getAllUsers,
  getUsersById,
  UsersStatus,
} from './user.service.js';

export const getUsersController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, role: filterRole, page, limit } = req.query;
    const page1 = Number(page) || 1;
    const limit1 = Number(limit) || 10;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const users = await getUsersById(id);
    if (!users) {
      return errorMessage(res, 404, 'Users not found');
    }

    const { getUsers, meta } = await getAllUsers({
      id,
      name,
      email,
      userId,
      userRole,
      filterRole,
      page1,
      limit1,
    });

    return sucessMessage(res, 200, 'Users fetched sucess fully', {
      getUsers,
      meta,
    });
  } catch (error) {
    console.log('check error', error);
    next(error);
  }
};
export const getUsersByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const users = await getUsersById(id);
    if (!users) {
      return errorMessage(res, 404, 'Users  not foundf');
    }
    return sucessMessage(res, 200, 'Users fetched sucessfully', users);
  } catch (error) {
    console.log('check eerror', error);
    next(error);
  }
};
export const deleteUsersController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const role = req.user.role;
    const users = await getUsersById(id, role);
    if (!users) {
      return errorMessage(res, 404, 'Users not found ');
    }
    const deletedUser = await deleteUsers(id);
    return sucessMessage(res, 200, 'Users Deleted Sucessfully ', deleteUsers);
  } catch (error) {
    console.log('check error', error);
    next(error);
  }
};
export const UsersSatusController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { isActive } = req.query;

    const user = await getUsersById(id);

    if (!user) {
      return errorMessage(res, 404, 'User not found');
    }

    if (id === userId) {
      return errorMessage(res, 400, 'You cannot deactivate your own account');
    }

    if (isActive === 'true' && isActive === 'false') {
      return errorMessage(res, 400, ' isActive must be true  or false');
    }
    if (typeof isActive !== 'string') {
      return errorMessage(res, 400, 'isActive must be boolean');
    }

    const deactiveUser = await UsersStatus(id, isActive);

    return sucessMessage(
      res,
      200,
      'User status updated successfully',
      deactiveUser
    );
  } catch (error) {
    console.log('check error', error);
    next(error);
  }
};
