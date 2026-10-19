const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const patientService = require("../services/patient.service");

const getAll = asyncHandler(async (req, res) => {
  const patients = await patientService.getAll(req.query);
  sendSuccess(res, 200, patients);
});

const getForSelect = asyncHandler(async (req, res) => {
  const patients = await patientService.getForSelect();
  sendSuccess(res, 200, patients);
});

const getOne = asyncHandler(async (req, res) => {
  const patient = await patientService.getById(req.params.id);
  sendSuccess(res, 200, patient);
});

const create = asyncHandler(async (req, res) => {
  const patient = await patientService.create(req.body);
  sendSuccess(res, 201, patient, "Patient registered successfully");
});

const update = asyncHandler(async (req, res) => {
  const patient = await patientService.update(req.params.id, req.body);
  sendSuccess(res, 200, patient, "Patient updated successfully");
});

const remove = asyncHandler(async (req, res) => {
  await patientService.remove(req.params.id);
  sendSuccess(res, 200, null, "Patient deleted successfully");
});

module.exports = { getAll, getForSelect, getOne, create, update, remove };
