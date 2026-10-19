const { z } = require("zod");

// Ported from utils/schema.ts (categorySchema) - medicine categories.
const categorySchema = z.object({
  name: z.string().min(2, { message: "Category name is required" }),
});

module.exports = { categorySchema };
