const { z } = require("zod");

// Ported from utils/schema.ts (admissionSchema).
const admissionSchema = z.object({
  patientId: z.string().min(1, { message: "Please select a patient" }),
  doctorId: z.string().min(1, { message: "Please select a doctor" }),
  departmentId: z.string().min(1, { message: "Please select a department" }),
  reason: z.string().optional(),
});

const listAdmissionsSchema = z.object({
  search: z.string().trim().optional(),
  status: z.enum(["ALL", "ADMITTED", "DISCHARGED"]).optional(),
});

module.exports = { admissionSchema, listAdmissionsSchema };
