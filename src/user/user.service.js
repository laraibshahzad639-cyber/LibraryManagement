import { db } from '../prisma/db.ts';

export const getAllUsers = async ({
  id,
  name,
  email,
  userId,
  userRole,
  filterRole,
  page1 = 1,
  limit1 = 10,
}) => {
  const offset = (page1 - 1) * limit1;
  let query = db.orm.public.User;

  if (id) {
    query = query.where((u) => u.id.eq(id));
  }

  if (userRole !== 'ADMIN' && userId) {
    query = query.where((u) => u.userId.eq(userId));
  }

  if (filterRole) {
    query = query.where((u) => u.role.eq(filterRole));
  }

  if (name) {
    query = query.where((u) => u.name.ilike(`%${name}%`));
  }

  if (email) {
    query = query.where((u) => u.email.ilike(`%${email}%`));
  }

  return await query.limit(limit1).offset(offset).all();
};

export const getUsersById = async (id) => {
  return await db.orm.public.User.where({ id }).first();
};
export const deleteUsers = async (id, role) => {
  return await db.orm.public.User.where({ id, role }).delete();
};
export const UsersStatus = async (id, isActive) => {
  return await db.orm.public.User.where({ id }).update({ isActive });
};
