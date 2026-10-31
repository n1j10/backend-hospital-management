const { z } = require("zod");

// Ported from utils/schema.ts (loginSchema, registerSchema).
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const registerSchema = z.object({
  name: z.string().trim().min(2, { message: "Name must be at least 2 characters" }).max(100),
  email: z.string().trim().toLowerCase().email({ message: "Invalid email address" }),
  // bcrypt only uses the first 72 bytes, so longer passwords are rejected instead of silently truncated
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(72, { message: "Password must be at most 72 characters" }),
  role: z.enum(["ADMIN", "RECEPTIONIST", "DOCTOR"], {
    message: "Please select a valid role",
  }),
});

module.exports = { loginSchema, registerSchema };
