const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const consultationService = require("../services/consultation.service");

const getAll = asyncHandler(async (req, res) => {
  const consultations = await consultationService.getAll(req.query);
  sendSuccess(res, 200, consultations);
});

const getOne = asyncHandler(async (req, res) => {
  const consultation = await consultationService.getById(req.params.id);
  sendSuccess(res, 200, consultation);
});

const create = asyncHandler(async (req, res) => {
  const consultation = await consultationService.create(req.body);
  sendSuccess(res, 201, consultation, "Consultation created successfully");
});

module.exports = { getAll, getOne, create };
