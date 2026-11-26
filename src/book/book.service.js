import { title } from 'node:process';
import { db } from '../prisma/db.ts';
import { buildPaginationMeta } from '../utils/pagination.js';
export const addBooks = async (data) => {
  return await db.orm.public.Book.create(data);
};
export const getBooksBycategory = async (categoryId) => {
  return db.orm.public.Book.where({ categoryId }).all();
};

export const getAllBooks = async ({
  page1,
  limit1,
  categoryId1,
  available,
  sortBy,
  title,
  author,
  sort,
}) => {
  const offset = (page1 - 1) * limit1;

  let query = db.orm.public.Book;

  if (categoryId1 && categoryId1 !== 'undefined') {
    query = query.where({ categoryId: categoryId1 });
  }
  if (title) {
    query = query.where((u) => u.title.ilike(`%${title}%`));
  }
  if (author) {
    query = query.where((u) => u.author.ilike(`%${author}%`));
  }

  const countQuery = query.aggregate((a) => ({
    total: a.count(),
  }));

  const dataQuery = query
    .orderBy((b) => {
      const field = sortBy === 'title' ? b.title : b.createdAt;
      return sort === 'desc' ? field.desc() : field.asc();
    })
    .limit(limit1)
    .offset(offset)
    .all();

  const [books, countResult] = await Promise.all([dataQuery, countQuery]);
  const meta = buildPaginationMeta(Number(countResult.total), page1, limit1);

  return { books, meta };
};

export const getBooksById = async (id) => {
  return await db.orm.public.Book.where({ id }).first();
};
