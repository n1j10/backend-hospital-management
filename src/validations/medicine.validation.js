const { z } = require("zod");
const { dateString } = require("./common.validation");

// Ported from utils/schema.ts (medicineSchema).
const medicineSchema = z.object({
  name: z.string().min(2, { message: "Medicine name is required" }),
  categoryId: z.string().min(1, { message: "Please select a category" }),
  quantity: z.coerce.number().int().min(0, { message: "Quantity must be 0 or more" }),
  unit: z.string().optional(),
  price: z.coerce.number().min(0, { message: "Price must be a positive number" }),
  expiryDate: dateString("Expiry date is required"),
  lowStockThreshold: z.coerce.number().int().min(0).default(10),
});

// No defaults on update, so missing fields stay as they are.
const updateMedicineSchema = medicineSchema
  .extend({ lowStockThreshold: z.coerce.number().int().min(0) })
  .partial();

const listMedicinesSchema = z.object({
  search: z.string().trim().optional(),
  categoryId: z.string().optional(),
});

module.exports = { medicineSchema, updateMedicineSchema, listMedicinesSchema };
