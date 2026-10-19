const express = require("express");
const controller = require("../controllers/doctor.controller");
const validate = require("../middlewares/validate.middleware");
const { authenticate, requireAdmin } = require("../middlewares/auth.middleware");
const { searchQuerySchema } = require("../validations/common.validation");
const { doctorSchema } = require("../validations/doctor.validation");

const router = express.Router();

router.use(authenticate);

// Any logged-in user
router.get("/", validate(searchQuerySchema, "query"), controller.getAll);
router.get("/select", controller.getForSelect);
router.get("/:id", controller.getOne);

// Admin
router.post("/", requireAdmin, validate(doctorSchema), controller.create);
router.delete("/:id", requireAdmin, controller.remove);

module.exports = router;
