const { z } = require("zod");

// Ported from utils/schema.ts (departmentSchema).
const departmentSchema = z.object({
  name: z.string().min(2, { message: "Department name must be at least 2 characters" }),
  description: z.string().optional(),
});

const updateDepartmentSchema = departmentSchema.partial();

module.exports = { departmentSchema, updateDepartmentSchema };
