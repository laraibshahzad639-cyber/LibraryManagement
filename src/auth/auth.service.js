import { db } from '../prisma/db.ts';

export const registerUser = async (data) => {
  return db.orm.public.User.create(data);
};
export const loginUser = async (email) => {
  return db.orm.public.User.where({ email }).first();
};
export const getMyUsers = async (userId) => {
  console.log('test');
  return await db.orm.public.User.where({ id: userId }).first();
  console.log('test');
};
