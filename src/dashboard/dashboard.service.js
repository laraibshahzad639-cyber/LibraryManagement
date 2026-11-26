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
  const totalActiveBorrow = await db.orm.public.BorrowRecord.where({
    status: 'BORROWED',
  }).aggregate((b) => ({
    count: b.count(),
  }));
  return totalActiveBorrow;
};

export const getOverdueRecords = async (now = new Date()) => {
  const totaloverdue = await db.orm.public.BorrowRecord.where({
    status: 'BORROWED',
  })
    .where((r) => r.dueDate.lt(now))
    .aggregate((u) => ({
      count: u.count(),
    }));
  console.log(totaloverdue);
  return totaloverdue;
};

export const getAvailableCopies = async () => {
  const totalAvaileableCopies = await db.orm.public.Book.aggregate((b) => ({
    count: b.sum('availableCopies'),
  }));
  return totalAvaileableCopies;
};
export const curentBorrowBook = async (userId) => {
  const curentBorrowBook = await db.orm.public.BorrowRecord.where({
    userId,
    status: 'BORROWED',
  }).aggregate((u) => ({
    count: u.count(),
  }));
  return curentBorrowBook;
};
export const getReturnedBooks = async (userId) => {
  const returnedBooks = await db.orm.public.BorrowRecord.where({
    userId,
    status: 'RETURNED',
  }).aggregate((u) => ({
    count: u.count(),
  }));
  return returnedBooks;
};

export const getOverDueBooks = async (userId, now = new Date()) => {
  const overDue = await db.orm.public.BorrowRecord.where({ userId })
    .where((r) => r.dueDate.lt(now))
    .aggregate((u) => ({
      count: u.count(),
    }));
  return overDue;
};
