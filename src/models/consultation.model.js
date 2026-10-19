const { prisma } = require("../config/db");
const { contains, doctorWithUser, prescriptionsWithMedicine } = require("./helpers");

// Load the consultation with its patient, doctor, appointment and medicines.
const consultationInclude = {
  patient: true,
  doctor: doctorWithUser,
  appointment: true,
  prescriptions: prescriptionsWithMedicine,
};

const findMany = ({ search } = {}) =>
  prisma.consultation.findMany({
    where: {
      OR: search
        ? [{ patient: { fullName: contains(search) } }, { diagnosis: contains(search) }]
        : undefined,
    },
    include: consultationInclude,
    orderBy: { createdAt: "desc" },
  });

const findById = (id) =>
  prisma.consultation.findUnique({ where: { id }, include: consultationInclude });

const exists = (id) => prisma.consultation.findUnique({ where: { id }, select: { id: true } });

// Two things must happen together:
// 1. create the consultation
// 2. mark the appointment as COMPLETED
// $transaction means: if one fails, both are cancelled.
const createAndCompleteAppointment = async (data) => {
  const [consultation] = await prisma.$transaction([
    prisma.consultation.create({ data, include: consultationInclude }),
    prisma.appointment.update({
      where: { id: data.appointmentId },
      data: { status: "COMPLETED" },
    }),
  ]);
  return consultation;
};

module.exports = { findMany, findById, exists, createAndCompleteAppointment };
