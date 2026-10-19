const { prisma } = require("../config/db");
const { contains, statusFilter, patientDoctorDepartment } = require("./helpers");

const findMany = ({ search, status } = {}) =>
  prisma.admission.findMany({
    where: {
      status: statusFilter(status),
      patient: search ? { fullName: contains(search) } : undefined,
    },
    include: patientDoctorDepartment,
    orderBy: { admitDate: "desc" },
  });

const findById = (id) =>
  prisma.admission.findUnique({ where: { id }, include: patientDoctorDepartment });

// A patient can only have one ADMITTED admission at a time.
const findActiveByPatient = (patientId) =>
  prisma.admission.findFirst({ where: { patientId, status: "ADMITTED" } });

const create = (data) => prisma.admission.create({ data, include: patientDoctorDepartment });

const discharge = (id) =>
  prisma.admission.update({
    where: { id },
    data: { status: "DISCHARGED", dischargeDate: new Date() },
    include: patientDoctorDepartment,
  });

module.exports = { findMany, findById, findActiveByPatient, create, discharge };
