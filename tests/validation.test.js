const test = require("node:test");
const assert = require("node:assert/strict");
const { registerSchema } = require("../src/validations/auth.validation");
const { patientSchema } = require("../src/validations/patient.validation");
const {
  updateStatusSchema,
  listAppointmentsSchema,
} = require("../src/validations/appointment.validation");
const {
  medicineSchema,
  updateMedicineSchema,
} = require("../src/validations/medicine.validation");
const { prescriptionItemSchema } = require("../src/validations/prescription.validation");

const validPatient = {
  fullName: "Hussein Ali",
  gender: "MALE",
  dateOfBirth: "1985-03-12",
  phone: "07701234567",
};

const validMedicine = {
  name: "Paracetamol",
  categoryId: "cat_1",
  quantity: "50",
  price: "1.5",
  expiryDate: "2030-01-01",
};

test("register: rejects an unknown role", () => {
  const result = registerSchema.safeParse({
    name: "Ali",
    email: "ali@hospital.com",
    password: "secret123",
    role: "NURSE",
  });

  assert.equal(result.success, false);
  assert.equal(result.error.issues[0].message, "Please select a valid role");
});

test("patient: accepts a valid patient", () => {
  assert.equal(patientSchema.safeParse(validPatient).success, true);
});

test("patient: rejects an invalid date of birth", () => {
  const result = patientSchema.safeParse({ ...validPatient, dateOfBirth: "not-a-date" });
  assert.equal(result.success, false);
});

test("patient: rejects a short phone number", () => {
  const result = patientSchema.safeParse({ ...validPatient, phone: "123" });
  assert.equal(result.success, false);
});

test("appointment: status must be a known status", () => {
  assert.equal(updateStatusSchema.safeParse({ status: "CONFIRMED" }).success, true);
  assert.equal(updateStatusSchema.safeParse({ status: "DONE" }).success, false);
});

test("appointment list: accepts ALL as a status filter", () => {
  assert.equal(listAppointmentsSchema.safeParse({ status: "ALL" }).success, true);
});

test("medicine: coerces numbers from text and defaults the threshold", () => {
  const result = medicineSchema.safeParse(validMedicine);

  assert.equal(result.success, true);
  assert.equal(result.data.quantity, 50);
  assert.equal(result.data.price, 1.5);
  assert.equal(result.data.lowStockThreshold, 10);
});

test("medicine: rejects a negative quantity", () => {
  const result = medicineSchema.safeParse({ ...validMedicine, quantity: -1 });
  assert.equal(result.success, false);
});

test("medicine update: does not reset the threshold when it is missing", () => {
  const result = updateMedicineSchema.safeParse({ quantity: 5 });

  assert.equal(result.success, true);
  assert.equal("lowStockThreshold" in result.data, false);
});

test("prescription: quantity must be at least 1", () => {
  const result = prescriptionItemSchema.safeParse({
    consultationId: "c1",
    medicineId: "m1",
    quantity: 0,
  });

  assert.equal(result.success, false);
});

test("register: rejects a password shorter than 8 characters", () => {
  const result = registerSchema.safeParse({
    name: "Ali",
    email: "ali@hospital.com",
    password: "secret1",
    role: "DOCTOR",
  });

  assert.equal(result.success, false);
  assert.equal(result.error.issues[0].message, "Password must be at least 8 characters");
});

test("register: normalizes the email", () => {
  const result = registerSchema.safeParse({
    name: "Ali",
    email: "  Ali@Hospital.COM ",
    password: "secret123",
    role: "DOCTOR",
  });

  assert.equal(result.success, true);
  assert.equal(result.data.email, "ali@hospital.com");
});
