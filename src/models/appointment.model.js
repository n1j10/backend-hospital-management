const { prisma } = require("../config/db");
const {
  contains,
  statusFilter,
  doctorWithUser,
  patientDoctorDepartment,
  prescriptionsWithMedicine,
} = require("./helpers");

const findMany = ({ search, status } = {}) =>
  prisma.appointment.findMany({
    where: {
      status: statusFilter(status),
      OR: search
        ? [{ patient: { fullName: contains(search) } }, { reason: contains(search) }]
        : undefined,
    },
    include: patientDoctorDepartment,
    orderBy: { scheduledAt: "desc" },
  });

// One appointment with its consultation and prescriptions.
const findById = (id) =>
  prisma.appointment.findUnique({
    where: { id },
    include: {
      ...patientDoctorDepartment,
      consultation: { include: { prescriptions: prescriptionsWithMedicine } },
    },
  });

// Used by the consultation service to check the appointment.
const findWithConsultation = (id) =>
  prisma.appointment.findUnique({
    where: { id },
    include: { consultation: { select: { id: true } } },
  });

const findCompletedWithoutConsultation = () =>
  prisma.appointment.findMany({
    where: { status: "COMPLETED", consultation: null },
    include: { patient: true, doctor: doctorWithUser },
    orderBy: { scheduledAt: "desc" },
  });

const findRecent = (take = 5) =>
  prisma.appointment.findMany({
    include: patientDoctorDepartment,
    orderBy: { createdAt: "desc" },
    take,
  });

const create = (data) => prisma.appointment.create({ data, include: patientDoctorDepartment });

const updateStatus = (id, status) =>
  prisma.appointment.update({ where: { id }, data: { status } });

const remove = (id) => prisma.appointment.delete({ where: { id } });

module.exports = {
  findMany,
  findById,
  findWithConsultation,
  findCompletedWithoutConsultation,
  findRecent,
  create,
  updateStatus,
  remove,
};
