const express = require("express");
const controller = require("../controllers/prescription.controller");
const validate = require("../middlewares/validate.middleware");
const { authenticate } = require("../middlewares/auth.middleware");
const { prescriptionItemSchema } = require("../validations/prescription.validation");

const router = express.Router();

router.use(authenticate);

router.post("/", validate(prescriptionItemSchema), controller.create);
router.delete("/:id", controller.remove);

module.exports = router;
