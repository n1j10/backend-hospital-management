const { z } = require("zod");

// Ported from utils/schema.ts (consultationSchema).
const consultationSchema = z.object({
  appointmentId: z.string().min(1, { message: "Appointment is required" }),
  // Optional: taken from the appointment when not sent.
  patientId: z.string().min(1).optional(),
  doctorId: z.string().min(1).optional(),
  diagnosis: z.string().optional(),
  notes: z.string().optional(),
});

module.exports = { consultationSchema };
