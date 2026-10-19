const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const medicineService = require("../services/medicine.service");

const getAll = asyncHandler(async (req, res) => {
  const medicines = await medicineService.getAll(req.query);
  sendSuccess(res, 200, medicines);
});

const getLowStock = asyncHandler(async (req, res) => {
  const medicines = await medicineService.getLowStock();
  sendSuccess(res, 200, medicines);
});

const getExpiring = asyncHandler(async (req, res) => {
  const medicines = await medicineService.getExpiring();
  sendSuccess(res, 200, medicines);
});

const getOne = asyncHandler(async (req, res) => {
  const medicine = await medicineService.getById(req.params.id);
  sendSuccess(res, 200, medicine);
});

const create = asyncHandler(async (req, res) => {
  const medicine = await medicineService.create(req.body);
  sendSuccess(res, 201, medicine, "Medicine added successfully");
});

const update = asyncHandler(async (req, res) => {
  const medicine = await medicineService.update(req.params.id, req.body);
  sendSuccess(res, 200, medicine, "Medicine updated successfully");
});

const remove = asyncHandler(async (req, res) => {
  await medicineService.remove(req.params.id);
  sendSuccess(res, 200, null, "Medicine deleted successfully");
});

module.exports = { getAll, getLowStock, getExpiring, getOne, create, update, remove };
