const consultationModel = require("../models/consultation.model");
const appointmentModel = require("../models/appointment.model");
const ApiError = require("../utils/ApiError");

// Ported from actions/consultations.ts.

const getAll = ({ search }) => consultationModel.findMany({ search });

const getById = async (consultationId) => {
  const consultation = await consultationModel.findById(consultationId);
  if (!consultation) throw ApiError.notFound("Consultation not found");
  return consultation;
};

const ensureExists = async (consultationId) => {
  const consultation = await consultationModel.exists(consultationId);
  if (!consultation) throw ApiError.notFound("Consultation not found");
};

// Create a consultation and mark its appointment as COMPLETED.
const create = async (data) => {
  const appointment = await appointmentModel.findWithConsultation(data.appointmentId);
  if (!appointment) throw ApiError.notFound("Appointment not found");

  if (appointment.consultation) {
    throw ApiError.conflict("This appointment already has a consultation");
  }
  if (appointment.status === "CANCELLED") {
    throw ApiError.badRequest("Cannot add a consultation to a cancelled appointment");
  }
  // If the client sends patient/doctor they must match; otherwise use the appointment's.
  if (
    (data.patientId && appointment.patientId !== data.patientId) ||
    (data.doctorId && appointment.doctorId !== data.doctorId)
  ) {
    throw ApiError.badRequest("Patient and doctor must match the appointment");
  }

  return consultationModel.createAndCompleteAppointment({
    appointmentId: data.appointmentId,
    patientId: appointment.patientId,
    doctorId: appointment.doctorId,
    diagnosis: data.diagnosis || null,
    notes: data.notes || null,
  });
};

module.exports = { getAll, getById, ensureExists, create };
