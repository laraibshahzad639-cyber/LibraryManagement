import { errorMessage } from '../utils/errorMessage.js';
import { addBooks, getAllBooks, getBooksById } from './book.service.js';
import { sucessMessage } from '../utils/sucessMessage.js';
import { createDataTypeLookup } from '@prisma/orm-postgres/components';

export const AddBooksController = async (req, res, next) => {
  try {
    const { title, author, isbn, totalCopies, description, categoryId } =
      req.body;
    const ISBN = Number(isbn);
    const availableCopies = Number(totalCopies);
    console.log(ISBN);
    if (
      typeof title !== 'string' ||
      typeof author !== 'string' ||
      typeof description !== 'string' ||
      Number.isNaN(ISBN) ||
      Number.isNaN(Number(totalCopies)) ||
      Number(totalCopies) <= 0
    ) {
      console.log(ISBN);
      return errorMessage(res, 400, 'Invalid  books ');
    }
    const role = req.user.role;

    let addBook;
    if (role == 'ADMIN') {
      addBook = await addBooks({
        title,
        author,
        isbn: ISBN,
        totalCopies: availableCopies,
        description,
        availableCopies,
        categoryId,
      });
    }

    if (!addBook) {
      return errorMessage(res, 400, 'Books not added ');
    }
    return sucessMessage(res, 201, 'Books Added Sucessfully', addBook);
  } catch (error) {
    console.log('Check error', error.message);
    console.log(error);
    next(error);
  }
};

export const getAllBooksController = async (req, res, next) => {
  try {
    const { page, limit, categoryId, available, sortBy, title, author } =
      req.query;

    const page1 = Math.max(1, Number(page) || 1);
    const limit1 = Math.max(1, Number(limit) || 10);
    const sort = req.query.sort === 'desc' ? 'desc' : 'asc';

    const { books, meta } = await getAllBooks({
      page1,
      limit1,
      categoryId,
      available,
      sortBy,

      title,
      author,
      sort,
    });

    if (!books || books.length === 0) {
      return errorMessage(res, 404, 'Books not found');
    }

    return sucessMessage(res, 200, 'Books Fetched successfully', {
      books,
      meta,
    });
  } catch (error) {
    console.log('check error', error);
    next(error);
  }
};

export const getBookByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const getBookById = await getBooksById(id);
    if (!getBookById || getBookById.length == 0) {
      return errorMessage(res, 404, 'Books not found ');
    }

    return errorMessage(res, 200, 'Books fetched sucessfully', getBookById);
  } catch (error) {
    next(error);
  }
};
