const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const categoryService = require("../services/category.service");

const getAll = asyncHandler(async (req, res) => {
  const categories = await categoryService.getAll();
  sendSuccess(res, 200, categories);
});

const create = asyncHandler(async (req, res) => {
  const category = await categoryService.create(req.body);
  sendSuccess(res, 201, category, "Category created successfully");
});

const remove = asyncHandler(async (req, res) => {
  await categoryService.remove(req.params.id);
  sendSuccess(res, 200, null, "Category deleted successfully");
});

module.exports = { getAll, create, remove };
