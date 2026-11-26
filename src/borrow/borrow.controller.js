import { getUsersById, UsersStatus } from '../user/user.service.js';
import { errorMessage } from '../utils/errorMessage.js';
import { sucessMessage } from '../utils/sucessMessage.js';
import {
  addBorrowBooks,
  borrowHistory,
  getActiveBorrowRecords,
  getBorrowBookById,
  myBorrowBook,
  updateBoooksAvailableCopies,
  returnBorrowBook,
  getAllBorrowBooks,
  getOverdueBorrowRecords,
} from './borrow.service.js';
import { getBooksById } from '../book/book.service.js';
import { check } from '@prisma/orm-postgres/contract-builder';
import { error } from 'node:console';

export const addBorrowBooksController = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    const role = req.user.role;
    const userId = req.user.userId;
    const existingUser = await getUsersById(userId);
    if (!existingUser) {
      return errorMessage(res, 404, 'Users not found');
    }
    if (existingUser.isActive == false) {
      return errorMessage(res, 400, 'User not active');
    }
    const getBooks = await getBooksById(bookId);
    if (!getBooks) {
      return errorMessage(res, 404, 'Books not found ');
    }
    const checkBorrowRecord = await getActiveBorrowRecords(userId);
    if (checkBorrowRecord.length >= 3) {
      return errorMessage(res, 400, ' You can borrow maximum 3 books');
    }
    if (getBooks.isRestricted === true) {
      return errorMessage(
        res,
        403,
        " This book cann't be borrowed.! Restercited by Admin"
      );
    }

    const bookAlreadyborrow = checkBorrowRecord.some(
      (Book) => Book.bookId == bookId
    );
    if (bookAlreadyborrow) {
      return errorMessage(res, 400, 'Book already borrowed');
    }

    if (getBooks.availableCopies <= 0) {
      return errorMessage(res, 400, 'Available copies not exists');
    }
    const borrowedAt = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);
    const BorrowedData = {
      userId,
      bookId,
      borrowedAt,
      status: 'BORROWED',
      dueDate,
    };
    const addBorrowedBook = await addBorrowBooks(BorrowedData);
    if (!addBorrowedBook) {
      return errorMessage(res, 400, 'Books not borrowed');
    }
    const availableCopies = getBooks.availableCopies - 1;
    await updateBoooksAvailableCopies(bookId, availableCopies);
    return sucessMessage(
      res,
      201,
      'Books Borrowed successfully',
      addBorrowedBook
    );
  } catch (error) {
    next(error);
  }
};
export const getMyBorowBooksController = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const getMyBook = await myBorrowBook(userId);
    if (!getMyBook || getMyBook.length == 0) {
      return errorMessage(res, 404, 'My borrow book not exist');
    }
    return sucessMessage(
      res,
      200,
      'My borrow book fetched sucessfully',
      getMyBook
    );
  } catch (error) {
    next(error);
  }
};
export const borrowHistoryController = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const role = req.user.role;

    let checkHistory;
    if (role === 'ADMIN') {
      checkHistory = await borrowHistory();
    } else {
      checkHistory = await borrowHistory(userId);
    }

    if (!checkHistory || checkHistory.length == 0) {
      return errorMessage(res, 404, 'History is empty');
    } else {
      return sucessMessage(
        res,
        200,
        'User borrow history fetched sucessfully',
        checkHistory
      );
    }
  } catch (error) {
    next(error);
  }
};
export const returnBorrowBooksController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const BorrowRecord = await getBorrowBookById(id);

    if (!BorrowRecord) {
      return errorMessage(res, 404, 'Borrow Record doesnot exist');
    }

    if (BorrowRecord.userId !== userId) {
      return errorMessage(res, 403, 'You can return only your own books');
    }

    if (BorrowRecord.status === 'RETURNED') {
      return errorMessage(res, 400, 'Books already returned');
    }

    await returnBorrowBook(id);

    const book = await getBooksById(BorrowRecord.bookId);

    const availableCopies = book.availableCopies + 1;

    await updateBoooksAvailableCopies(BorrowRecord.bookId, availableCopies);

    return sucessMessage(res, 200, 'Book returned successfully', {
      status: 'RETURNED',
      returnedAt: new Date(),
      availableCopies,
    });
  } catch (error) {
    next(error);
  }
};
export const getOverdueBorrowRecordsController = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const role = req.user.role;

    const overdueBooks = await getOverdueBorrowRecords(userId, role);

    if (!overdueBooks || overdueBooks.length === 0) {
      return errorMessage(res, 404, 'No overdue books found');
    }

    return sucessMessage(
      res,
      200,
      'Overdue books fetched successfully',
      overdueBooks
    );
  } catch (error) {
    next(error);
  }
};
export const getBorrowBooksController = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const role = req.user.role;
    const borowBooks = await getAllBorrowBooks(userId, role);
    if (!borowBooks || borowBooks.length == 0) {
      return errorMessage(res, 404, 'No Borrow book found');
    }
    return sucessMessage(
      res,
      200,
      'BorrowBooks fetched sucessfully',
      borowBooks
    );
  } catch (error) {
    next(error);
  }
};
