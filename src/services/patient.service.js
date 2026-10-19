const patientModel = require("../models/patient.model");
const ApiError = require("../utils/ApiError");

// Ported from actions/patients.ts.

// The body is used in both create and update (update may be partial).
// Returns the data ready for the database (readPatientForm in the actions).
const toPatientData = (fields) => {
  const data = { ...fields };
  if (fields.dateOfBirth !== undefined) data.dateOfBirth = new Date(fields.dateOfBirth);
  if (fields.address !== undefined) data.address = fields.address || null;
  if (fields.bloodType !== undefined) data.bloodType = fields.bloodType || null;
  return data;
};

const getAll = ({ search }) => patientModel.findMany({ search });

const getById = async (patientId) => {
  const patient = await patientModel.findById(patientId);
  if (!patient) throw ApiError.notFound("Patient not found");
  return patient;
};

const ensureExists = async (patientId) => {
  const patient = await patientModel.exists(patientId);
  if (!patient) throw ApiError.notFound("Patient not found");
};

const getForSelect = () => patientModel.findForSelect();

const create = (data) => patientModel.create(toPatientData(data));

const update = async (patientId, data) => {
  await ensureExists(patientId);
  return patientModel.update(patientId, toPatientData(data));
};

const remove = async (patientId) => {
  await ensureExists(patientId);
  await patientModel.remove(patientId);
};

module.exports = { getAll, getById, ensureExists, getForSelect, create, update, remove };
