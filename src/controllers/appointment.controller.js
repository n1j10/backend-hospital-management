const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const appointmentService = require("../services/appointment.service");

const getAll = asyncHandler(async (req, res) => {
  const appointments = await appointmentService.getAll(req.query);
  sendSuccess(res, 200, appointments);
});

const getWithoutConsultation = asyncHandler(async (req, res) => {
  const appointments = await appointmentService.getCompletedWithoutConsultation();
  sendSuccess(res, 200, appointments);
});

const getOne = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.getById(req.params.id);
  sendSuccess(res, 200, appointment);
});

const create = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.create(req.body);
  sendSuccess(res, 201, appointment, "Appointment created successfully");
});

const updateStatus = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.updateStatus(req.params.id, req.body.status);
  sendSuccess(res, 200, appointment, `Appointment ${appointment.status.toLowerCase()} successfully`);
});

const remove = asyncHandler(async (req, res) => {
  await appointmentService.remove(req.params.id);
  sendSuccess(res, 200, null, "Appointment deleted successfully");
});

module.exports = { getAll, getWithoutConsultation, getOne, create, updateStatus, remove };
