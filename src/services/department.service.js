const departmentModel = require("../models/department.model");
const ApiError = require("../utils/ApiError");

// Ported from actions/departments.ts.

const getAll = ({ search }) => departmentModel.findMany({ search });

const getById = async (departmentId) => {
  const department = await departmentModel.findById(departmentId);
  if (!department) throw ApiError.notFound("Department not found");
  return department;
};

// Throws if the department does not exist (used by doctors, appointments, admissions).
const ensureExists = async (departmentId) => {
  const department = await departmentModel.exists(departmentId);
  if (!department) throw ApiError.notFound("Department not found");
};

const getForSelect = () => departmentModel.findForSelect();

const ensureNameIsFree = async (name, departmentId) => {
  const existing = await departmentModel.findByName(name);
  if (existing && existing.id !== departmentId) {
    throw ApiError.conflict("A department with this name already exists");
  }
};

const create = async (data) => {
  await ensureNameIsFree(data.name);
  return departmentModel.create(data);
};

const update = async (departmentId, data) => {
  await ensureExists(departmentId);
  if (data.name) await ensureNameIsFree(data.name, departmentId);
  return departmentModel.update(departmentId, data);
};

const remove = async (departmentId) => {
  const department = await departmentModel.countRelations(departmentId);
  if (!department) throw ApiError.notFound("Department not found");

  const { doctors, appointments, admissions } = department._count;
  if (doctors || appointments || admissions) {
    throw ApiError.conflict(
      "Department still has doctors, appointments or admissions. Move or remove them first",
    );
  }

  await departmentModel.remove(departmentId);
};

module.exports = { getAll, getById, ensureExists, getForSelect, create, update, remove };
