const appointmentModel = require("../models/appointment.model");
const { checkPatientDoctorDepartment } = require("./assignment.service");
const ApiError = require("../utils/ApiError");

// Ported from actions/appointments.ts.

// Once an appointment is cancelled or completed its status is final.
const FINAL_STATUSES = ["CANCELLED", "COMPLETED"];

const getAll = ({ search, status }) => appointmentModel.findMany({ search, status });

const getById = async (appointmentId) => {
  const appointment = await appointmentModel.findById(appointmentId);
  if (!appointment) throw ApiError.notFound("Appointment not found");
  return appointment;
};

const getCompletedWithoutConsultation = () => appointmentModel.findCompletedWithoutConsultation();

const getRecent = () => appointmentModel.findRecent(5);

const create = async (data) => {
  await checkPatientDoctorDepartment(data);

  return appointmentModel.create({
    patientId: data.patientId,
    doctorId: data.doctorId,
    departmentId: data.departmentId,
    scheduledAt: new Date(data.scheduledAt),
    reason: data.reason || null,
  });
};

// Change the status of an appointment (confirm, cancel, complete...).
const updateStatus = async (appointmentId, status) => {
  const appointment = await getById(appointmentId);

  if (FINAL_STATUSES.includes(appointment.status)) {
    throw ApiError.badRequest(`Appointment is already ${appointment.status.toLowerCase()}`);
  }

  return appointmentModel.updateStatus(appointmentId, status);
};

const remove = async (appointmentId) => {
  await getById(appointmentId);
  await appointmentModel.remove(appointmentId);
};

module.exports = {
  getAll,
  getById,
  getCompletedWithoutConsultation,
  getRecent,
  create,
  updateStatus,
  remove,
};
