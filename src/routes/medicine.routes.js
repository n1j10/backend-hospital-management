const express = require("express");
const controller = require("../controllers/medicine.controller");
const validate = require("../middlewares/validate.middleware");
const { authenticate, requireAdmin } = require("../middlewares/auth.middleware");
const {
  medicineSchema,
  updateMedicineSchema,
  listMedicinesSchema,
} = require("../validations/medicine.validation");

const router = express.Router();

router.use(authenticate);

// Any logged-in user
router.get("/", validate(listMedicinesSchema, "query"), controller.getAll);
router.get("/low-stock", controller.getLowStock);
router.get("/expiring", controller.getExpiring);
router.get("/:id", controller.getOne);
router.post("/", validate(medicineSchema), controller.create);
router.patch("/:id", validate(updateMedicineSchema), controller.update);

// Admin
router.delete("/:id", requireAdmin, controller.remove);

module.exports = router;
