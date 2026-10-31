const express = require("express");
const controller = require("../controllers/auth.controller");
const validate = require("../middlewares/validate.middleware");
const { authenticate } = require("../middlewares/auth.middleware");
const rateLimit = require("../middlewares/rateLimit.middleware");
const { registerSchema, loginSchema } = require("../validations/auth.validation");

const router = express.Router();

// 10 attempts per IP every 15 minutes against password guessing.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many attempts, please try again in 15 minutes",
});

router.post("/register", authLimiter, validate(registerSchema), controller.register);
router.post("/login", authLimiter, validate(loginSchema), controller.login);
router.get("/me", authenticate, controller.getMe);

module.exports = router;
