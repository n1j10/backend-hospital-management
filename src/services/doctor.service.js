const doctorModel = require("../models/doctor.model");
const userModel = require("../models/user.model");
const departmentService = require("./department.service");
const { hashPassword } = require("./auth.service");
const ApiError = require("../utils/ApiError");

// Ported from actions/doctors.ts.

const getAll = ({ search }) => doctorModel.findMany({ search });

const getById = async (doctorId) => {
  const doctor = await doctorModel.findById(doctorId);
  if (!doctor) throw ApiError.notFound("Doctor not found");
  return doctor;
};

// Returns the doctor row only (no relations) - used by other services.
const getBasicById = async (doctorId) => {
  const doctor = await doctorModel.findBasicById(doctorId);
  if (!doctor) throw ApiError.notFound("Doctor not found");
  return doctor;
};

const getForSelect = () => doctorModel.findForSelect();

// Create a new doctor (a user with the DOCTOR role + his doctor profile).
const create = async (data) => {
  const emailUsed = await userModel.findByEmailWithPassword(data.email);
  if (emailUsed) throw ApiError.conflict("Email already registered");

  await departmentService.ensureExists(data.departmentId);

  return doctorModel.createWithUser({
    ...data,
    password: await hashPassword(data.password),
  });
};

const remove = async (doctorId) => {
  const doctor = await getBasicById(doctorId);

  // Deleting the user also deletes the doctor profile (onDelete: Cascade).
  await userModel.remove(doctor.userId);
};

module.exports = { getAll, getById, getBasicById, getForSelect, create, remove };
