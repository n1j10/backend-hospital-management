const express = require("express");
const controller = require("../controllers/patient.controller");
const validate = require("../middlewares/validate.middleware");
const { authenticate, requireAdmin } = require("../middlewares/auth.middleware");
const { searchQuerySchema } = require("../validations/common.validation");
const { patientSchema, updatePatientSchema } = require("../validations/patient.validation");

const router = express.Router();

router.use(authenticate);

// Any logged-in user
router.get("/", validate(searchQuerySchema, "query"), controller.getAll);
router.get("/select", controller.getForSelect);
router.get("/:id", controller.getOne);
router.post("/", validate(patientSchema), controller.create);
router.patch("/:id", validate(updatePatientSchema), controller.update);

// Admin
router.delete("/:id", requireAdmin, controller.remove);

module.exports = router;
