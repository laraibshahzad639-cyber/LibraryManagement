import { getBooksBycategory } from '../book/book.service.js';
import { errorMessage } from '../utils/errorMessage.js';
import { sucessMessage } from '../utils/sucessMessage.js';
import {
  createCategory,
  getAllCategories,
  getCategories,
  getCategoryById,
  updateCategory,
} from './category.service.js';

export const addCategoriesController = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const role = req.user.role;
    if (
      typeof name !== 'string' ||
      !name.trim() ||
      typeof description !== 'string' ||
      !description.trim()
    ) {
      return errorMessage(res, 400, 'Name and description are required ');
    }
    if (role !== 'ADMIN') {
      return errorMessage(res, 403, 'Only admin will added categories ');
    }
    const existingCtegories = await getCategories(name);

    if (existingCtegories) {
      return errorMessage(res, 400, 'Category already exist');
    }

    const addNewCategories = await createCategory({
      name: name.trim(),
      description: description.trim(),
    });
    return sucessMessage(
      res,
      201,
      'Categories will added sucessfully',
      addNewCategories
    );
  } catch (error) {
    next(error);
  }
};
export const getCategoryController = async (req, res, next) => {
  try {
    const getCategory = await getAllCategories();
    if (!getCategory || getCategory.length == 0) {
      return errorMessage(res, 404, 'Categories not exist');
    }
    return sucessMessage(
      res,
      200,
      'Categories fetched sucessfully',
      getCategory
    );
  } catch (error) {
    next(error);
  }
};
export const deleteCategorriesController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const getCategory = await getCategoryById(id);
    if (!getCategory) {
      return errorMessage(res, 'Categories not found ');
    }
    const getBooks = await getBooksBycategory(id);
    if (getBooks.length > 0) {
      console.log('check category length', getCategory.length);
      return errorMessage(
        res,
        400,
        'Categories not deleted ,Books are assigned to it '
      );
    }
    return sucessMessage(res, 200, 'Categories are deleted sucessfuly');
  } catch (error) {
    next(error);
  }
};
export const updateCatehoriesControllers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const role = req.user.role;
    const { name, description } = req.body;
    const getCategory = await getCategoryById(id);
    if (!getCategory) {
      return errorMessage(res, 400, 'Categories not found ');
    }
    if (role !== 'ADMIN') {
      return errorMessage(res, 400, 'Only admin can update the categories ');
    }
    const ChangeCategory = await updateCategory(id, req.body);
    return sucessMessage(
      res,
      200,
      'Categorries updated sucessfully',
      ChangeCategory
    );
  } catch (error) {
    next(error);
  }
};
