const { prisma } = require("../config/db");

// Shared Prisma pieces, ported from actions/helpers.ts.

// User fields that are safe to send (never the password hash).
const userPublicFields = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
};

// Search text, ignoring upper/lower case (a = A).
// Usage: where: { name: search ? contains(search) : undefined }
const contains = (text) => ({ contains: text, mode: "insensitive" });

// Status filter from a <select>: "ALL" (or empty) means no filter.
const statusFilter = (status) => (status && status !== "ALL" ? status : undefined);

// Load the doctor together with his user (name, email...).
const doctorWithUser = { include: { user: { select: userPublicFields } } };

// Load the patient, the doctor (with his user) and the department.
const patientDoctorDepartment = {
  patient: true,
  doctor: doctorWithUser,
  department: true,
};

// Load the prescription items together with their medicines.
const prescriptionsWithMedicine = { include: { medicine: true } };

// "Low stock" means: quantity <= lowStockThreshold of the same medicine.
const lowStockFilter = {
  quantity: { lte: prisma.medicine.fields.lowStockThreshold },
};

module.exports = {
  userPublicFields,
  contains,
  statusFilter,
  doctorWithUser,
  patientDoctorDepartment,
  prescriptionsWithMedicine,
  lowStockFilter,
};
