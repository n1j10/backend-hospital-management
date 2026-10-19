const categoryModel = require("../models/category.model");
const ApiError = require("../utils/ApiError");

// Ported from actions/categories.ts (medicine categories).

const getAll = () => categoryModel.findMany();

const getById = async (categoryId) => {
  const category = await categoryModel.findById(categoryId);
  if (!category) throw ApiError.notFound("Category not found");
  return category;
};

const create = async (data) => {
  const existing = await categoryModel.findByName(data.name);
  if (existing) throw ApiError.conflict("A category with this name already exists");

  return categoryModel.create(data);
};

const remove = async (categoryId) => {
  const category = await getById(categoryId);
  if (category._count.medicines) {
    throw ApiError.conflict("Category still has medicines. Move or remove them first");
  }

  await categoryModel.remove(categoryId);
};

module.exports = { getAll, getById, create, remove };
