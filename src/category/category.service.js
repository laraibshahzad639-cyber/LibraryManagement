import { db } from '../prisma/db.ts';
export const createCategory = async (data) => {
  return await db.orm.public.Category.create(data);
};
export const getCategories = async (name) => {
  return await db.orm.public.Category.where({ name }).first();
};
export const getAllCategories = async () => {
  return await db.orm.public.Category.all();
};
export const deleteCategories = async (id) => {
  return await db.orm.public.where({ id }).delete();
};
export const getCategoryById = async (id) => {
  return db.orm.public.Category.where({ id }).first();
};
export const updateCategory = (id, data) => {
  return db.orm.public.Category.where({ id }).update(data);
};
