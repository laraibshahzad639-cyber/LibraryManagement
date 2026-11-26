import {
  curentBorrowBook,
  getActiveBorrow,
  getAvailableCopies,
  getOverDueBooks,
  getReturnedBooks,
  getTotalBooks,
  getTotalCategries,
  getOverdueRecords,
  getTotalUsers,
} from './dashboard.service.js';
import { sucessMessage } from '../utils/sucessMessage.js';
import { getOverdueBorrowRecords } from '../borrow/borrow.service.js';

export const getAdminDashboardController = async (req, res, next) => {
  try {
    const totalBooks = await getTotalBooks();
    const totalcategories = await getTotalCategries();
    const totalUser = await getTotalUsers();
    const totalBorow = await getActiveBorrow();
    const totaloverdue = await getOverdueRecords();
    const totalavailablecopies = await getAvailableCopies();
    return sucessMessage(res, 200, 'Dashboard fetched successfully', {
      totalBooks,
      totalcategories,
      totalUser,
      totalBorow,
      totaloverdue,
      totalavailablecopies,
    });
  } catch (error) {
    next(error);
  }
};
export const getUserDashboardController = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const totalBorrowBooks = await curentBorrowBook(userId);
    const totalReturnBooks = await getReturnedBooks(userId);
    const tottalOverdueBook = await getOverDueBooks(userId);
    return sucessMessage(res, 200, 'User Dashboard fetched sucessfully', {
      totalBorrowBooks,
      totalReturnBooks,
      tottalOverdueBook,
    });
  } catch (error) {
    next(error);
  }
};
