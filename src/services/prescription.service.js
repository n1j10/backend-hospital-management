const prescriptionModel = require("../models/prescription.model");
const consultationService = require("./consultation.service");
const medicineService = require("./medicine.service");
const ApiError = require("../utils/ApiError");

// Ported from actions/prescriptions.ts.

// Add a medicine to a consultation's prescription.
const create = async (data) => {
  await consultationService.ensureExists(data.consultationId);
  await medicineService.getById(data.medicineId);

  return prescriptionModel.create({ ...data, dosage: data.dosage || null });
};

// Remove one medicine from a prescription.
const remove = async (itemId) => {
  const item = await prescriptionModel.findById(itemId);
  if (!item) throw ApiError.notFound("Prescription item not found");

  await prescriptionModel.remove(itemId);
};

module.exports = { create, remove };
