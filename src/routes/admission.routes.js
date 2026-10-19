const express = require("express");
const controller = require("../controllers/admission.controller");
const validate = require("../middlewares/validate.middleware");
const { authenticate } = require("../middlewares/auth.middleware");
const {
  admissionSchema,
  listAdmissionsSchema,
} = require("../validations/admission.validation");

const router = express.Router();

router.use(authenticate);

router.get("/", validate(listAdmissionsSchema, "query"), controller.getAll);
router.get("/:id", controller.getOne);
router.post("/", validate(admissionSchema), controller.create);
router.patch("/:id/discharge", controller.discharge);

module.exports = router;
