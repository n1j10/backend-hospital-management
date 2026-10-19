const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const admissionService = require("../services/admission.service");

const getAll = asyncHandler(async (req, res) => {
  const admissions = await admissionService.getAll(req.query);
  sendSuccess(res, 200, admissions);
});

const getOne = asyncHandler(async (req, res) => {
  const admission = await admissionService.getById(req.params.id);
  sendSuccess(res, 200, admission);
});

const create = asyncHandler(async (req, res) => {
  const admission = await admissionService.create(req.body);
  sendSuccess(res, 201, admission, "Patient admitted successfully");
});

const discharge = asyncHandler(async (req, res) => {
  const admission = await admissionService.discharge(req.params.id);
  sendSuccess(res, 200, admission, "Patient discharged successfully");
});

module.exports = { getAll, getOne, create, discharge };
