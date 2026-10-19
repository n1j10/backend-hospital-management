const { z } = require("zod");

// A date sent as text ("2026-10-16" or an ISO string) that must be a real date.
const dateString = (message) =>
  z
    .string()
    .min(1, message)
    .refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date");

// ?search= used by most list endpoints.
const searchQuerySchema = z.object({
  search: z.string().trim().optional(),
});

module.exports = { dateString, searchQuerySchema };
