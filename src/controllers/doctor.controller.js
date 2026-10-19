const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const doctorService = require("../services/doctor.service");

const getAll = asyncHandler(async (req, res) => {
  const doctors = await doctorService.getAll(req.query);
  sendSuccess(res, 200, doctors);
});

const getForSelect = asyncHandler(async (req, res) => {
  const doctors = await doctorService.getForSelect();
  sendSuccess(res, 200, doctors);
});

const getOne = asyncHandler(async (req, res) => {
  const doctor = await doctorService.getById(req.params.id);
  sendSuccess(res, 200, doctor);
});

const create = asyncHandler(async (req, res) => {
  const doctor = await doctorService.create(req.body);
  sendSuccess(res, 201, doctor, "Doctor created successfully");
});

const remove = asyncHandler(async (req, res) => {
  await doctorService.remove(req.params.id);
  sendSuccess(res, 200, null, "Doctor deleted successfully");
});

module.exports = { getAll, getForSelect, getOne, create, remove };
