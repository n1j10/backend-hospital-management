const dashboardModel = require("../models/dashboard.model");
const { getTodayRange, getDateAfterDays } = require("../utils/date");

// Ported from actions/dashboard.ts.

// The numbers shown in the dashboard cards.
const getStats = async () => {
  const [
    totalPatients,
    totalDoctors,
    totalDepartments,
    todayAppointments,
    activeAdmissions,
    lowStockMedicines,
  ] = await dashboardModel.countStats(getTodayRange());

  return {
    totalPatients,
    totalDoctors,
    totalDepartments,
    todayAppointments,
    activeAdmissions,
    lowStockMedicines,
  };
};

// Notifications are calculated from the current data (nothing is saved in DB).
// `href` points to the frontend page that shows the details.
const getNotifications = async (user) => {
  const { start, end } = getTodayRange();

  // A doctor sees only his own appointments, other roles see all.
  const appointmentScope = user.role === "DOCTOR" ? { doctor: { userId: user.id } } : {};

  const [todayAppointments, lowStockMedicines, expiringMedicines] =
    await dashboardModel.countNotifications({
      start,
      end,
      expiryLimit: getDateAfterDays(30),
      appointmentScope,
    });

  const notifications = [];

  if (todayAppointments > 0) {
    notifications.push({
      id: `appointments-${todayAppointments}`,
      title: `${todayAppointments} appointment(s) today`,
      description: "Review today's pending and confirmed appointments.",
      href: "/appointments?status=ALL",
      type: "info",
    });
  }

  if (lowStockMedicines > 0) {
    notifications.push({
      id: `low-stock-${lowStockMedicines}`,
      title: `${lowStockMedicines} medicine(s) need restocking`,
      description: "Stock has reached or fallen below its safety threshold.",
      href: "/pharmacy/low-stock",
      type: "warning",
    });
  }

  if (expiringMedicines > 0) {
    notifications.push({
      id: `expiring-${expiringMedicines}`,
      title: `${expiringMedicines} medicine(s) expire within 30 days`,
      description: "Check expiry dates and plan stock rotation.",
      href: "/pharmacy/expiring",
      type: "warning",
    });
  }

  return notifications;
};

module.exports = { getStats, getNotifications };
