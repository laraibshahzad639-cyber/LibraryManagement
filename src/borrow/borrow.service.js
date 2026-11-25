import { db } from '../prisma/db.ts';

export const addBorrowBooks = async (data) => {
  return await db.orm.public.BorrowRecord.create(data);
};

export const getActiveBorrowRecords = async (userId) => {
  return await db.orm.public.BorrowRecord.where({
    userId,
    status: 'BORROWED',
  }).all();
};

export const updateBoooksAvailableCopies = async (bookId, availableCopies) => {
  return await db.orm.public.Book.where({ id: bookId }).update({
    availableCopies,
  });
};
export const myBorrowBook = async (userId) => {
  return await db.orm.public.BorrowRecord.where({
    userId,
    status: 'BORROWED',
  }).all();
};
export const borrowHistory = async (userId) => {
  if (userId) {
    return await db.orm.public.BorrowRecord.where({ userId })
      .include('book', (book) => book.select('title', 'author'))

      .all();
  }

  return await db.orm.public.BorrowRecord.include('book', (book) =>
    book.select('title', 'author')
  )
    .include('user', (user) => user.select('name', 'email'))
    .all();
};
export const getBorrowBookById = async (id) => {
  return await db.orm.public.BorrowRecord.where({ id }).first();
};
export const returnBorrowBook = async (id) => {
  return db.orm.public.BorrowRecord.where({ id }).update({
    status: 'RETURNED',
    returnedAt: new Date(),
  });
};
export const getOverdueBorrowRecords = async (userId, role) => {
  const currentDate = new Date();

  let records;

  if (role === 'ADMIN') {
    records = await db.orm.public.BorrowRecord.where({
      status: 'BORROWED',
    }).all();
  } else {
    records = await db.orm.public.BorrowRecord.where({
      userId,
      status: 'BORROWED',
    }).all();
  }

  const overdueBorrowBooks = records.filter((record) => {
    if (record.dueDate < currentDate) {
      return true;
    } else {
      return false;
    }
  });

  overdueBorrowBooks.sort((a, b) => {
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  return overdueBorrowBooks;
};
export const getAllBorrowBooks = async (userId, role) => {
  if (role === 'ADMIN') {
    return await db.orm.public.BorrowRecord.where({ status: 'BORROWED' }).all();
  }
};
