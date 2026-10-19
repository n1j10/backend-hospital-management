const { z } = require("zod");
const { dateString } = require("./common.validation");

const STATUSES = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];

// Ported from utils/schema.ts (appointmentSchema).
const appointmentSchema = z.object({
  patientId: z.string().min(1, { message: "Please select a patient" }),
  doctorId: z.string().min(1, { message: "Please select a doctor" }),
  departmentId: z.string().min(1, { message: "Please select a department" }),
  scheduledAt: dateString("Scheduled date/time is required"),
  reason: z.string().optional(),
});

// updateAppointmentStatusAction read the status from the form without checking it.
const updateStatusSchema = z.object({
  status: z.enum(STATUSES, { message: "Invalid appointment status" }),
});

// "ALL" (or no status) means no filter.
const listAppointmentsSchema = z.object({
  search: z.string().trim().optional(),
  status: z.enum(["ALL", ...STATUSES]).optional(),
});

module.exports = { appointmentSchema, updateStatusSchema, listAppointmentsSchema };
