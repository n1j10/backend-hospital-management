const { z } = require("zod");

// Ported from utils/schema.ts (loginSchema, registerSchema).
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(["ADMIN", "RECEPTIONIST", "DOCTOR"], {
    message: "Please select a valid role",
  }),
});

module.exports = { loginSchema, registerSchema };
