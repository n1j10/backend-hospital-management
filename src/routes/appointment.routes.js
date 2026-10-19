const express = require("express");
const controller = require("../controllers/appointment.controller");
const validate = require("../middlewares/validate.middleware");
const { authenticate, requireAdmin } = require("../middlewares/auth.middleware");
const {
  appointmentSchema,
  updateStatusSchema,
  listAppointmentsSchema,
} = require("../validations/appointment.validation");

const router = express.Router();

router.use(authenticate);

// Any logged-in user
router.get("/", validate(listAppointmentsSchema, "query"), controller.getAll);
router.get("/without-consultation", controller.getWithoutConsultation);
router.get("/:id", controller.getOne);
router.post("/", validate(appointmentSchema), controller.create);
router.patch("/:id/status", validate(updateStatusSchema), controller.updateStatus);

// Admin
router.delete("/:id", requireAdmin, controller.remove);

module.exports = router;
