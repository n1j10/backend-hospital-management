const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const prescriptionService = require("../services/prescription.service");

const create = asyncHandler(async (req, res) => {
  const item = await prescriptionService.create(req.body);
  sendSuccess(res, 201, item, "Prescription item added");
});

const remove = asyncHandler(async (req, res) => {
  await prescriptionService.remove(req.params.id);
  sendSuccess(res, 200, null, "Prescription item removed");
});

module.exports = { create, remove };
