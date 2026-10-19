const { prisma } = require("../config/db");
const { lowStockFilter } = require("./helpers");

// Run all the dashboard counts at the same time (faster).
const countStats = ({ start, end }) =>
  Promise.all([
    prisma.patient.count(),
    prisma.doctor.count(),
    prisma.department.count(),
    prisma.appointment.count({ where: { scheduledAt: { gte: start, lt: end } } }),
    prisma.admission.count({ where: { status: "ADMITTED" } }),
    prisma.medicine.count({ where: lowStockFilter }),
  ]);

// Counts used to build the navbar notifications.
// appointmentScope limits the appointments (a doctor sees only his own).
const countNotifications = ({ start, end, expiryLimit, appointmentScope }) =>
  Promise.all([
    prisma.appointment.count({
      where: {
        ...appointmentScope,
        scheduledAt: { gte: start, lt: end },
        status: { in: ["PENDING", "CONFIRMED"] },
      },
    }),
    prisma.medicine.count({ where: lowStockFilter }),
    prisma.medicine.count({ where: { expiryDate: { gte: start, lte: expiryLimit } } }),
  ]);

module.exports = { countStats, countNotifications };
