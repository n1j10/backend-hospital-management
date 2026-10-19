const { prisma } = require("../config/db");
const { contains, doctorWithUser } = require("./helpers");

const findMany = ({ search } = {}) =>
  prisma.department.findMany({
    where: { name: search ? contains(search) : undefined },
    include: {
      doctors: doctorWithUser,
      _count: { select: { doctors: true, appointments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

// One department with its doctors and latest 10 appointments.
const findById = (id) =>
  prisma.department.findUnique({
    where: { id },
    include: {
      doctors: doctorWithUser,
      appointments: {
        include: { patient: true, doctor: doctorWithUser },
        orderBy: { scheduledAt: "desc" },
        take: 10,
      },
    },
  });

const exists = (id) => prisma.department.findUnique({ where: { id }, select: { id: true } });

const findByName = (name) => prisma.department.findUnique({ where: { name } });

// For the <select> dropdowns.
const findForSelect = () => prisma.department.findMany({ orderBy: { name: "asc" } });

const countRelations = (id) =>
  prisma.department.findUnique({
    where: { id },
    select: { _count: { select: { doctors: true, appointments: true, admissions: true } } },
  });

const create = (data) => prisma.department.create({ data });

const update = (id, data) => prisma.department.update({ where: { id }, data });

const remove = (id) => prisma.department.delete({ where: { id } });

module.exports = {
  findMany,
  findById,
  exists,
  findByName,
  findForSelect,
  countRelations,
  create,
  update,
  remove,
};
