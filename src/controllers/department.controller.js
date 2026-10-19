const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const departmentService = require("../services/department.service");

const getAll = asyncHandler(async (req, res) => {
  const departments = await departmentService.getAll(req.query);
  sendSuccess(res, 200, departments);
});

const getForSelect = asyncHandler(async (req, res) => {
  const departments = await departmentService.getForSelect();
  sendSuccess(res, 200, departments);
});

const getOne = asyncHandler(async (req, res) => {
  const department = await departmentService.getById(req.params.id);
  sendSuccess(res, 200, department);
});

const create = asyncHandler(async (req, res) => {
  const department = await departmentService.create(req.body);
  sendSuccess(res, 201, department, "Department created successfully");
});

const update = asyncHandler(async (req, res) => {
  const department = await departmentService.update(req.params.id, req.body);
  sendSuccess(res, 200, department, "Department updated successfully");
});

const remove = asyncHandler(async (req, res) => {
  await departmentService.remove(req.params.id);
  sendSuccess(res, 200, null, "Department deleted successfully");
});

module.exports = { getAll, getForSelect, getOne, create, update, remove };
