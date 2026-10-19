const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const dashboardService = require("../services/dashboard.service");
const appointmentService = require("../services/appointment.service");

const getStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getStats();
  sendSuccess(res, 200, stats);
});

const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await dashboardService.getNotifications(req.user);
  sendSuccess(res, 200, notifications);
});

const getRecentAppointments = asyncHandler(async (req, res) => {
  const appointments = await appointmentService.getRecent();
  sendSuccess(res, 200, appointments);
});

module.exports = { getStats, getNotifications, getRecentAppointments };
