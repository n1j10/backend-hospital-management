const { prisma } = require("../config/db");
const { contains, lowStockFilter } = require("./helpers");

// Load the medicine with its category.
const medicineInclude = { category: true };

const findMany = ({ search, categoryId } = {}) =>
  prisma.medicine.findMany({
    where: {
      categoryId: categoryId || undefined,
      name: search ? contains(search) : undefined,
    },
    include: medicineInclude,
    orderBy: { createdAt: "desc" },
  });

const findById = (id) => prisma.medicine.findUnique({ where: { id }, include: medicineInclude });

// The medicines that are almost finished (lowest quantity first).
const findLowStock = () =>
  prisma.medicine.findMany({
    where: lowStockFilter,
    include: medicineInclude,
    orderBy: { quantity: "asc" },
  });

// The medicines that expire before the given date (or already expired).
const findExpiringBefore = (date) =>
  prisma.medicine.findMany({
    where: { expiryDate: { lte: date } },
    include: medicineInclude,
    orderBy: { expiryDate: "asc" },
  });

const create = (data) => prisma.medicine.create({ data, include: medicineInclude });

const update = (id, data) =>
  prisma.medicine.update({ where: { id }, data, include: medicineInclude });

const remove = (id) => prisma.medicine.delete({ where: { id } });

module.exports = { findMany, findById, findLowStock, findExpiringBefore, create, update, remove };
