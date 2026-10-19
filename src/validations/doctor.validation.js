const { z } = require("zod");

// Ported from utils/schema.ts (doctorSchema).
const doctorSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  specialization: z.string().min(2, { message: "Specialization is required" }),
  departmentId: z.string().min(1, { message: "Please select a department" }),
});

module.exports = { doctorSchema };
