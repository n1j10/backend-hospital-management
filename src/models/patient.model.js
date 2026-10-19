const { prisma } = require("../config/db");
const { contains, doctorWithUser, prescriptionsWithMedicine } = require("./helpers");

const findMany = ({ search } = {}) =>
  prisma.patient.findMany({
    where: {
      OR: search ? [{ fullName: contains(search) }, { phone: { contains: search } }] : undefined,
    },
    orderBy: { createdAt: "desc" },
  });

// One patient with his appointments, consultations and admissions.
const findById = (id) =>
  prisma.patient.findUnique({
    where: { id },
    include: {
      appointments: {
        include: { doctor: doctorWithUser, department: true },
        orderBy: { scheduledAt: "desc" },
      },
      consultations: {
        include: { doctor: doctorWithUser, prescriptions: prescriptionsWithMedicine },
        orderBy: { createdAt: "desc" },
      },
      admissions: {
        include: { doctor: doctorWithUser, department: true },
        orderBy: { admitDate: "desc" },
      },
    },
  });

const exists = (id) => prisma.patient.findUnique({ where: { id }, select: { id: true } });

// For the <select> dropdowns.
const findForSelect = () => prisma.patient.findMany({ orderBy: { fullName: "asc" } });

const create = (data) => prisma.patient.create({ data });

const update = (id, data) => prisma.patient.update({ where: { id }, data });

const remove = (id) => prisma.patient.delete({ where: { id } });

module.exports = { findMany, findById, exists, findForSelect, create, update, remove };
