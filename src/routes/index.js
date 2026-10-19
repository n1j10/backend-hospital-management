const express = require("express");

const router = express.Router();

router.get("/health", (req, res) => res.json({ status: "ok" }));

router.use("/auth", require("./auth.routes"));
router.use("/users", require("./user.routes"));
router.use("/dashboard", require("./dashboard.routes"));
router.use("/departments", require("./department.routes"));
router.use("/doctors", require("./doctor.routes"));
router.use("/patients", require("./patient.routes"));
router.use("/appointments", require("./appointment.routes"));
router.use("/consultations", require("./consultation.routes"));
router.use("/admissions", require("./admission.routes"));
router.use("/categories", require("./category.routes"));
router.use("/medicines", require("./medicine.routes"));
router.use("/prescriptions", require("./prescription.routes"));
router.use("/storage", require("./storage.routes"));

module.exports = router;
