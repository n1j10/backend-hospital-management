const express = require("express");
const controller = require("../controllers/dashboard.controller");
const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authenticate);

router.get("/stats", controller.getStats);
router.get("/notifications", controller.getNotifications);
router.get("/recent-appointments", controller.getRecentAppointments);

module.exports = router;
