const express = require("express");
const controller = require("../controllers/category.controller");
const validate = require("../middlewares/validate.middleware");
const { authenticate, requireAdmin } = require("../middlewares/auth.middleware");
const { categorySchema } = require("../validations/category.validation");

const router = express.Router();

router.use(authenticate);

// Any logged-in user
router.get("/", controller.getAll);

// Admin
router.post("/", requireAdmin, validate(categorySchema), controller.create);
router.delete("/:id", requireAdmin, controller.remove);

module.exports = router;
