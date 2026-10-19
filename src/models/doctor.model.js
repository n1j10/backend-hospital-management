const { prisma } = require("../config/db");
const { contains, userPublicFields } = require("./helpers");

// Load the doctor with his user and department.
const doctorInclude = { user: { select: userPublicFields }, department: true };

const findMany = ({ search } = {}) =>
  prisma.doctor.findMany({
    where: {
      OR: search
        ? [{ user: { name: contains(search) } }, { specialization: contains(search) }]
        : undefined,
    },
    include: doctorInclude,
    orderBy: { createdAt: "desc" },
  });

// One doctor with his latest 20 appointments.
const findById = (id) =>
  prisma.doctor.findUnique({
    where: { id },
    include: {
      ...doctorInclude,
      appointments: {
        include: { patient: true, department: true },
        orderBy: { scheduledAt: "desc" },
        take: 20,
      },
    },
  });

const findBasicById = (id) => prisma.doctor.findUnique({ where: { id } });

// For the <select> dropdowns.
const findForSelect = () =>
  prisma.doctor.findMany({
    include: doctorInclude,
    orderBy: { user: { name: "asc" } },
  });

// Create the user (role DOCTOR) and his doctor profile in ONE query.
const createWithUser = ({ name, email, password, specialization, departmentId }) =>
  prisma.user.create({
    data: {
      name,
      email,
      password,
      role: "DOCTOR",
      doctor: { create: { specialization, departmentId } },
    },
    select: { ...userPublicFields, doctor: { include: { department: true } } },
  });

module.exports = { findMany, findById, findBasicById, findForSelect, createWithUser };
