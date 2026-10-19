const { z } = require("zod");

// Ported from utils/schema.ts (prescriptionItemSchema).
const prescriptionItemSchema = z.object({
  consultationId: z.string().min(1, { message: "Consultation is required" }),
  medicineId: z.string().min(1, { message: "Please select a medicine" }),
  quantity: z.coerce.number().int().min(1, { message: "Quantity must be at least 1" }),
  dosage: z.string().optional(),
});

module.exports = { prescriptionItemSchema };
