const medicineModel = require("../models/medicine.model");
const categoryService = require("./category.service");
const { getDateAfterDays } = require("../utils/date");
const ApiError = require("../utils/ApiError");

// Ported from actions/medicines.ts.

const EXPIRING_WITHIN_DAYS = 30;

// The body is used in both create and update (update may be partial).
// Returns the data ready for the database (readMedicineForm in the actions).
const toMedicineData = (fields) => {
  const data = { ...fields };
  if (fields.unit !== undefined) data.unit = fields.unit || null;
  if (fields.expiryDate !== undefined) data.expiryDate = new Date(fields.expiryDate);
  return data;
};

const getAll = ({ search, categoryId }) => medicineModel.findMany({ search, categoryId });

const getById = async (medicineId) => {
  const medicine = await medicineModel.findById(medicineId);
  if (!medicine) throw ApiError.notFound("Medicine not found");
  return medicine;
};

const getLowStock = () => medicineModel.findLowStock();

// The medicines that expire in the next 30 days (or already expired).
const getExpiring = () => medicineModel.findExpiringBefore(getDateAfterDays(EXPIRING_WITHIN_DAYS));

const create = async (data) => {
  await categoryService.getById(data.categoryId);
  return medicineModel.create(toMedicineData(data));
};

const update = async (medicineId, data) => {
  await getById(medicineId);
  if (data.categoryId) await categoryService.getById(data.categoryId);
  return medicineModel.update(medicineId, toMedicineData(data));
};

const remove = async (medicineId) => {
  await getById(medicineId);
  await medicineModel.remove(medicineId);
};

module.exports = { getAll, getById, getLowStock, getExpiring, create, update, remove };
