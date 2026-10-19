const { prisma } = require("../config/db");
const { userPublicFields } = require("./helpers");

const create = (data) => prisma.user.create({ data, select: userPublicFields });

const findById = (id) => prisma.user.findUnique({ where: { id }, select: userPublicFields });

// The logged-in user's profile, with the doctor profile if any.
const findProfileById = (id) =>
  prisma.user.findUnique({
    where: { id },
    select: { ...userPublicFields, doctor: { include: { department: true } } },
  });

// Includes the password hash, so it is only used when logging in / checking the email.
const findByEmailWithPassword = (email) => prisma.user.findUnique({ where: { email } });

// All users for the admin page (newest first), with the doctor profile if any.
const findMany = () =>
  prisma.user.findMany({
    select: {
      ...userPublicFields,
      doctor: { include: { department: true } },
    },
    orderBy: { createdAt: "desc" },
  });

const remove = (id) => prisma.user.delete({ where: { id } });

module.exports = { create, findById, findProfileById, findByEmailWithPassword, findMany, remove };
