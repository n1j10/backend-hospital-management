const patientService = require("./patient.service");
const doctorService = require("./doctor.service");
const departmentService = require("./department.service");
const ApiError = require("../utils/ApiError");

// Appointments and admissions both link a patient to a doctor in a department.
// Checks that all three exist and that the doctor works in that department.
const checkPatientDoctorDepartment = async ({ patientId, doctorId, departmentId }) => {
  const [doctor] = await Promise.all([
    doctorService.getBasicById(doctorId),
    patientService.ensureExists(patientId),
    departmentService.ensureExists(departmentId),
  ]);

  if (doctor.departmentId !== departmentId) {
    throw ApiError.badRequest("The selected doctor does not work in this department");
  }
};

module.exports = { checkPatientDoctorDepartment };
