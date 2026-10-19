const express = require("express");
const controller = require("../controllers/consultation.controller");
const validate = require("../middlewares/validate.middleware");
const { authenticate } = require("../middlewares/auth.middleware");
const { searchQuerySchema } = require("../validations/common.validation");
const { consultationSchema } = require("../validations/consultation.validation");

const router = express.Router();

router.use(authenticate);

router.get("/", validate(searchQuerySchema, "query"), controller.getAll);
router.get("/:id", controller.getOne);
router.post("/", validate(consultationSchema), controller.create);

module.exports = router;
