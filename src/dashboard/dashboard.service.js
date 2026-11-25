import { count } from 'node:console';
import { db } from '../prisma/db.ts';

export const getTotalBooks = async () => {
  // const books = await db.orm.public.Book.all();
  const books = await db.orm.public.Book.aggregate((a) => ({
    count: a.count(),
  }));

  //   return books.length;
  return books;
};
export const getTotalCategries = async () => {
  //   const categories = await db.orm.public.Category.all();
  const categories = await db.orm.public.Category.aggregate((c) => ({
    count: c.count(),
  }));
  return categories;
};
export const getTotalUsers = async () => {
  const totalUsers = await db.orm.public.User.aggregate((u) => ({
    count: u.count(),
  }));
  return totalUsers;
};
export const getActiveBorrow = async () => {
  const totalActiveBorrow = await db.orm.public.BorrowRecord.aggregate((b) => ({
    count: b.count(),
  }));
  return totalActiveBorrow;
};

export const getOverdueRecords = async () => {
  const totalOverdue = await db.orm.public.BorrowRecord.aggregate((a) => ({
    count: a.count(),
  }));
  return totalOverdue;
};
export const getAvailableCopies = async () => {
  const totalAvaileableCopies = await db.orm.public.Book.aggregate((b) => ({
    count: b.count(),
  }));
  return totalAvaileableCopies;
};
export const curentBorrowBook = async () => {
  const curentBorrowBook = await db.orm.public.BorrowRecord.where({
    status: 'BORROWED',
  }).aggregate((u) => ({
    count: u.count(),
  }));
  return curentBorrowBook;
};
export const getReturnedBooks = async () => {
  const returnedBooks = await db.orm.public.BorrowRecord.where({
    status: 'RETURNED',
  }).aggregate((u) => ({
    count: u.count(),
  }));
  return returnedBooks;
};

export const getOverDueBooks = async () => {
  const overDue = await db.orm.public.BorrowRecord.where({}).aggregate((u) => ({
    count: u.count(),
  }));
  return returnedBooks;
};
