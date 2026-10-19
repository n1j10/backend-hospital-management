const admissionModel = require("../models/admission.model");
const { checkPatientDoctorDepartment } = require("./assignment.service");
const ApiError = require("../utils/ApiError");

// Ported from actions/admissions.ts.

const getAll = ({ search, status }) => admissionModel.findMany({ search, status });

const getById = async (admissionId) => {
  const admission = await admissionModel.findById(admissionId);
  if (!admission) throw ApiError.notFound("Admission not found");
  return admission;
};

// Admit a patient to the hospital.
const create = async (data) => {
  await checkPatientDoctorDepartment(data);

  const active = await admissionModel.findActiveByPatient(data.patientId);
  if (active) throw ApiError.conflict("Patient is already admitted");

  return admissionModel.create({
    patientId: data.patientId,
    doctorId: data.doctorId,
    departmentId: data.departmentId,
    reason: data.reason || null,
  });
};

// Discharge a patient (status DISCHARGED + discharge date = now).
const discharge = async (admissionId) => {
  const admission = await getById(admissionId);
  if (admission.status === "DISCHARGED") {
    throw ApiError.badRequest("Patient is already discharged");
  }

  return admissionModel.discharge(admissionId);
};

module.exports = { getAll, getById, create, discharge };
