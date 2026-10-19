const { prisma } = require("../config/db");
const { prescriptionsWithMedicine } = require("./helpers");

const findById = (id) => prisma.prescriptionItem.findUnique({ where: { id } });

const create = (data) =>
  prisma.prescriptionItem.create({ data, include: prescriptionsWithMedicine.include });

const remove = (id) => prisma.prescriptionItem.delete({ where: { id } });

module.exports = { findById, create, remove };
