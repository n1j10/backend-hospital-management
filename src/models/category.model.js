const { prisma } = require("../config/db");

// These are the MEDICINE categories (pharmacy).

// All categories with the number of medicines in each one (sorted by name).
const findMany = () =>
  prisma.medicineCategory.findMany({
    include: { _count: { select: { medicines: true } } },
    orderBy: { name: "asc" },
  });

const findById = (id) =>
  prisma.medicineCategory.findUnique({
    where: { id },
    include: { _count: { select: { medicines: true } } },
  });

const findByName = (name) => prisma.medicineCategory.findUnique({ where: { name } });

const create = (data) => prisma.medicineCategory.create({ data });

const remove = (id) => prisma.medicineCategory.delete({ where: { id } });

module.exports = { findMany, findById, findByName, create, remove };
