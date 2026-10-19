const { z } = require("zod");
const { dateString } = require("./common.validation");

// Ported from utils/schema.ts (patientSchema).
const patientSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  gender: z.enum(["MALE", "FEMALE"], { message: "Please select a gender" }),
  dateOfBirth: dateString("Date of birth is required"),
  phone: z.string().min(7, { message: "Phone number must be at least 7 digits" }),
  address: z.string().optional(),
  bloodType: z.string().optional(),
});

const updatePatientSchema = patientSchema.partial();

module.exports = { patientSchema, updatePatientSchema };
