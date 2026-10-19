const express = require("express");
const controller = require("../controllers/user.controller");
const { authenticate, requireAdmin } = require("../middlewares/auth.middleware");

const router = express.Router();

// Admin only
router.use(authenticate, requireAdmin);

router.get("/", controller.getAll);
router.delete("/:id", controller.remove);

module.exports = router;
